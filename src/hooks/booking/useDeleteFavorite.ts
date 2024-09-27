import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Type for DeleteFavorite
export type DeleteFavorite = {
  id: string;
};

// Delete data
const deleteFavorite = async ({ id }: DeleteFavorite) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.delete(`${baseUrl}/api/favourites/${id}`, 
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error removing from favorites!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "favorites" query key
export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteFavorite, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Error removing from favorites:", error);
    },
  });
};
