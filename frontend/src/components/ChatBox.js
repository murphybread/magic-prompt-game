import React, { useState } from 'react';
import { axiosInstance } from '../services/authService';
import './ChatBox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHatWizard } from '@fortawesome/free-solid-svg-icons';

import { logErrors } from "../utils/logging.js";

const ChatBox = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "1. What kind of personality are you?" }]);
  const [input, setInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state


  const sendMessage = async () => {
    if (input.trim() === '') return;

    
    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true); // Start spinner

    try {


      
      const response = await axiosInstance.post('/game/start-conversation', {
        messages: messages,
        userResponse: input,
      });

      const { assistantResponse ,description } = response.data;

      if (assistantResponse) {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'assistant', content: assistantResponse },
        ]);
      }

      if (description) {
        const imageResponse = await axiosInstance.post('/game/chat-image', { description});
        if (imageResponse.data.gcsUrl) {
          setImageUrls(prevUrls => [...prevUrls, imageResponse.data.gcsUrl]);
        } else {
          setMessages(prevMessages => [...prevMessages, { text: 'Error generating image.', sender: 'bot' }]);
        }

      }





    } catch (error) {
      logErrors('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Error: Unable to get response from the server.' },
      ]);
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
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
      {loading && <div className="spinner"></div>}
      <div className="chat-response">
      {messages.map((message, index) => (
        <div key={index} className={`message-container ${message.role}`}>
          <div className="icon-container">
            {message.role === 'user' ? (
              <FontAwesomeIcon icon={faUser} />
            ) : (
              <FontAwesomeIcon icon={faHatWizard} />
            )}
          </div>
          <pre className={`message ${message.role}`}>
           {message.content}
          </pre>
        </div>
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
}

export default ChatBox;
