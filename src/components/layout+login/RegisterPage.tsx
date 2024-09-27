import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllDepartments } from "../../hooks/useGetAllDepartments";
import { useRegisterUser } from "../../hooks/layout+login/useRegisterUser";
import { Loader } from "../Loader";
import { PopupWindow } from "../PopupWindow";

// Define validation schema
const validationSchema = yup.object().shape({
  firstname: yup.string().required("Bitte Vorname eingeben!"),
  lastname: yup.string().required("Bitte Nachname eingeben!"),
  email: yup
    .string()
    .email("E-Mail-Adresse ist nicht im richtigen Format!")
    .required("Bitte E-Mail-Adresse eingeben!"),
  department: yup.string().required("Bitte Abteilung auswählen!"),
  password: yup
    .string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein!")
    .max(20, "Passwort darf nicht länger als 20 Zeichen lang sein!")
    .matches(/^\S*$/, "Password darf keine Leerzeichen enthalten!")
    .required("Bitte Passwort eingeben!"),
});

export const RegisterPage = () => {
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const { data: departments } = useGetAllDepartments(); // Hook for fetching departments
  const { mutate: registerUser, isLoading, isError } = useRegisterUser(); // Hook for user registration

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      // Call the registerUser function with form data
      await registerUser(data, {
        onSuccess: () => {
          setPopupMessage(
            "Erfolgreich registriert! Sie werden gleich weitergeleitet ..."
          );
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/"); // Redirect to login page after successful registration
          }, 3000); // Timeout for redirection
        },
      });
    } catch (error) {
      setPopupMessage(
        "Registrierung fehlgeschlagen! Bitte versuchen Sie es später erneut."
      );
      setShowPopup(true);
    }
  };

  return (
    <main className="container-login">
      <div className="container-center">
        <img
          src="src/assets/Diamir-Logo.png"
          alt="Diamir Logo"
          className="logo-login-register"
        />
        <h1 className="text-4xl mt-6">Desk Booking App</h1>

        <form className="form-login-register" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-center pb-6">Registrieren</h2>
          <input type="text" placeholder="Vorname" {...register("firstname")} />
          {errors.firstname && (
            <p className=" text-red-600">{errors.firstname.message}</p>
          )}

          <input type="text" placeholder="Nachname" {...register("lastname")} />
          {errors.lastname && (
            <p className=" text-red-600">{errors.lastname.message}</p>
          )}

          <input type="email" placeholder="E-Mail" {...register("email")} />
          {errors.email && (
            <p className=" text-red-600">{errors.email.message}</p>
          )}

          <select {...register("department")} defaultValue="">
            <option value="" disabled>
              Abteilung
            </option>
            {departments?.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className=" text-red-600">{errors.department.message}</p>
          )}

          <input
            type="password"
            placeholder="Passwort"
            {...register("password")}
          />
          {errors.password && (
            <p className=" text-red-600">{errors.password.message}</p>
          )}

          <button type="submit">Registrieren</button>
        </form>
        {isLoading && <Loader />}
        {isError && (
          <div className="text-red-600 mt-2">
            Registrierung fehlgeschlagen! Bitte überprüfen Sie, ob es bereits einen User mit Ihren Daten gibt.
          </div>
        )}
        <div className="text-sm pt-3 justify-start w-full">
          <div>Bereits registriert?</div>
          <Link to="/" className="underline font-semibold">
            Jetzt anmelden!
          </Link>
        </div>
      </div>

      {showPopup && (
        <PopupWindow
          message={popupMessage}
          onClose={() => {
            handleClosePopup();
          }}
        />
      )}
    </main>
  );
};
