import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";
import { CommentObject } from "../../types";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

const submitFeedback = async (feedback: CommentObject) => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.post(`${baseUrl}/api/comments`, feedback, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Execute function when mutation succeeds -> invalidate queries with "comments" query key
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation(submitFeedback, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
    },
  });
};
