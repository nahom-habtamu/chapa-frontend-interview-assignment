import axios from "axios";

const PROXY_BASE_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_CHAPA_PROXY_URL
    : "/api/chapa";

export const chapaApiClient = axios.create({
  baseURL: PROXY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

chapaApiClient.interceptors.request.use(
  (config) => {
    console.log(`Chapa API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chapaApiClient.interceptors.response.use(
  (response) => {
    console.log(`Chapa API Response: ${response.status} ${response.config.baseURL}${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("Chapa API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
); 