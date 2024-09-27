import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";

export const HomePage = () => {
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const { data: currentUser } = useGetCurrentUser(); // Get current user

  return (
    <>
      <section className="home-navigation grid md:grid-cols-2 grid-cols-1 gap-5 md:mt-32">
        <div onClick={() => navigate(`/booking-plan`)}>
          <img
            src="/assets/icons/bookingplan.svg"
            alt="Bookingplan"
            className="w-16"
          />
          <h2>Buchungsplan</h2>
        </div>
        <div onClick={() => navigate(`/reservations`)}>
          <img
            src="/assets/icons/reservations.svg"
            alt="Bookingplan"
            className="w-12 mb-1"
          />
          <h2>Reservierungen</h2>
        </div>
        <div onClick={() => navigate(`/favorites`)}>
          <img
            src="/assets/icons/favorites.svg"
            alt="Bookingplan"
            className="w-12 mb-1"
          />
          <h2>Favoriten</h2>
        </div>
        <div onClick={() => navigate(`/profile`)}>
          <img
            src="/assets/icons/profile.svg"
            alt="Bookingplan"
            className="w-12 mb-1"
          />
          <h2>Profil</h2>
        </div>
      </section>

      {currentUser?.isAdmin && (
        <section className="home-navigation admin-section mt-5 md:mb-32">
          <div onClick={() => navigate(`/admin`)}>
            <img
              src="/assets/icons/admin.svg"
              alt="Bookingplan"
              className="w-12 mb-1"
            />
            <h2>Administrator</h2>
          </div>
        </section>
      )}
    </>
  );
};
