import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const register = async (username, password) => {
  console.log('Attempting to register user:', username);
  console.log('API_URL:', process.env.REACT_APP_API_URL);
  const fullUrl = `${process.env.REACT_APP_API_URL}/auth/register`;
  console.log('Full registration URL:', fullUrl);
  try {
    const response = await axiosInstance.post('/auth/register', { username, password });
    console.log('Registration response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const guestLogin = async () => {
  try {
    const response = await axiosInstance.post('/auth/guest');
    return response.data.token;
  } catch (error) {
    console.error('Guest login error:', error);
    throw error;
  }
};
