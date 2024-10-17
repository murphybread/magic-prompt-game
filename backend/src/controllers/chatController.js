const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Error generating image' });
  }
};

exports.generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "In a magical world, users provide a simple string and a mana value as input. **If no mana is mentioned, the default input mana is 10.** Based on this string, a magic spell is created with the following attributes:\n\n- **Description**: Depicts the spell's appearance based on the input prompt, including aspects like size, shape, color, patterns, and similarities to objects or scenarios.\n- **Attack Power**: A numerical value representing the spell's offensive strength.\n- **Cost**: A numerical value indicating the mana required to cast the spell.\n- **Effect**: A narrative description of what the spell does.\n- **Type**: Assigns an appropriate attribute to the spell. Common elements like fire, water, grass, and earth are acceptable, but depending on the description, it can also include diverse attributes like mirror, blood, darkness, time, fluid, etc.\n- **Name**: A concise summary of the spell.\n\nAll spells vary in power based on the mana input, even under the same conditions. For example, with the same prompt, a spell created with mana 1 and mana 10 will differ significantly in attack power, cost, description, name, and effect.\n\n**Example:**\n\nInput prompt: *\"fire ball with soccer ball\"*\n\nMana: **1**\n\n- **Name**: Fire Soccer Ball\n- **Attack Power**: 10\n- **Cost**: 2\n- **Description**: A small fireball about the size of a soccer ball that looks incomplete. It has great offense but can also explode when cast.\n- **Effect**: The caster has a chance to take damage themselves.\n- **Type**: Fire",
        },
        { role: "user", content: message },
      ],
    });

    const botResponse = response.choices[0].message.content;
    const formattedResponse = botResponse.split('\n').map(line => line.trim()).join('\n');
    res.json({ message: formattedResponse });

  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ message: 'Error generating chat response' });
  }
};

exports.testOpenAI = async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {role: "system", content: "In a magical world, users provide a simple string and a mana value as input. **If no mana is mentioned, the default input mana is 10.** Based on this string, a magic spell is created with the following attributes:\n\n- **Description**: Depicts the spell's appearance based on the input prompt, including aspects like size, shape, color, patterns, and similarities to objects or scenarios.\n- **Attack Power**: A numerical value representing the spell's offensive strength.\n- **Cost**: A numerical value indicating the mana required to cast the spell.\n- **Effect**: A narrative description of what the spell does.\n- **Type**: Assigns an appropriate attribute to the spell. Common elements like fire, water, grass, and earth are acceptable, but depending on the description, it can also include diverse attributes like mirror, blood, darkness, time, fluid, etc.\n- **Name**: A concise summary of the spell.\n\nAll spells vary in power based on the mana input, even under the same conditions. For example, with the same prompt, a spell created with mana 1 and mana 10 will differ significantly in attack power, cost, description, name, and effect.\n\n**Example:**\n\nInput prompt: *\"fire ball with soccer ball\"*\n\nMana: **1**\n\n- **Name**: Fire Soccer Ball\n- **Attack Power**: 10\n- **Cost**: 2\n- **Description**: A small fireball about the size of a soccer ball that looks incomplete. It has great offense but can also explode when cast.\n- **Effect**: The caster has a chance to take damage themselves.\n- **Type**: Fire"}
      ],
    });

    const botResponse = response.choices[0].message.content;
    console.log('OpenAI API Test Response:', botResponse);
    res.json({ message: 'OpenAI API is working', response: botResponse });
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    res.status(500).json({ message: 'Error testing OpenAI API', error: error.message });
  }
};
