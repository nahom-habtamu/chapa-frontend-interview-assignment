import axios from "axios";

const CHAPA_API_URL = process.env.NEXT_PUBLIC_CHAPA_API_URL || "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY;

if (!CHAPA_SECRET_KEY) {
  console.warn("NEXT_PUBLIC_CHAPA_SECRET_KEY is not set. Chapa API calls will fail.");
}

export const chapaApiClient = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

chapaApiClient.interceptors.request.use(
  (config) => {
    console.log(`Chapa API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chapaApiClient.interceptors.response.use(
  (response) => {
    console.log(`Chapa API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("Chapa API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
); 