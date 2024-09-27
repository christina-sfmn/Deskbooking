import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

const getDeskById = async (deskId: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.get(`${baseUrl}/api/desks/${deskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching desk:", error);
    throw new Error("Error fetching desk!");
  }
};

export const useGetDeskById = (deskId: string) => {
  return useQuery(["desk", deskId], () => getDeskById(deskId), {
    enabled: !!deskId, // Only run the query if userId is available
  });
};
