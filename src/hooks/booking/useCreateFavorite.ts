import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Type for CreateFavorite
export type CreateFavorite = {
  desk: string;
};

// Post data
const createFavorite = async ({ desk }: CreateFavorite) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/favourites`, { desk },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error adding to favorites!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "favorites" query key
export const useCreateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation(createFavorite, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Error adding to favorites:", error);
    },
  });
};
