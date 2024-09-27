import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { LoginPage } from "./components/layout+login/LoginPage";
import { RegisterPage } from "./components/layout+login/RegisterPage";
import { HomePage } from "./components/HomePage";
import { BookingPlanPage } from "./components/booking/BookingPlanPage";
import { ReservationsPage } from "./components/reservations/ReservationsPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { FavoritesPage } from "./components/favorites/FavoritesPage";
import { AdministrationPage } from "./components/admin/AdministrationPage";
import { OfficeDetail } from "./components/booking/OfficeDetail";
import { DeskDetail } from "./components/booking/DeskDetail";
import PrivateRoute from "./components/layout+login/PrivateRoute";
import PublicRoute from "./components/layout+login/PublicRoute";
import AuthenticatedLayout from "./components/layout+login/AuthenticatedLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "/",
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "home",
            element: (
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            ),
          },
          {
            path: "booking-plan",
            element: (
              <PrivateRoute>
                <BookingPlanPage />
              </PrivateRoute>
            ),
          },
          {
            path: "booking-plan/:officeId",
            element: (
              <PrivateRoute>
                <OfficeDetail />
              </PrivateRoute>
            ),
          },
          {
            path: "booking-plan/:officeId/:deskId",
            element: (
              <PrivateRoute>
                <DeskDetail />
              </PrivateRoute>
            ),
          },
          {
            path: "reservations",
            element: (
              <PrivateRoute>
                <ReservationsPage />
              </PrivateRoute>
            ),
          },
          {
            path: "favorites",
            element: (
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            ),
          },
          {
            path: "admin",
            element: (
              <PrivateRoute>
                <AdministrationPage />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
