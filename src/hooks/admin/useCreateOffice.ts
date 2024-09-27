import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for CreateOffice
export type CreateOffice = {
  name: string;
  columns: number;
  rows: number;
};

// Post data
const createOffice = async ({ name, columns, rows }: CreateOffice) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/admin/offices`,
      { name, columns, rows },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error creating office!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "offices" query key
export const useCreateOffice = () => {
  const queryClient = useQueryClient();

  return useMutation(createOffice, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
    onError: (error) => {
      console.error("Error creating office:", error);
    },
  });
};
