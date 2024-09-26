import React, { useState } from 'react';
import { login, register, guestLogin } from '../services/authService';
import APITester from './APITester';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token;
      if (isRegistering) {
        console.log('Attempting to register user:', username);
        token = await register(username, password);
      } else {
        console.log('Attempting to log in user:', username);
        token = await login(username, password);
      }
      console.log('Authentication successful, token received');
      onLogin(token);
    } catch (error) {
      console.error('Authentication error:', error.message);
      alert(error.response ? error.response.data.message : error.message);
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
    <div className={`login-container ${isRegistering ? 'register' : 'login'}`}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
      <button onClick={() => setIsRegistering(!isRegistering)} className="switch-button">
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </button>
      <button onClick={handleGuestLogin} className="guest-button">Guest Login</button>
      <APITester />
    </div>
  );
};

export default Login;
