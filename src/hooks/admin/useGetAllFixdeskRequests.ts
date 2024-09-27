import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Fetch data
const getFixdeskRequests = async () => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/admin/fix-desk-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching FixDesk requests!");
  }
};

// Execute function
export const useGetAllFixdeskRequests = () => {
  const token = getToken();
  return useQuery(["fixdesks", token], getFixdeskRequests, {
    enabled: !!token, // Use query only if token is set
  });
};
