import axios from "axios";

const apiUrl = "https://deskbooking.dev.webundsoehne.com";

// Function to retrieve the token from localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("token");
  return token;
};

// Login function
const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/api/users/login`, {
      email,
      password,
    });
    const token = response.data.token; // Extract the token from the response
    localStorage.setItem("token", token); // Save the token in localStorage
  } catch (error) {
    throw new Error("Login failed");
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem("token"); // Remove the token from localStorage
};

export { login, logout, getToken };
