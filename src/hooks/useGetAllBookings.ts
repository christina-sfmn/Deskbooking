import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Fetch data
const getBookings = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found!");
  }
  try {
    const response = await axios.get(`${baseUrl}/api/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching bookings!");
  }
};

// Execute function
export const useGetAllBookings = () => {
  const token = getToken();
  return useQuery(["bookings", token], getBookings, {
    enabled: !!token, // Use query only if token is set
  });
};
