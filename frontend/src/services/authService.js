import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL in authService:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (username, password) => {
  console.log('Attempting to register user:', username);
  console.log('Full registration URL:', `${API_URL}/auth/register`);
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
  console.log('Attempting to log in user:', username);
  console.log('Full login URL:', `${API_URL}/auth/login`);
  try {
    const response = await axiosInstance.post('/auth/login', { username, password });
    console.log('Login response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const guestLogin = async () => {
  console.log('Attempting guest login');
  console.log('Full guest login URL:', `${API_URL}/auth/guest`);
  try {
    const response = await axiosInstance.post('/auth/guest');
    console.log('Guest login response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Guest login error:', error);
    throw error;
  }
};
