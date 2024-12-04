import axios from "axios";
import { logVars,logErrors } from "../utils/logging.js";


const API_URL =
  process.env.REACT_APP_API_URL || "https://default-url.example.com/api";

  logVars("API_URL in authService:", API_URL);

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (username, password) => {

  try {
    const response = await axiosInstance.post("/auth/register", {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    logErrors("Registration error:", error);
    if (error.response) {
      logErrors("Error response:", error.response.data);
      logErrors("Error status:", error.response.status);
    } else if (error.request) {
      logErrors("Error request:", error.request);
    } else {
      logErrors("Error message:", error.message);
    }
    throw error;
  }
};

export const login = async (username, password) => {

  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", username);
    return response.data.token;
  } catch (error) {
    logErrors("Login error:", error);
    throw error;
  }
};

export const guestLogin = async () => {
  try {
    const response = await axiosInstance.post("/auth/guest");
    return response.data.token;
  } catch (error) {
    logErrors("Guest login error:", error);
    throw error;
  }
};

export const deleteUser = async (username, token) => {

  try {
    const response = await axiosInstance.delete("/auth/delete", {
      data: { username },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    logErrors("Error deleting user:", error);
    if (error.response) {
      logErrors("Error response:", error.response.data);
      logErrors("Error status:", error.response.status);
    } else if (error.request) {
      logErrors("Error request:", error.request);
    } else {
      logErrors("Error message:", error.message);
    }
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    logErrors("Error updating user profile:", error);
    throw error;
  }
};
