import { useLocation, useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";
import useAuth from "../hooks/layout+login/useAuth";

// Type for NavigationInnerProps
type NavigationInnerProps = {
  onMenuClick: (path: string) => void;
};

export const NavigationInner = ({ onMenuClick }: NavigationInnerProps) => {
  const location = useLocation(); // useLocation hook for current path
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const currentPath = location.pathname; // Get current path from location.pathname
  const { data: currentUser } = useGetCurrentUser(); // Get current user
  const { logout } = useAuth(); // Logout user

  // Determine if link is active for correct display of navigation on subpages
  const isActive = (path: string) => currentPath.startsWith(path);

  // Logout user + navigate back to LoginPage
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <li
        className={isActive("/home") ? "active" : ""}
        onClick={() => onMenuClick(`/home`)}
      >
        Home
      </li>
      <li
        className={isActive("/booking-plan") ? "active" : ""}
        onClick={() => onMenuClick(`/booking-plan`)}
      >
        Buchungsplan
      </li>
      <li
        className={isActive("/reservations") ? "active" : ""}
        onClick={() => onMenuClick(`/reservations`)}
      >
        Reservierungen
      </li>
      <li
        className={isActive("/favorites") ? "active" : ""}
        onClick={() => onMenuClick(`/favorites`)}
      >
        Favoriten
      </li>
      <li
        className={isActive("/profile") ? "active" : ""}
        onClick={() => onMenuClick(`/profile`)}
      >
        Profil
      </li>
      {currentUser?.isAdmin && (
        <li
          className={isActive("/admin") ? "active" : ""}
          onClick={() => onMenuClick(`/admin`)}
        >
          Administrator
        </li>
      )}
      <li
        className={`${
          isActive("/logout") ? "active" : ""
        } border-none md:invert-0 invert hover:invert-0`}
        onClick={handleLogout}
      >
        <div className="logout-img">
          <p className="md:hidden block text-black ml-10">Logout</p>
        </div>
      </li>
    </>
  );
};
