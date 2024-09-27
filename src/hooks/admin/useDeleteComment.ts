import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for DeleteComment
export type DeleteComment = {
  id: string;
};

// Delete data
const deleteComment = async ({ id }: DeleteComment) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.delete(`${baseUrl}/api/admin/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting comment!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "comments" query key
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};
