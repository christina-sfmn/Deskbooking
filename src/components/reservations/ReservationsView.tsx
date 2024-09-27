import { useState } from "react";
import { BookingObject, DeskObject } from "../../../src/types";
import { useNavigate } from "react-router-dom";
import { useDeleteBooking } from "../../hooks/reservations/useDeleteBooking";
import { useDeleteFixdeskRequest } from "../../hooks/useDeleteFixdeskRequest";
import { useQueryClient } from "react-query";
import { PopupFeedbackWindow } from "../reservations/PopupFeedbackWindow";
import { PopupWindow } from "../PopupWindow";
import { formatDateToGerman } from "../../utils";

type ReservationsViewProps = {
  booking: BookingObject[];
  desk: DeskObject[];
};

export const ReservationsView = ({
  booking = [],
  desk = [],
}: ReservationsViewProps) => {
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const createDeleteBookingMutation = useDeleteBooking(); // Delete booking
  const createDeleteFixdeskRequestMutation = useDeleteFixdeskRequest(); // Delete FixDesk
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click

  // Filter current and past reservations
  const today = new Date();
  const currentReservations = booking.filter(
    (reservation) => new Date(reservation.dateEnd) >= today
  );
  const pastReservations = booking.filter(
    (reservation) => new Date(reservation.dateEnd) < today
  );

  // Filter desks based on FixDesk status
  const fixDesks = desk.filter(
    (desk) => desk.fixdesk !== null && desk.fixdesk !== undefined
  );

  // Calculate the end date for FixDesk reservations (3 months after updatedAt)
  const calculateEndDate = (startDate: string) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 3);
    return date;
  };

  // Filter desks based on FixDesk status and past reservations
  const pastFixDesks = fixDesks.filter(
    (desk) =>
      desk.fixdesk && new Date(calculateEndDate(desk.fixdesk.updatedAt)) < today
  );

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Setup for feedback popup
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // useState to set popup visible/invisible
  const [selectedReservationOrDesk, setSelectedReservationOrDesk] = useState<
    BookingObject | DeskObject | null
  >(null);
  const handleFeedbackClick = (item: BookingObject | DeskObject) => {
    setSelectedReservationOrDesk(item);
    setShowFeedbackPopup(true);
  };

  const handleCloseFeedbackPopup = () => {
    setShowFeedbackPopup(false);
    setSelectedReservationOrDesk(null);
  };

  // Delete FlexDesk booking
  const handleDeleteFlexdeskClick = (id: string) => {
    createDeleteBookingMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["bookings"]); // Update bookings
          setPopupMessage("FlexDesk-Buchung wurde erfolgreich storniert!");
          setShowPopup(true);
        },
        onError: (error) => {
          console.error("Error deleting booking:", error);
          setPopupMessage("Fehler beim Stornieren der FlexDesk-Buchung!");
          setShowPopup(true);
        },
      }
    );
  };

  // Delete FixDesk booking
  const handleDeleteFixdeskClick = (id: string) => {
    createDeleteFixdeskRequestMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["fixdesks"]); // Update FixDesks
          setPopupMessage("FixDesk-Buchung wurde erfolgreich storniert!");
          setShowPopup(true);
        },
        onError: (error) => {
          console.error("Error deleting FixDesk request:", error);
          setPopupMessage("Fehler beim Stornieren der FixDesk-Buchung!");
          setShowPopup(true);
        },
      }
    );
  };

  return (
    <section className="grid md:grid-cols-2 grid-cols-1 gap-16 mt-10">
      <div>
        {/* ----------------------- CURRENT RESERVATIONS ----------------------- */}
        <h2>Aktuelle Reservierungen:</h2>
        {currentReservations.length === 0 && fixDesks.length === 0 ? (
          <p className="reservation-list">
            Sie haben keine aktuellen Reservierungen.
          </p>
        ) : (
          <>
            <h3 className="border-b-[1.5px]">FlexDesk Buchungen:</h3>
            {currentReservations.length === 0 ? (
              <p className="reservation-list">
                Sie haben keine aktuellen FlexDesk Reservierungen.
              </p>
            ) : (
              <ul className="reservation-list">
                {currentReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex md:flex-row flex-col justify-between md:items-center gap-5">
                    <div>
                      <p
                        className="font-bold cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/booking-plan/${reservation.desk.office.id}/${reservation.desk.id}`
                          )
                        }>
                        {reservation.desk.label} /{" "}
                        {reservation.desk.office.name}
                      </p>
                      <p>
                        {reservation.desk.type === "fix"
                          ? "FixDesk"
                          : "FlexDesk"}
                        , {formatDateToGerman(new Date(reservation.dateStart))}{" "}
                        - {formatDateToGerman(new Date(reservation.dateEnd))}
                      </p>
                      <p>
                        Ausstattung:{" "}
                        {reservation.desk.equipment.length > 0 ? (
                          reservation.desk.equipment.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index < reservation.desk.equipment.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))
                        ) : (
                          <span>Keine Ausstattung verfügbar.</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFlexdeskClick(reservation.id)}
                      className="w-fit md:mt-0 -mt-3">
                      Stornieren
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="border-b-[1.5px]">FixDesk Buchungen:</h3>
            {fixDesks.length === 0 ? (
              <p className="reservation-list">
                Sie haben keine aktuellen FixDesk Reservierungen.
              </p>
            ) : (
              <ul className="reservation-list">
                {fixDesks.map((desk) => (
                  <li
                    key={desk.id}
                    className="flex md:flex-row flex-col justify-between md:items-center gap-5">
                    <div>
                      <p
                        className="font-bold cursor-pointer"
                        onClick={() =>
                          navigate(`/booking-plan/${desk.office.id}/${desk.id}`)
                        }>
                        {desk.label} / {desk.office.name}
                      </p>
                      {desk.fixdesk && (
                        <p>
                          FixDesk, gültig ab{" "}
                          {formatDateToGerman(new Date(desk.fixdesk.updatedAt))}{" "}
                          für 3 Monate
                        </p>
                      )}
                      <p>
                        Ausstattung:{" "}
                        {desk.equipment.length > 0 ? (
                          desk.equipment.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index < desk.equipment.length - 1 ? ", " : ""}
                            </span>
                          ))
                        ) : (
                          <span>Keine Ausstattung verfügbar.</span>
                        )}
                      </p>
                    </div>
                    {desk.fixdesk && (
                      <button
                        onClick={() =>
                          desk.fixdesk?.id &&
                          handleDeleteFixdeskClick(desk.fixdesk.id)
                        }
                        className="w-fit md:mt-0 -mt-3">
                        Stornieren
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      {/* ----------------------- PAST RESERVATIONS ----------------------- */}
      <div>
        <h2>Vergangene Reservierungen:</h2>
        {pastReservations.length === 0 && pastFixDesks.length === 0 ? (
          <p className="reservation-list">
            Sie haben keine vergangenen Reservierungen.
          </p>
        ) : (
          <>
            <h3 className="border-b-[1.5px]">FlexDesk Buchungen:</h3>
            {pastReservations.filter(
              (reservation) => reservation.desk.type === "flex"
            ).length === 0 ? (
              <p className="reservation-list">
                Sie haben keine vergangenen FlexDesk Reservierungen.
              </p>
            ) : (
              <ul className="reservation-list">
                {pastReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex md:flex-row flex-col justify-between md:items-center gap-5">
                    <div>
                      <p
                        className="font-bold cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/booking-plan/${reservation.desk.office.id}/${reservation.desk.id}`
                          )
                        }>
                        {reservation.desk.label} /{" "}
                        {reservation.desk.office.name}
                      </p>
                      <p>
                        {reservation.desk.type === "fix"
                          ? "FixDesk"
                          : "FlexDesk"}
                        , {formatDateToGerman(new Date(reservation.dateStart))}{" "}
                        - {formatDateToGerman(new Date(reservation.dateEnd))}
                      </p>
                      <p>
                        Ausstattung:{" "}
                        {reservation.desk.equipment.length > 0 ? (
                          reservation.desk.equipment.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index < reservation.desk.equipment.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))
                        ) : (
                          <span>Keine Ausstattung verfügbar.</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFeedbackClick(reservation)}
                      className="w-fit md:mt-0 -mt-3">
                      Feedback
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="border-b-[1.5px]">FixDesk Buchungen:</h3>
            {pastFixDesks.length === 0 ? (
              <p className="reservation-list">
                Sie haben keine vergangenen FixDesk Reservierungen.
              </p>
            ) : (
              <ul className="reservation-list">
                {pastFixDesks.map((desk) => (
                  <li
                    key={desk.id}
                    className="flex justify-between items-center">
                    <div>
                      <p
                        className="font-bold cursor-pointer"
                        onClick={() =>
                          navigate(`/booking-plan/${desk.office.id}/${desk.id}`)
                        }>
                        {desk.label} / {desk.office.name}
                      </p>
                      {desk.fixdesk && (
                        <p>
                          FixDesk, gültig von{" "}
                          {formatDateToGerman(new Date(desk.fixdesk.updatedAt))}{" "}
                          bis{" "}
                          {formatDateToGerman(
                            new Date(
                              calculateEndDate(
                                desk.fixdesk.updatedAt
                              ).toISOString()
                            )
                          )}
                        </p>
                      )}
                      <p>
                        Ausstattung:{" "}
                        {desk.equipment.map((item, index) => (
                          <span key={index}>
                            {item}
                            {index < desk.equipment.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                    <button onClick={() => handleFeedbackClick(desk)}>
                      Feedback
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      {showFeedbackPopup && selectedReservationOrDesk && (
        <PopupFeedbackWindow
          reservationOrDesk={selectedReservationOrDesk}
          onClose={handleCloseFeedbackPopup}
        />
      )}
      {showPopup && (
        <PopupWindow
          message={popupMessage}
          onClose={() => {
          handleClosePopup();
          window.location.reload(); // Reload page
          }}
        />
      )}
    </section>
  );
};
