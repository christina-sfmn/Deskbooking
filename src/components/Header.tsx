import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationInner } from "./NavigationInner";

export const Header = () => {
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu

  // Handle click on navigation links + close menu after navigation
  const handleMenuClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 left-0 w-full h-20 bg-booking_lightgrey flex items-center justify-between shadow px-5 py-3 z-40">
      <div>
        <img
          src="/src/assets/Diamir-Logo.png"
          alt="Diamir Logo"
          className={`isActive("/home") ? "active" : ""} h-10`}
          onClick={() => handleMenuClick(`/home`)}
        />
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden bg-transparent hover:bg-white shadow-none px-2 py-1">
        <img
          src="/src/assets/icons/burger-menu.svg"
          alt="Navigationsbutton"
          className="w-12 h-12"
        />
      </button>

      <nav className="main-navigation hidden md:block">
        <ul className="flex items-center gap-5 list-none">
          <NavigationInner onMenuClick={handleMenuClick} />
        </ul>
      </nav>

      {menuOpen && (
        <nav className="mobile-navigation md:hidden fixed top-20 left-0 inset-0 bg-booking_matteblack flex flex-col items-center justify-start p-10 z-40">
          <ul className="w-full">
            <NavigationInner onMenuClick={handleMenuClick} />
          </ul>
        </nav>
      )}
    </header>
  );
};
