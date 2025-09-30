import axios from "axios";
export const baseURLAssets = "http://localhost:4000";
export const baseURL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: baseURL,
});

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
