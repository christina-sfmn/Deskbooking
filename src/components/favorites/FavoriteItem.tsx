import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { useGetDeskById } from "../../hooks/useGetDeskById";
import { BookingForm } from "../booking/DeskDetail";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "../Loader";
import * as yup from "yup";
import {
  BookingObject,
  DeskObject,
  FavoriteDeskObject,
} from "../../../src/types";

// Function for calculating weekdays
const getStartOfNextWeek = (currentDate: Date): Date => {
  const date = new Date(currentDate);
  const dayOfWeek = date.getDay();
  const daysUntilMonday = (8 - dayOfWeek) % 7; // Days until the next Monday
  date.setDate(date.getDate() + daysUntilMonday);
  return new Date(date.setHours(0, 0, 0, 0)); // Set to the beginning of the day
};

// Calculates a new date by adding a specified number of days to a given start date.
const getDateFromDaysDifference = (
  startDate: Date,
  daysDifference: number
): Date => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysDifference); // Add the specified number of days to the date
  return new Date(date.setHours(0, 0, 0, 0)); // Set the time to 00:00:00 and return the new Date
};

export const FavoriteItem = ({
  favorite,
  bookings,
  onSubmit,
}: {
  favorite: FavoriteDeskObject;
  bookings: BookingObject[];
  onSubmit: (data: BookingForm, deskId: string) => void;
}) => {
  const { data: desk, isLoading, isError } = useGetDeskById(favorite.desk.id);
  const { data: currentUser } = useGetCurrentUser();

  const [selectedDeskType, setSelectedDeskType] = useState("");
  const [initialStartDate, setInitialStartDate] = useState<Date | null>(null);
  const [initialEndDate, setInitialEndDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<BookingForm>({
    resolver: yupResolver(
      yup.object().shape({
        dateStart: yup.date().required("Startdatum ist erforderlich!"),
        dateEnd: yup
          .date()
          .required("Enddatum ist erforderlich!")
          .min(
            yup.ref("dateStart"),
            "Enddatum muss nach dem Startdatum liegen!"
          ),
        deskType: yup
          .string()
          .required("Bitte zwischen FlexDesk oder FixDesk auswählen!"),
      })
    ),
    defaultValues: {
      dateStart: initialStartDate || new Date(),
      dateEnd: initialEndDate || new Date(),
      deskType: "",
    },
  });

  // Check if a user has previously booked a specific desk.
  const hasUserBookedDesk = (
    deskId: string,
    bookings: BookingObject[],
    userId: string
  ) => {
    return bookings.some(
      (booking) => booking.desk.id === deskId && booking.user.id === userId
    );
  };

  // Check if the current user has booked the desk before
  const userHasBooked = currentUser
    ? hasUserBookedDesk(favorite.desk.id, bookings, currentUser.id)
    : false;

  // Initialize booking dates if user has booked this desk
  useEffect(() => {
    if (userHasBooked && bookings.length > 0) {
      // Filter to get all bookings of the current user for the specific desk
      const userBookings = bookings.filter(
        (b) => b.desk.id === favorite.desk.id && b.user.id === currentUser?.id
      );
      // Sort the user's bookings by the start date to find the most recent one
      userBookings.sort(
        (a, b) =>
          new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
      );
      // Select the most recent booking
      const lastBooking = userBookings[0];

      if (lastBooking) {
        const { dateStart, dateEnd } = lastBooking;
        const previousStartDate = new Date(dateStart);
        const previousEndDate = new Date(dateEnd);

        // Calculate the difference in days between the start and end dates of the last booking
        const daysDifference =
          (previousEndDate.getTime() - previousStartDate.getTime()) /
          (1000 * 60 * 60 * 24);

        // Get the start of the next week from the current date
        const startOfNextWeek = getStartOfNextWeek(new Date());

        // Calculate the weekday for the new start date based on the last booking's start date
        setInitialStartDate(
          getDateFromDaysDifference(
            startOfNextWeek,
            previousStartDate.getDay() - 1
          )
        );

        // Calculate the weekday for the new end date based on the last booking's start date and the length of the booking
        setInitialEndDate(
          getDateFromDaysDifference(
            startOfNextWeek,
            previousStartDate.getDay() - 1 + daysDifference
          )
        );
      }
    }
  }, [userHasBooked, bookings, favorite.desk.id, currentUser]);

  // Update date values if initial values are set
  useEffect(() => {
    if (initialStartDate) setValue("dateStart", initialStartDate);
    if (initialEndDate) setValue("dateEnd", initialEndDate);
  }, [initialStartDate, initialEndDate, setValue]);

  // handles changes when a user selects a desk type -> radio button
  const handleDeskTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDeskType(event.target.value);
    setValue("deskType", event.target.value);
  };

  if (isLoading) return <Loader key={`loading-${favorite.id}`} />;
  if (isError || !desk)
    return (
      <p key={`error-${favorite.id}`}>Fehler beim Laden des Schreibtischs.</p>
    );

  // Check if desk is bookable or not
  const isDeskBookable = (desk: DeskObject, bookings: BookingObject[]) => {
    // Find all bookings for this desk
    const deskBookings = bookings.filter(
      (booking: BookingObject) => booking.desk.id === desk.id
    );
    // Check if FlexDesk is booked on current date
    const currentDate = new Date();
    let isBookedFlex = false;
    if (deskBookings && desk.type === "flex") {
      isBookedFlex = deskBookings.some((booking: BookingObject) => {
        const dateStart = new Date(booking.dateStart);
        const dateEnd = new Date(booking.dateEnd);
        return currentDate >= dateStart && currentDate <= dateEnd;
      });
    }
    return !isBookedFlex && desk.fixdesk === null;
  };

  const bookable = isDeskBookable(desk, bookings);

  return (
    <li key={favorite.id} className="p-2 border-b-[1.5px]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 w-5/6">
          <div className="flex items-center gap-1">
            <img
              src="src/assets/icons/star-full.svg"
              alt="FavoriteStar"
              className="w-7 mt-4 mr-1"
            />
            <h2 className="mt-3 mb-0">
              {desk.label} / {desk.office.name}
            </h2>
          </div>
          <p className="ml-10">
            Ausstattung:{" "}
            {desk.equipment.length > 0 ? (
              desk.equipment.map((item: string, index: number) => (
                <React.Fragment key={index}>
                  <span>{item}</span>
                  {index < desk.equipment.length - 1 && ", "}
                </React.Fragment>
              ))
            ) : (
              <span>Keine Ausstattung verfügbar</span>
            )}
          </p>

          <div className="mb-4">
            {bookable ? (
              <>
                <p>
                  <span className="dot-bookable text-green-600">⬤</span>
                  Buchbar
                </p>
                <form
                  id="desk-booking-form"
                  onSubmit={handleSubmit((data) =>
                    onSubmit(data, favorite.desk.id)
                  )}
                  className="flex flex-col mt-2"
                >
                  <div className="flex items-center justify-center gap-3 w-fit my-2 ml-2">
                    <label className="text-center flex gap-1">
                      <input
                        type="radio"
                        value="FlexDesk"
                        {...register("deskType")}
                        className="mt-1"
                        onChange={handleDeskTypeChange}
                      />
                      FlexDesk
                    </label>

                    <label className="text-center flex gap-1">
                      <input
                        type="radio"
                        value="FixDesk"
                        {...register("deskType")}
                        className="mt-1"
                        onChange={handleDeskTypeChange}
                      />
                      FixDesk
                    </label>
                  </div>
                  {errors.deskType && (
                    <p className="text-red-600">{errors.deskType.message}</p>
                  )}

                  {selectedDeskType === "FlexDesk" && (
                    <section className="flex items-center justify-start gap-5 ml-2">
                      <div className="flex flex-col">
                        <label className="font-bold">von:</label>
                        <Controller
                          name="dateStart"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value || initialStartDate}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              className="mb-2"
                              dateFormat="dd.MM.yyyy"
                              calendarStartDay={1}
                              minDate={new Date()}
                              maxDate={
                                new Date(
                                  new Date().setDate(new Date().getDate() + 28)
                                )
                              }
                              filterDate={(date) =>
                                date.getDay() !== 6 && date.getDay() !== 0
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="font-bold">bis:</label>
                        <Controller
                          name="dateEnd"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value || initialEndDate}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              className="mb-2"
                              dateFormat="dd.MM.yyyy"
                              calendarStartDay={1}
                              minDate={new Date()}
                              maxDate={
                                new Date(
                                  new Date().setDate(new Date().getDate() + 28)
                                )
                              }
                              filterDate={(date) =>
                                date.getDay() !== 6 && date.getDay() !== 0
                              }
                            />
                          )}
                        />
                      </div>
                    </section>
                  )}
                  {errors.dateStart && (
                    <p className="text-red-600">{errors.dateStart.message}</p>
                  )}
                  {errors.dateEnd && (
                    <p className="text-red-600">{errors.dateEnd.message}</p>
                  )}

                  <button type="submit" className="w-fit mt-2 ml-2 px-4">
                    Tisch erneut buchen
                  </button>
                </form>
              </>
            ) : (
              <p>
                <span className="dot-bookable text-red-600">⬤</span>
                Aktuell nicht buchbar
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
