import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/layout+login/useAuth";
import { Loader } from "../Loader";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  // If user is authenticated, render the child component (private route)
  // If user is not authenticated, redirect to the home page
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
