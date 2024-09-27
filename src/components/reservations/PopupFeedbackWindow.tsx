import { useEffect } from "react";
import { BookingObject, DeskObject } from "../../types";
import { useSubmitFeedback } from "../../hooks/reservations/useSubmitFeedback";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";

// Type for PopupFeedbackWindowProps
export type PopupFeedbackWindowProps = {
  reservationOrDesk: BookingObject | DeskObject; // Verallgemeinert den Typ
  onClose: () => void;
};

// Validation schema with Yup
const validationSchema = Yup.object({
  feedback: Yup.string()
    .required("Bitte geben Sie Ihr Feedback ein!")
    .min(10, "Feedback muss mindestens 10 Zeichen lang sein!"),
});

// Define the type for form data
type FormData = {
  feedback: string;
};

export const PopupFeedbackWindow = ({
  reservationOrDesk,
  onClose,
}: PopupFeedbackWindowProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const {
    mutate: submitFeedback,
    isLoading,
    isError,
    isSuccess,
  } = useSubmitFeedback();

  // Type guard to check if reservationOrDesk is a BookingObject
  const isBookingObject = (
    obj: BookingObject | DeskObject
  ): obj is BookingObject => {
    return "desk" in obj;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Type check for `reservationOrDesk` to determine its type
    const deskId =
      "desk" in reservationOrDesk
        ? reservationOrDesk.desk.id
        : reservationOrDesk.id; // Use `reservationOrDesk.id` for DeskObject

    submitFeedback({ comment: data.feedback, desk: deskId });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      onClose();
    }
  }, [isSuccess, onClose, reset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center bg-white rounded shadow-lg max-w-[23.5rem] p-8 mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Feedback für {isBookingObject(reservationOrDesk) ? reservationOrDesk.desk.label : reservationOrDesk.label}:
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-3">
          <textarea
            placeholder="Text eingeben..."
            {...register("feedback")}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            rows={4}
          />
          {errors.feedback && (
            <p className="text-red-600">{errors.feedback.message}</p>
          )}
          <div className="flex justify-between w-full gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-w-32 p-2 bg-booking_grey hover:bg-booking_lightgrey text-black">
              Abbrechen
            </button>
            <button type="submit" className="min-w-32 p-2" disabled={isLoading}>
              Absenden
            </button>
          </div>
          {isError && (
            <p className="text-red-600">
              Fehler beim Senden des Feedbacks. Bitte versuchen Sie es erneut.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
