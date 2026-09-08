import axios from "axios";

// IMPORTANT: In production (Vercel), set VITE_API_URL env variable
// to your deployed backend URL, e.g. https://your-app.onrender.com/api
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;