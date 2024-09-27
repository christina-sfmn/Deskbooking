import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for CreateDesk
export type CreateDesk = {
  label: string;
  office: string;
  equipment: string[];
};

// Post data
const createDesk = async ({ label, office, equipment }: CreateDesk) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/admin/desks`,
      { label, office, equipment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error creating desk!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "desks" query key
export const useCreateDesk = () => {
  const queryClient = useQueryClient();

  return useMutation(createDesk, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desks"] });
    },
    onError: (error) => {
      console.error("Error creating desk:", error);
    },
  });
};
