import axios from "axios";
import { useQuery } from "react-query";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Fetch data
const getDepartments = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${baseUrl}/api/departments`);
    const departments = response.data;
    // Convert the object into an array of department names
    return Object.values(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Error fetching departments!");
  }
};

// Execute function
export const useGetAllDepartments = () => {
  return useQuery("departments", getDepartments);
};
