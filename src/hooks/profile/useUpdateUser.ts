import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";
import { UserObject } from "../../types";

const baseUrl = "https://deskbooking.dev.webundsoehne.com"; // Base URL

// Type for UpdateUserInput
export type UpdateUserInput = {
  userId: string;
  data: Partial<UserObject>;
};

// Put data
const updateUser = async ({ userId, data }: UpdateUserInput) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.put(
      `${baseUrl}/api/users/${userId}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating user data!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "user" query key
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};