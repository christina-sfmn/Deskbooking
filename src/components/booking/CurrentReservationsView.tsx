import { BookingObject, DeskObject } from "../../types";
import { formatDateToGerman } from "../../utils";

type CurrentReservationsViewProps = {
  booking: BookingObject[];
  desk: DeskObject[];
};

export const CurrentReservationsView = ({
  booking = [],
  desk = [],
}: CurrentReservationsViewProps) => {
  // Filter current reservations
  const currentDate = new Date();
  const currentReservations = booking.filter(
    (reservation) => new Date(reservation.dateEnd) >= currentDate
  );

  // Filter desks based on FixDesk status
  const fixDesks = desk.filter((desk) => desk.fixdesk !== null);

  return (
    <>
      {currentReservations.length === 0 && fixDesks.length === 0 ? (
        <p className="reservation-list-bookingview">Sie haben keine aktuellen Reservierungen.</p>
      ) : (
        <>
          <h3 className="border-b-[1.5px]">FlexDesk Buchungen:</h3>
          {currentReservations.length === 0 ? (
            <p className="reservation-list-bookingview">
              Sie haben keine aktuellen FlexDesk Reservierungen.
            </p>
          ) : (
            <ul className="reservation-list-bookingview">
              {currentReservations.map((reservation) => (
                <li key={reservation.id}>
                  <p className="font-bold">
                    {reservation.desk.label} / {reservation.desk.office.name}
                  </p>
                  <p>
                    {reservation.desk.type === "fix" ? "FixDesk" : "FlexDesk"},{" "}
                    {formatDateToGerman(new Date(reservation.dateStart))} -{" "}
                    {formatDateToGerman(new Date(reservation.dateEnd))}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <h3 className="border-b-[1.5px]">FixDesk Buchungen:</h3>
          {fixDesks.length === 0 ? (
            <p className="reservation-list-bookingview">
              Sie haben keine aktuellen FixDesk Reservierungen.
            </p>
          ) : (
            <ul className="reservation-list-bookingview">
              {fixDesks.map((desk) => (
                <li key={desk.id}>
                  <p className="font-bold">
                    {desk.label} / {desk.office.name}
                  </p>
                  {desk.fixdesk && (
                    <p>
                      FixDesk, gültig ab{" "}
                      {formatDateToGerman(new Date(desk.fixdesk.updatedAt))} für
                      3 Monate
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
};
