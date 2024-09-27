import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "./hooks/layout+login/useAuth";
import { Loader } from "./components/Loader";

const App = () => {
  const { isAuthenticated, loading } = useAuth(); // Authentication from hook
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  useEffect(() => {
    if (isReady) {
      if (!isAuthenticated) {
        navigate("/"); // Navigate to login page if not authenticated
      } else if (
        isAuthenticated &&
        (window.location.pathname === "/" ||
          window.location.pathname === "/register")
      ) {
        navigate("/home"); // Redirect to home page if currently on the start page
      }
    }
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady) {
    return <Loader />;
  }

  return <Outlet />;
};

export default App;
