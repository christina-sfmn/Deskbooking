import { useGetAllFavoritesForUser } from "../../hooks/favorites/useGetAllFavoritesForUser";
import { useGetAllBookings } from "../../hooks/useGetAllBookings";
import { FavoritesView } from "./FavoritesView";
import { Loader } from "../Loader";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";

export const FavoritesPage = () => {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetCurrentUser();
  const userId = currentUser?.id;

  const {
    data: allFavorites,
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
  } = useGetAllFavoritesForUser(userId);
  const { data: bookings } = useGetAllBookings();

  if (isUserLoading || isFavoritesLoading) return <Loader />;
  if (isUserError || isFavoritesError)
    return (
      <p>
        Favoriten konnten nicht geladen werden. Bitte später erneut versuchen!
      </p>
    );

  return (
    <>
      <h1>Favoriten</h1>
      <FavoritesView favorite={allFavorites} booking={bookings} />
    </>
  );
};
