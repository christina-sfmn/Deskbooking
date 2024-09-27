import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Post data
const createFixdeskRequest = async (fixdesk: { desk: string }) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/fixdesk-requests`,
      {
        desk: fixdesk.desk,
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

// Execute function when mutation succeeds -> invalidate queries with "fixdesk" query key
export const useCreateFixdeskRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(createFixdeskRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixdesk"] });
    },
    onError: (error) => {
      console.error("Error creating FixDesk request:", error);
    },
  });
};
