import axios from "axios";
import { Bank } from "./types";


const chapaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getBanksFromChapa = async (): Promise<{ data: Bank[] }> => {
  try {
    const response = await chapaApi.get("/banks");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banks from Chapa");
    }
    throw new Error("Network error occurred");
  }
};
