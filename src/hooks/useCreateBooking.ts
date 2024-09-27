import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Post data
const createBooking = async (booking: {
  dateStart: string;
  dateEnd: string;
  desk: string;
}) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/bookings`,
      {
        dateStart: booking.dateStart,
        dateEnd: booking.dateEnd,
        desk: booking.desk,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error; // Errorhandling for display in DeskDetail component
  }
};

// Execute function when mutation succeeds -> invalidate queries with "bookings" query key
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(createBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Error creating FlexDesk booking:", error);
    },
  });
};
