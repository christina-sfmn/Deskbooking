import { useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  logout as logoutService,
  getToken,
} from "./authService";

const useAuth = () => {
  // State for authentication and loading state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Update authentication status
  const updateAuthStatus = useCallback(() => {
    const token = getToken();
    const authStatus = !!token;
    setIsAuthenticated(authStatus);
  }, []);

  useEffect(() => {
    updateAuthStatus();
    setLoading(false);
  }, [updateAuthStatus]);

  // Log updated authentication status
  useEffect(() => {}, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginService(email, password);
      updateAuthStatus(); // Update status immsediately after successful login
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = useCallback(() => {
    logoutService();
    updateAuthStatus(); // Update status after successful logout
  }, [updateAuthStatus]);

  return { isAuthenticated, loading, login, logout, updateAuthStatus };
};

export default useAuth;
