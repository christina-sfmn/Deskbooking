import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

const getOffices = async () => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/offices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching offices!");
  }
};

export const useGetAllOffices = () => {
  const token = getToken();
  return useQuery(["offices", token], getOffices, {
    enabled: !!token, // Use query only if token is set
  });
};
