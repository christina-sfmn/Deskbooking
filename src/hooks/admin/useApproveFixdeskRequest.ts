import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { getToken } from "../layout+login/authService";

const baseUrl = "https://deskbooking.dev.webundsoehne.com";

// Type for ApproveFixdeskRequest
export type ApproveFixdeskRequest = {
  id: string;
  status: "approved";
};

// Put data
const approveFixdeskRequest = async ({ id, status }: ApproveFixdeskRequest) => {
  const token = getToken(); // Token
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/fix-desk-requests`,
      { id, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error approving FixDesk request!");
  }
};

// Execute function when mutation succeeds -> invalidate queries with "fixdesks" query key
export const useApproveFixdeskRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(approveFixdeskRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixdesks"] });
    },
    onError: (error) => {
      console.error("Error approving FixDesk request:", error);
    },
  });
};
