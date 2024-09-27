import { useState } from "react";
import { BookingObject, DeskObject, OfficeObject } from "../../types";
import { CurrentReservationsView } from "./CurrentReservationsView";
import { useGetAllOffices } from "../../hooks/booking/useGetAllOffices";
import { useGetDesksByOffice } from "../../hooks/booking/useGetDesksByOffice";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { useGetAllBookings } from "../../hooks/useGetAllBookings";
import { useGetAllDesks } from "../../hooks/useGetAllDesks";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import { useCreateFixdeskRequest } from "../../hooks/useCreateFixdeskRequest";
import { useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "../Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PopupWindow } from "../PopupWindow";
import { formatDateToISO } from "../../utils";

// Type for form validation
export type BookingForm = {
  dateStart: Date;
  dateEnd: Date;
  deskType: string;
};

export const DeskDetail = () => {
  const { officeId, deskId } = useParams<{
    officeId: string;
    deskId: string;
  }>(); // Get office ID and desk ID from URL parameters
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const { data: offices } = useGetAllOffices(); // Get all offices
  const { data: desksByOffice } = useGetDesksByOffice(officeId); // Get desks for specific office
  const { data: currentUser } = useGetCurrentUser(); // Get current user
  const { data: bookings } = useGetAllBookings(); // Get all bookings
  const { data: desks } = useGetAllDesks(); // Get all desks
  const createBookingMutation = useCreateBooking(); // Create FlexDesk booking
  const createFixdeskRequestMutation = useCreateFixdeskRequest(); // Create FixDesk request
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Setup yup form validation schema
  const schema = yup.object().shape({
    dateStart: yup.date().required("Startdatum ist erforderlich!"),
    dateEnd: yup
      .date()
      .required("Enddatum ist erforderlich!")
      .min(yup.ref("dateStart"), "Enddatum muss nach dem Startdatum liegen!"),
    deskType: yup
      .string()
      .required("Bitte zwischen FlexDesk oder FixDesk auswählen!"),
  });

  // Register input fields + handle submit + add yup schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<BookingForm>({
    resolver: yupResolver(schema),
    // Default values for FixDesk to make validation work
    defaultValues: {
      dateStart: new Date(),
      dateEnd: new Date(),
      deskType: "",
    },
  });

  // Watch input values on selected desk type to set form fields visible/invisible
  const selectedDeskType = watch("deskType", "");

  // Find specific office + desk by ID
  const office = offices?.find(
    (office: OfficeObject) => office.id === officeId
  );
  const deskByOffice = desksByOffice?.find(
    (desk: DeskObject) => desk.id === deskId
  );

  // Check if office + desk + desk ID + user are defined
  if (!office || !deskByOffice || !deskId || !currentUser) {
    return <Loader />;
  }

  // Create booking for FlexDesk or send FixDesk request on submit
  const onSubmit = (data: BookingForm) => {
    if (data.deskType === "FlexDesk") {
      createBookingMutation.mutate(
        {
          dateStart: formatDateToISO(data.dateStart),
          dateEnd: formatDateToISO(data.dateEnd),
          desk: deskId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["bookings"]); // Update bookings
            setPopupMessage("FlexDesk wurde erfolgreich gebucht!");
            setShowPopup(true);
          },
          onError: (error) => {
            const axiosError = error as any;
            if (axiosError.response) {
              // Handle error messages based on satus code
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
      <h1>
        <span className="font-bold">{deskByOffice.label}</span> / {office.name}
      </h1>

      <section className="flex md:flex-row flex-col-reverse gap-16 md:mt-16 mt-8">
        <div className="w-full">
          <h2>Tisch buchen:</h2>
          <form
            id="desk-booking-form"
            className="flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              name="firstname"
              value={currentUser.firstname}
              disabled
              className="mb-2"
            />
            <input
              type="text"
              name="lastname"
              value={currentUser.lastname}
              disabled
              className="mb-2"
            />
            <input
              type="text"
              name="email"
              value={currentUser.email}
              disabled
              className="mb-2"
            />

            <div className="flex items-center justify-center gap-2 w-fit my-3">
              <input
                type="radio"
                value="FlexDesk"
                {...register("deskType")}
                className="mt-1"
              />
              <label>FlexDesk</label>
              <input
                type="radio"
                value="FixDesk"
                {...register("deskType")}
                className="mt-1 ml-3"
              />
              <label>FixDesk</label>
            </div>
            {errors.deskType && (
              <p className="text-red-600">{errors.deskType.message}</p>
            )}

            {selectedDeskType === "FlexDesk" && (
              <>
                <section className="flex items-center gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="dateFrom" className="font-bold">
                      von:
                    </label>
                    <Controller
                      name="dateStart"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          className="mb-2"
                          dateFormat="dd.MM.yyyy"
                          calendarStartDay={1}
                          minDate={new Date()} // Earliest date is today
                          maxDate={
                            new Date(
                              new Date().setDate(new Date().getDate() + 28)
                            )
                          } // Max. range of 4 weeks
                          filterDate={(date) =>
                            date.getDay() !== 6 && date.getDay() !== 0
                          } // Only weekdays
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="dateUntil" className="font-bold">
                      bis:
                    </label>
                    <Controller
                      name="dateEnd"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          className="mb-2"
                          dateFormat="dd.MM.yyyy"
                          calendarStartDay={1}
                          minDate={new Date()} // Earliest date is today
                          maxDate={
                            new Date(
                              new Date().setDate(new Date().getDate() + 28)
                            )
                          } // Max. range of 4 weeks
                          filterDate={(date) =>
                            date.getDay() !== 6 && date.getDay() !== 0
                          } /// Only weekdays
                        />
                      )}
                    />
                  </div>
                </section>
                {errors.dateStart && (
                  <p className="text-red-600">{errors.dateStart.message}</p>
                )}
                {errors.dateEnd && (
                  <p className="text-red-600">{errors.dateEnd.message}</p>
                )}
              </>
            )}
            <button type="submit" className="w-fit my-5">
              Tisch buchen
            </button>
          </form>

          <section>
            <h2 className="mt-3">Aktuelle Reservierungen:</h2>
            <CurrentReservationsView booking={userBookings} desk={userDesks} />
          </section>
        </div>

        <div className="w-full">
          <img
            src="/assets/img/luca-bravo-9l_326FISzk-unsplash.jpg"
            alt="Desk setup"
            className="mt-3 mb-10"
          />
          <h2>Ausstattung:</h2>
          {deskByOffice.equipment.length > 0 ? (
            <ul className="desk-equipment">
              {deskByOffice.equipment.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Keine Ausstattung vorhanden.</p>
          )}
        </div>
      </section>

      {showPopup && (
        <PopupWindow
          message={popupMessage}
          onClose={() => {
            handleClosePopup();
            if (
              popupMessage.includes("erfolgreich") ||
              popupMessage.includes("angefragt")
            ) {
              navigate(`/booking-plan/${office.id}`); // Go back to Office overview page
            }
          }}
        />
      )}
    </>
  );
};
