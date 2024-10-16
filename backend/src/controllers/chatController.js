const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

exports.generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a helpful assistant in a magic-themed game."},
        {role: "user", content: message}
      ],
    });

    const botResponse = response.choices[0].message.content;
    res.json({ message: botResponse });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ message: 'Error generating chat response' });
  }
};

exports.testOpenAI = async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: "Hello, are you working?"}
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
