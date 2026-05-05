

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: { "Content-Type": "application/json" },
  withCredentials: true, //  needed if backend sends cookies
});

// Automatically attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;