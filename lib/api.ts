import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const PUBLIC_ENDPOINTS = [
  "/user/register/",
  "/user/login/",
  "/user/token/refresh",
];

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");

    const isPubilc = PUBLIC_ENDPOINTS.some((path) =>
      config.url?.startsWith(path)
    );

    if (token && !isPubilc) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  }
  return config;
});

export default api;
