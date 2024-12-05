import { OpenAI } from "openai";
import { Storage } from "@google-cloud/storage";
import path from "path";
import axios from "axios";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// 커스텀 logging 설정
import { logVars, logSecrets, logErrors } from "../utils/logging.js";


// Start initial settings
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });
const EXIT_KEYWORD = "ww";


const MagicSpell = z.object({
  Name: z.string(),
  Cost: z.string(),
  Damage: z.string(),
  Effect: z.string(),
  Type: z.string(),
  Description: z.string(),
});

const SYSTEM_ROLE = `You are the history that creates the magic. You create new magic with the input of your users.

You'll ask 4 questions by default.
If you need more, you'll be asked up to 4 more questions.
Finally, you'll be asked 1 question.
If you don't have enough information, you should ask questions to gather information. 

The 4 basic questions
1. What kind of personality are you?
2. What is your current state of mind?
3. What is your intention in creating this magic?
4. What do you consider to be the most important aspect of this spell?

(additional questions as needed, usually not necessary)

1 final question
Ask to your user to describe magic. Shape or condition whatever. Ask them what it looks like or how it looks.
`;

// Google Cloud Storage Client Setting
const storage = new Storage({
  keyFilename: path.join(__dirname, "..", "config", process.env.GCS_KEY_FILE_PATH), // JSON File Path of Google Cloud Storage service user
});

const bucketName = process.env.GCS_BUCKET_NAME; // GCS Bucket name

