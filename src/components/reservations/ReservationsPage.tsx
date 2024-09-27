import { BookingObject, DeskObject } from "../../types";
import { ReservationsView } from "./ReservationsView";
import { useGetAllBookings } from "../../hooks/useGetAllBookings";
import { useGetAllDesks } from "../../hooks/useGetAllDesks";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { Loader } from "../../../src/components/Loader";

export const ReservationsPage = () => {
  // Fetch all bookings
  const {
    data: bookings,
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useGetAllBookings();

  // Fetch all desks
  const {
    data: desks,
    isLoading: desksLoading,
    isError: desksError,
  } = useGetAllDesks();

  // Fetch current user
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
  } = useGetCurrentUser();

  // Show loader while data is loading
  if (bookingsLoading || desksLoading || userLoading) {
    return <Loader />;
  }

  // Handle errors
  if (bookingsError || desksError || userError) {
    return <p>Error! Please try again later.</p>;
  }

  // Filter bookings by current user ID
  const userBookings =
    bookings?.filter(
      (booking: BookingObject) => booking.user.id === currentUser?.id
    ) || [];

  // Filter desks by current user ID
  const userDesks =
    desks?.filter(
      (desk: DeskObject) => desk.fixdesk?.user.id === currentUser?.id
    ) || [];

  return (
    <>
      <h1>Reservierungen</h1>
      <ReservationsView booking={userBookings} desk={userDesks} />
    </>
  );
};
