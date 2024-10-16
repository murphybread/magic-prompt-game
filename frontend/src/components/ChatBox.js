import React, { useState } from 'react';
import { axiosInstance } from '../services/authService';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const chatResponse = await axiosInstance.post('/game/chat', { message: input });
      setMessages(prevMessages => [...prevMessages, { text: chatResponse.data.message, sender: 'bot' }]);


      if (input.toLowerCase().includes("generate image") || input.toLowerCase().includes("create image")) {

        const imageResponse = await axiosInstance.post('/game/chat-image', { prompt: input });
        if (imageResponse.data.imageUrl) {
          setImageUrls(prevUrls => [...prevUrls, imageResponse.data.imageUrl]);
        } else {
          setMessages(prevMessages => [...prevMessages, { text: 'Error generating image.', sender: 'bot' }]);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Error: Unable to get response from the server.', sender: 'bot' }]);
    }
  };


  return (
    <div className="chat-box">
      <div className="user-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="chat-response">
        {messages.map((message, index) => (
          <pre key={index} className={`message ${message.sender}`}>
            {message.text}
          </pre>
        ))}
      </div>
      {imageUrls.length > 0 && (
        <div className="image-container">
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Generated Image ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
