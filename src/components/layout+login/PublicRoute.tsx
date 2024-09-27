import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/layout+login/useAuth";
import { Loader } from "../Loader";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  // If authentication status is still loading, display a loading spinner
  if (loading) {
    return <Loader />;
  }

  // If user is not authenticated, render child component (public route), otherwise redirect to home page
  return !isAuthenticated ? children : <Navigate to="/home" />;
};

export default PublicRoute;
