import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import { useCreateFixdeskRequest } from "../../hooks/useCreateFixdeskRequest";
import { useQueryClient } from "react-query";
import { BookingObject, FavoriteDeskObject } from "../../../src/types";
import { PopupWindow } from "../PopupWindow";
import { formatDateToISO } from "../../utils";
import { FavoriteItem } from "./FavoriteItem";

type FavoritesViewProps = {
  booking: BookingObject[];
  favorite: FavoriteDeskObject[];
};

export type BookingForm = {
  dateStart: Date;
  dateEnd: Date;
  deskType: string;
};

export const FavoritesView = ({
  booking = [],
  favorite = [],
}: FavoritesViewProps) => {
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const handleClosePopup = () => setShowPopup(false);

  const queryClient = useQueryClient();
  const createBookingMutation = useCreateBooking();
  const createFixdeskRequestMutation = useCreateFixdeskRequest();

  const onSubmit = (data: BookingForm, deskId: string) => {
    if (data.deskType === "FlexDesk") {
      createBookingMutation.mutate(
        {
          dateStart: formatDateToISO(data.dateStart),
          dateEnd: formatDateToISO(data.dateEnd),
          desk: deskId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["bookings"]);
            setPopupMessage("FlexDesk wurde erfolgreich gebucht!");
            setShowPopup(true);
          },
          onError: (error) => {
            const axiosError = error as any;
            if (axiosError.response) {
              const statusCode = axiosError.response.status;
              let errorMessage = "Fehler bei der FlexDesk-Buchung!";
              if (statusCode === 400) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Der gewählte Zeitraum geht über das Wochenende, ist zu lang oder liegt nicht im gültigen Bereich von 4 Wochen.";
              } else if (statusCode === 403) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Die User ID stimmt nicht mit der Anfrage überein.";
              } else if (statusCode === 406) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Es existiert bereits eine Fixdesk-Buchung für diesen Schreibtisch.";
              } else if (statusCode === 409) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Die Daten überschneiden sich mit anderen Buchungen. Sie haben bereits Buchungen für einen anderen Schreibtisch oder es sind schon Buchungen für diesen Schreibtisch vorhanden.";
              }
              setPopupMessage(errorMessage);
              setShowPopup(true);
            }
          },
        }
      );
    }

    if (data.deskType === "FixDesk") {
      createFixdeskRequestMutation.mutate(
        { desk: deskId },
        {
          onSuccess: () => {
            setPopupMessage("FixDesk-Buchung wurde angefragt!");
            setShowPopup(true);
          },
          onError: (error) => {
            const axiosError = error as any;
            if (axiosError.response) {
              const statusCode = axiosError.response.status;
              let errorMessage = "Fehler bei der FixDesk-Anfrage!";
              if (statusCode === 400) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Die Eingabedaten sind ungültig.";
              } else if (statusCode === 403) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Die User ID stimmt nicht mit der Anfrage überein.";
              } else if (statusCode === 409) {
                errorMessage =
                  "Buchung konnte nicht erstellt werden. Sie haben bereits eine FixDesk-Anfrage versendet.";
              }
              setPopupMessage(errorMessage);
              setShowPopup(true);
            }
          },
        }
      );
    }
  };

  return (
    <section className="mt-10">
      <div>
        {favorite.length === 0 ? (
          <p>Sie haben keine Favoriten.</p>
        ) : (
          <ul className="flex flex-col">
            {favorite.map((favorite: FavoriteDeskObject) => (
              <FavoriteItem
                key={favorite.id}
                favorite={favorite}
                bookings={booking}
                onSubmit={onSubmit}
              />
            ))}
          </ul>
        )}
      </div>
      {showPopup && (
        <PopupWindow message={popupMessage} onClose={handleClosePopup} />
      )}
    </section>
  );
};
