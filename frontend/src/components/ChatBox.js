  import React, { useState } from 'react';
  import { axiosInstance } from '../services/authService';
  import './ChatBox.css';
  
  const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

  
    const sendMessage = async () => {
      if (input.trim() === '') return;
  
      const newMessage = { text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      
      setLoading(true); // Start spinner

      try {
        const chatResponse = await axiosInstance.post('/game/chat', { message: input });
        setMessages(prevMessages => [...prevMessages,
                                     { text: `Name: ${chatResponse.data.message.Name}\nCost: ${chatResponse.data.message.Cost}\nDamage: ${chatResponse.data.message.Damage}\nEffect: ${chatResponse.data.message.Effect}\nType: ${chatResponse.data.message.Type}\nDescription: ${chatResponse.data.message.Description}`,
                                      sender: 'bot' }]);
  
  
        if (input.toLowerCase().includes("generate image") || input.toLowerCase().includes("create image")) {
  
          const imageResponse = await axiosInstance.post('/game/chat-image', { description: chatResponse.data.message.Description });
          console.log("Image Response:", imageResponse.data); 
          if (imageResponse.data.gcsUrl) {
            setImageUrls(prevUrls => [...prevUrls, imageResponse.data.gcsUrl]);
          } else {
            setMessages(prevMessages => [...prevMessages, { text: 'Error generating image.', sender: 'bot' }]);
          }
        }
  
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error: Unable to get response from the server.', sender: 'bot' }]);
      } finally{
        setLoading(false); // Stop spinner

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
        {loading && <div className="spinner"></div>} {/* Spinner displayed when loading is true */}

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
  