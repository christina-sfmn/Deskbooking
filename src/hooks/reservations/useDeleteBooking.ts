import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for DeleteBooking
export type DeleteBooking = {
  id: string;
};

// Delete data
const deleteBooking = async ({ id }: DeleteBooking) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.delete(`${baseUrl}/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting booking!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "bookings" query key
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });
};
