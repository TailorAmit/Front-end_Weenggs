// utils/api.ts
import axios from "axios";
export const baseURLAssets = "http://localhost:4000";
export const baseURL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: baseURL, // replace with your backend URL
});

// Add JWT token to headers if exists
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
