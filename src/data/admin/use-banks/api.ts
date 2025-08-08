import axios from "axios";
import { chapaApiClient } from "../../common/chapa-api-client";
import { Bank } from "./types";

export const getBanksFromChapa = async (): Promise<{ data: Bank[] }> => {
  try {
    const response = await chapaApiClient.get("/banks");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banks from Chapa");
    }
    throw new Error("Network error occurred");
  }
};
