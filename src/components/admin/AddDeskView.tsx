import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetAllOffices } from "../../hooks/booking/useGetAllOffices";
import { useCreateDesk } from "../../hooks/admin/useCreateDesk";
import { useQueryClient } from "react-query";
import { PopupWindow } from "../PopupWindow";

// Type for form validation
export type DeskForm = {
  label: string;
  office: string;
  equipment?: string; // Optional
};

export const AddDeskView = () => {
  const { data: offices } = useGetAllOffices(); // Get all offices
  const createDeskMutation = useCreateDesk(); // Create desk
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click

 // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Setup yup form validation schema
  const schema = yup.object().shape({
    label: yup.string().required("Bitte Namen eingeben!"),
    office: yup.string().required("Bitte Office auswählen!"),
    equipment: yup.string().optional(),
  });

  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeskForm>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: DeskForm) => {
  
    const submissionData = {
      ...data,
      // Split equipment string into array by commas + trim spaces
      equipment: data.equipment ? data.equipment.split(',').map(item => item.trim()) : []
    };

    createDeskMutation.mutate(submissionData, {
      onSuccess: () => {
        queryClient.invalidateQueries(["desks"]); // Update desks
        setPopupMessage("Tisch wurde hinzugefügt!");
        setShowPopup(true);
        reset();
      },
      onError: (error) => {
        console.error("Error adding desk:", error);
        setPopupMessage("Fehler beim Hinzufügen des Tisches!");
        setShowPopup(true);
      },
    });
  };

  return (
    <section className="my-10">
      <h2>Tisch hinzufügen</h2>
      <form className="mb-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex md:flex-row flex-col items-start justify-center gap-2">
          <div className="md:w-3/5 w-full">
            <input
              id="name"
              type="text"
              placeholder="Name des Tisches"
              {...register("label")}
              className="mb-2"
            />
            {errors.label && (
              <p className=" text-red-600 mb-2">{errors.label.message}</p>
            )}
          </div>
          <div className="md:w-2/5 w-full">
            <select id="office" {...register("office")} className="mb-2">
              {offices?.map((office: any) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
            {errors.office && (
              <p className=" text-red-600 mb-2">{errors.office.message}</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <input
            id="equipment"
            type="text"
            placeholder="Ausstattung (bei mehr als 1 bitte mit Komma getrennt eingeben)"
            {...register("equipment")}
            className="mb-2"
          />
          {errors.equipment && (
            <p className="text-red-600 mb-2">{errors.equipment.message}</p>
          )}
        </div>
        <button>Tisch hinzufügen</button>
      </form>

      {showPopup && (
        <PopupWindow
          message={popupMessage}
          onClose={() => {
            handleClosePopup();
          }}
        />
      )}
    </section>
  );
};
