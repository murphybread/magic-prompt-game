import React, { useState } from 'react';
import { login, register, guestLogin } from '../services/authService';
import APITester from './APITester';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token;
      if (isRegistering) {
        token = await register(username, password);
      } else {
        token = await login(username, password);
      }
      onLogin(token);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const token = await guestLogin();
      onLogin(token);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </button>
      <button onClick={handleGuestLogin}>Guest Login</button>
      <APITester />
    </div>
  );
};

export default Login;
