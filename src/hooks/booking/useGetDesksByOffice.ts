import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Fetch data
const getDesks = async () => {
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

// Filter desks based on office ID
const filterDesksByOffice = (desks: any[], officeId: string) => {
  return desks.filter((desk) => desk.office.id === officeId);
};

// Execute function
export const useGetDesksByOffice = (officeId?: string) => {
  const token = getToken(); // Token abrufen

  return useQuery(
    ["desks", officeId, token],
    async () => {
      const desks = await getDesks();
      if (officeId) {
        return filterDesksByOffice(desks, officeId);
      }
      return []; // Return empty array if no office ID is provided
    },
    {
      enabled: !!officeId && !!token, // Only run query if office ID & token are provided
    }
  );
};
