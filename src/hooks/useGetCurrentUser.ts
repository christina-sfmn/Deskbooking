import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Fetch data
const getCurrentUser = async () => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching current user data!");
  }
};

// Execute function
export const useGetCurrentUser = () => {
  const token = getToken();
  return useQuery(["currentUser", token], getCurrentUser, {
    enabled: !!token, // Use query only if token is set
  });
};

