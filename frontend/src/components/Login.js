import React, { useState, useEffect } from 'react';
import { login, register, guestLogin } from '../services/authService';
import APITester from './APITester';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check for token in URL params (for social login callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      onLogin(token, 'Social User');
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onLogin]);

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
      onLogin(token, username);
    } catch (error) {
      console.error('Authentication error:', error.message);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const token = await guestLogin();
      onLogin(token, 'Guest');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
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
      <button onClick={() => handleSocialLogin('google')} className="social-button google-button">
        Login with Google
      </button>
      <button onClick={() => handleSocialLogin('twitter')} className="social-button twitter-button">
        Login with Twitter
      </button>
      <APITester />
    </div>
  );
};

export default Login;
