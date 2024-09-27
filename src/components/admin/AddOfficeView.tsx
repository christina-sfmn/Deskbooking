import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateOffice } from "../../hooks/admin/useCreateOffice";
import { useQueryClient } from "react-query";
import { PopupWindow } from "../PopupWindow";

// Type for form validation
export type OfficeForm = {
  name: string;
  columns: number;
  rows: number;
};

export const AddOfficeView = () => {
  const createOfficeMutation = useCreateOffice(); // Create office
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Setup yup form validation schema
  const schema = yup.object().shape({
    name: yup.string().required("Bitte Namen eingeben!"),
    columns: yup
      .number()
      .typeError("Bitte Zahl eingeben!")
      .required("Bitte Spalten eingeben!"),
    rows: yup
      .number()
      .typeError("Bitte Zahl eingeben!")
      .required("Bitte Reihen eingeben!"),
  });

  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfficeForm>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: OfficeForm) => {
    createOfficeMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["offices"]); // Update offices
        setPopupMessage("Office wurde hinzugefügt!");
        setShowPopup(true);
        reset();
      },
      onError: (error) => {
        console.error("Error adding office:", error);
        setPopupMessage("Fehler beim Hinzufügen des Offices!");
        setShowPopup(true);
      },
    });
  };

  return (
    <section className="border-b-[1.5px] my-10">
      <h2>Office hinzufügen</h2>
      <form className="mb-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex md:flex-row flex-col items-start justify-center gap-2">
          <div className="md:w-3/5 w-full">
            <input
              id="name"
              type="text"
              placeholder="Name des Offices"
              {...register("name")}
              className="mb-2"
            />
            {errors.name && (
              <p className=" text-red-600 mb-2">{errors.name.message}</p>
            )}
          </div>
          <div className="md:w-1/5 w-full">
            <input
              id="columns"
              type="number"
              placeholder="Spalten"
              {...register("columns")}
              className="mb-2"
            />
            {errors.columns && (
              <p className=" text-red-600 mb-2">{errors.columns.message}</p>
            )}
          </div>
          <div className="md:w-1/5 w-full">
            <input
              id="rows"
              type="number"
              placeholder="Reihen"
              {...register("rows")}
              className="mb-2"
            />
            {errors.rows && (
              <p className=" text-red-600 mb-2">{errors.rows.message}</p>
            )}
          </div>
        </div>
        <button className="mb-3">Office hinzufügen</button>
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
