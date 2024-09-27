import {
  OfficeObject,
  DeskObject,
  BookingObject,
  FavoriteDeskObject,
} from "../../types";
import { useGetAllOffices } from "../../hooks/booking/useGetAllOffices";
import { useGetDesksByOffice } from "../../hooks/booking/useGetDesksByOffice";
import { useGetAllBookings } from "../../hooks/useGetAllBookings";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { useGetAllFavoritesForUser } from "../../hooks/favorites/useGetAllFavoritesForUser";
import { useCreateFavorite } from "../../hooks/booking/useCreateFavorite";
import { useDeleteFavorite } from "../../hooks/booking/useDeleteFavorite";
import { useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Loader } from "../Loader";

export const OfficeDetail = () => {
  const { officeId } = useParams<{ officeId: string }>(); // Get office ID from URL parameters
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const { data: offices } = useGetAllOffices(); // Get all offices
  const { data: desks, isError, isLoading } = useGetDesksByOffice(officeId); // Get data from useGetAllOffices hook
  const { data: bookings } = useGetAllBookings(); // Get bookings
  const { data: currentUser } = useGetCurrentUser(); // Get current user
  const { data: favorites } = useGetAllFavoritesForUser(currentUser?.id); // Get all favorites for current user
  const createFavoriteMutation = useCreateFavorite(); // Add desk to favorites
  const deleteFavoriteMutation = useDeleteFavorite(); // Remove desk from favorites
  const queryClient = useQueryClient(); // Use query client to invalidate favorites-query to update data after button click

  // Find office by office ID
  const office = offices?.find(
    (office: OfficeObject) => office.id === officeId
  );

  // Check if desk is bookable -> get all bookings for desk
  const getDeskBookings = (desk: DeskObject) => {
    const deskBookings = bookings?.filter(
      (booking: BookingObject) => booking.desk.id === desk.id
    );

    // Check if FlexDesk is booked on current date + set isBookedFlex on true/false
    const currentDate = new Date(); // Get current date
    let isBookedFlex = false;
    if (deskBookings && desk.type === "flex") {
      isBookedFlex = deskBookings.some((booking: BookingObject) => {
        const dateStart = new Date(booking.dateStart);
        const dateEnd = new Date(booking.dateEnd);
        return currentDate >= dateStart && currentDate <= dateEnd;
      });
    }

    const isBookable = !isBookedFlex && desk.fixdesk === null;
    const isFavorite =
      favorites?.some(
        (favorite: FavoriteDeskObject) => favorite.desk.id === desk.id
      ) || desk.isUserFavourite;
    return {
      // Set CSS classes according to booking + favorite status
      classes: classNames({
        bookable: isBookable,
        "booked-flex": isBookedFlex,
        "booked-fix": desk.fixdesk !== null || desk.type === "fix",
        favorite: isFavorite,
        nonFavorite: !isFavorite,
      }),
      isBookable,
      isFavorite,
    };
  };

  // Handle add to favorites button click
  const handleAddToFavorites = (id: string) => {
    createFavoriteMutation.mutate(
      { desk: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["favorites"]); // Update favorites
          queryClient.invalidateQueries(["desks"]); // Update desks
        },
        onError: (error) => {
          console.error("Error adding to favorites:", error);
          alert("Fehler beim Hinzufügen zu den Favoriten!");
        },
      }
    );
  };

  // Handle remove from favorites button click
  const handleRemoveFromFavorites = (deskId: string) => {
    // Find favorite by desk ID
    const favorite = favorites?.find(
      (favorite: FavoriteDeskObject) => favorite.desk.id === deskId
    );

    deleteFavoriteMutation.mutate(
      { id: favorite.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["favorites"]); // Update favorites
          queryClient.invalidateQueries(["desks"]); // Update desks
        },
        onError: (error) => {
          console.error("Error removing from favorites:", error);
          alert("Fehler beim Entfernen aus den Favoriten!");
        },
      }
    );
  };

  return (
    <>
      {office && (
        <>
          <h1 className="text-center">{office.name}</h1>
          {desks && desks.length === 0 && (
            <p className="text-center mt-20">Keine Tische vorhanden!</p>
          )}
          <section className="table-container grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
            {desks?.map((desk: DeskObject) => {
              const { classes, isBookable, isFavorite } = getDeskBookings(desk);
              return (
                <div
                  key={desk.id}
                  className="flex flex-col items-center justify-center">
                  <div
                    onClick={() => isBookable && navigate(`${desk.id}`)}
                    className={`${classes} w-full min-h-24`}>
                    <p>{desk.label}</p>
                  </div>
                  {!isFavorite ? (
                    <button
                      onClick={() => handleAddToFavorites(desk.id)}
                      className="text-xs flex items-center justify-center gap-1 w-full bg-transparent hover:bg-transparent text-black hover:text-[#FDC04A] rounded-none shadow-none mt-1">
                      <img
                        src="/src/assets/icons/star-empty.svg"
                        alt="Zu Favoriten hinzufügen"
                        className="w-6"
                      />
                      Zu Favoriten hinzufügen
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveFromFavorites(desk.id)}
                      className="text-xs flex items-center justify-center gap-1 w-full bg-transparent hover:bg-transparent text-black hover:text-[#FDC04A] rounded-none shadow-none mt-1">
                      <img
                        src="/src/assets/icons/star-full.svg"
                        alt="Aus Favoriten entfernen"
                        className="w-6"
                      />
                      Aus Favoriten entfernen
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}
      {isLoading && <Loader />}
      {isError && (
        <p>
          Büroübersicht konnte nicht geladen werden. Bitte später erneut
          versuchen!
        </p>
      )}

      <section className="flex items-center justify-between text-sm mt-10">
        <ul className="desk-status">
          <li className="bookable">Buchbar</li>
          <li className="booked-flex">Gebucht / FlexDesk</li>
          <li className="booked-fix">Gebucht / FixDesk</li>
        </ul>
      </section>
    </>
  );
};
