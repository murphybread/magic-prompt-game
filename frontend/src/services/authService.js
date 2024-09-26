import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (username, password) => {
  console.log('Attempting to register user:', username);
  console.log('API_URL:', process.env.REACT_APP_API_URL);
  const fullUrl = `${process.env.REACT_APP_API_URL}/auth/register`;
  console.log('Full registration URL:', fullUrl);
  try {
    const response = await axios.post(fullUrl, { username, password });
    console.log('Registration response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data.token;
};

export const guestLogin = async () => {
  const response = await axios.post(`${API_URL}/auth/guest`);
  return response.data.token;
};
