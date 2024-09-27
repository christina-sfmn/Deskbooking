import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Fetch all desks
const getAllDesks = async () => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/desks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching desks!");
  }
};

// Execute function
export const useGetAllDesks = () => {
  return useQuery("allDesks", getAllDesks);
};