// Image Download and Upload to GCS
export const downloadAndUploadImage = async (imageUrl, description) => {
  try {
    // Image Download
    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
    });

    // Content-Type Validation
    const contentType = response.headers["content-type"];
    if (!contentType.startsWith("image/")) {
      throw new Error("This URL is not an image file");
    }

    // File Extension Extraction
    const extension = contentType.split("/")[1].split(";")[0];
    logVars("content: ", contentType);

    // Unique File Name Creation by Prompt
    const filename = `${description}.${extension}`;
    const storagePath = `images/${filename}`;

    // GCS Bucket Object Creation
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(storagePath);

    // Upload Image Stream to GCS
    const stream = response.data.pipe(
      file.createWriteStream({
        metadata: {
          contentType: contentType,
        },
      })
    );

    // Create Public URL after Upload
    return new Promise((resolve, reject) => {
      stream.on("finish", async () => {
        try {
          await file.makePublic();

          const encodedFileName = encodeURIComponent(file.name);
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodedFileName}`;
          resolve(publicUrl);
        } catch (err) {
          reject(err);
        }
      });

      stream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    logErrors("Image Download and Upload Error:", error.message);
    throw error;
  }
};

export const generateImage = async (req, res) => {
  try {
    const { description } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    logSecrets("Image URL created by OpenAI:", imageUrl);

    const gcsUrl = await downloadAndUploadImage(imageUrl, description);
    logSecrets("Image URL uploaded to GCS:", gcsUrl);

    res.json({ gcsUrl });
  } catch (error) {
    logErrors("Error generating image:", error);
    if (error.code === "billing_hard_limit_reached") {
      return res
        .status(400)
        .json({
          message: "Billing limit has been reached. Please check your OpenAI account.",
        });
    }

    res.status(500).json({ message: "Error generating image" });
  }
};

export const generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: SYSTEM_ROLE,
        },
        { role: "user", content: message },
      ],
      response_format: zodResponseFormat(MagicSpell, "magicspell"),
    });

    const zodResponse = response.choices[0].message.parsed;
    logSecrets(`zodResponse : ${zodResponse}`);
    logSecrets(`chat zodresponse description: ${zodResponse.Description}`);

    res.json({ message: zodResponse });
  } catch (error) {
    logErrors("Error generating chat response:", error);
    res.status(500).json({ message: "Error generating chat response" });
  }
};

export const startConversation = async (req, res) => {
  const { messages, userResponse } = req.body;
  const EXIT_KEYWORD = "ww";

  
  logSecrets("Initial messages", JSON.stringify(messages, null, 2));

  if (!messages || !Array.isArray(messages)) {
    logVars("Invalid messages format");
    return res.status(400).json({ message: "Invalid messages format" });
  }

  if (!userResponse) {
    logVars("User response is required");
    return res.status(400).json({ message: "User response is required" });
  }

  if (!messages.find(msg => msg.role === 'system')) {
    const systemRole = SYSTEM_ROLE;
    messages.unshift({ role: 'system', content: systemRole });
    logSecrets("Added SYSTEM_ROLE to messages:", JSON.stringify(messages, null, 2));
  }

  addMessage('user', userResponse, messages);
  logSecrets("Updated user messages:", JSON.stringify(messages, null, 2));

  if (userResponse.toLowerCase().includes(EXIT_KEYWORD)) {
    logVars("Conversation has been terminated.");
    const orderUserMessage = messages[messages.length - 1].content;
    logSecrets(`Order User Message: `, orderUserMessage);

    try {
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-11-20",
        messages: [
          {
            role: "system",
            content: "In a magical world, users provide a simple string and a mana value as input. **If no mana is mentioned, the default input cost is 10.** Based on this string, a magic spell is created with the following attributes:\n\n- **Description**: Depicts the spell's appearance based on the input prompt, including aspects like size, shape, color, patterns, and similarities to objects or scenarios.\n- **Attack Power**: A numerical value representing the spell's offensive strength.\n- **Cost**: A numerical value indicating the mana required to cast the spell.\n- **Effect**: A narrative description of what the spell does.\n- **Type**: Assigns an appropriate attribute to the spell. Common elements like fire, water, grass, and earth are acceptable, but depending on the description, it can also include diverse attributes like mirror, blood, darkness, time, fluid, etc.\n- **Name**: A concise summary of the spell.\n\nAll spells vary in power based on the mana input, even under the same conditions. For example, with the same prompt, a spell created with mana 1 and mana 10 will differ significantly in attack power, cost, description, name, and effect.\n\n**Example:**\n\nInput prompt: *\"fire ball with soccer ball\"*\n\nMana: **1**\n\n- **Name**: Fire Soccer Ball\n- **Attack Power**: 10\n- **Cost**: 2\n- **Description**: A small fireball about the size of a soccer ball that looks incomplete. It has great offense but can also explode when cast.\n- **Effect**: The caster has a chance to take damage themselves.\n- **Type**: Fire",
          },
          ...messages.slice(1)
        ],
        response_format: zodResponseFormat(MagicSpell, "free"),
      });

      const zodResponse = response.choices[0].message.parsed;
      if (!zodResponse || !zodResponse.Description) {
        throw new Error("Invalid  zod response format");
      }

      logSecrets(`Parsed Format`, JSON.stringify(zodResponse));
      logSecrets(`Chat response description`, zodResponse.Description);

      const stringifiedZodResponse = Object.entries(zodResponse).map(([key, value]) => `${key}: ${value}`).join('\n');

      addMessage('assistant', stringifiedZodResponse , messages);

      logSecrets("Final stringifiedZodResponse\n", stringifiedZodResponse);


      return res.json({ description: zodResponse.Description, assistantResponse: stringifiedZodResponse });
    } catch (error) {
      logErrors("Error generating spell response:", error);
      return res.status(500).json({ message: "Error generating spell response" });
    }
  }

try {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-2024-11-20',
    messages: messages,
  });

  const assistantResponse = response.choices[0].message.content;
  addMessage('assistant', assistantResponse, messages);
  logSecrets("Assistant Response:", assistantResponse);
  return res.json({ assistantResponse });
} catch (error) {
  logErrors("Error during API call:", error.message);
  return res.status(500).json({ message: "Error during API call" });
}
};

function addMessage(role, content, messages) {
  messages.push({ role, content });
}