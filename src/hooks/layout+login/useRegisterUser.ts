import axios from "axios";
import { useMutation } from "react-query";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

interface RegisterUserData {
  firstname: string;
  lastname: string;
  email: string;
  department: string;
  password: string;
}

const registerUser = async (userData: RegisterUserData): Promise<void> => {
  try {
    await axios.post(`${baseUrl}/api/users/register`, userData);
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message || "Error registering user";
      if (error.response.status === 409) {
        throw new Error("User already exists");
      }
      throw new Error(errorMessage);
    }
    throw new Error("An unknown error occurred");
  }
};

// Hook for user registration
export const useRegisterUser = () => {
  return useMutation(registerUser);
};
