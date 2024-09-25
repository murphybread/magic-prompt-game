import React, { useState } from 'react';
import axios from 'axios';

const APITester = () => {
  const [method, setMethod] = useState('GET');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      const url = `${process.env.REACT_APP_API_URL}/auth/${method.toLowerCase()}`;
      const data = { username, password };

      switch (method) {
        case 'GET':
          result = await axios.get(url);
          break;
        case 'POST':
          result = await axios.post(url, data);
          break;
        case 'PUT':
          result = await axios.put(url, data);
          break;
        case 'DELETE':
          result = await axios.delete(url, { data });
          break;
        default:
          throw new Error('Invalid method');
      }

      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error.response.data, null, 2));
    }
  };

  return (
    <div>
      <h2>API Tester</h2>
      <form onSubmit={handleSubmit}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Send Request</button>
      </form>
      <pre>{response}</pre>
    </div>
  );
};

export default APITester;
