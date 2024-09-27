import axios from "axios";
import { useQuery } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

const getAllFavorites = async (userId: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.get(
      `${baseUrl}/api/favourites/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error("Error fetching favorites!");
  }
};

export const useGetAllFavoritesForUser = (userId: string) => {
  return useQuery(["favorites", userId], () => getAllFavorites(userId), {
    enabled: !!userId, // Only run the query if userId is available
  });
};
