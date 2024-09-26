import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data.token;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data.token;
};

export const guestLogin = async () => {
  const response = await axios.post(`${API_URL}/auth/guest`);
  return response.data.token;
};
