import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "./layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for DeleteFixdeskRequest
export type DeleteFixdeskRequest = {
  id: string;
};

// Delete data
const deleteFixdeskRequest = async ({ id }: DeleteFixdeskRequest) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.delete(
      `${baseUrl}/api/fixdesk-requests/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error deleting FixDesk request!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "fixdesks" query key
export const useDeleteFixdeskRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteFixdeskRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixdesks"] });
    },
    onError: (error) => {
      console.error("Error deleting FixDesk request:", error);
    },
  });
};
