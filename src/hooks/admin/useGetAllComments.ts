import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Fetch data
const getComments = async () => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/comments?page=0`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching comments!");
  }
};

// Execute function
export const useGetAllComments = () => {
  const token = getToken();
  return useQuery(["comments", token], getComments, {
    enabled: !!token, // Use query only if token is set
  });
};
