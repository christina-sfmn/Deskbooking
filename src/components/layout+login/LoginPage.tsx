import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useAuth from "../../hooks/layout+login/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { PopupWindow } from "../PopupWindow";

// Define the validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Ungültige E-Mail-Adresse!")
    .required("Bitte E-Mail-Adresse eingeben!"),
  password: Yup.string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein!")
    .max(20, "Passwort darf nicht länger als 20 Zeichen lang sein!")
    .matches(/^\S*$/, "Password darf keine Leerzeichen enthalten!") // No whitespace constraint
    .required("Bitte Passwort eingeben!"),
});

// Define the type for form data
type FormData = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Initialize useForm with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/home"); // Redirect to the homepage after successful login
    } catch (error) {
      setPopupMessage("Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.");
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

        <form onSubmit={handleSubmit(onSubmit)} className="form-login-register">
          <h2 className="text-center pb-6">Login</h2>
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="E-Mail"
              autoComplete="true"
            />
            {errors.email && (
              <div className="text-red-600">{errors.email.message}</div>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Passwort"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password.message}</div>
            )}
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="text-sm pt-3 justify-start w-full">
          <div>Noch nicht registiert?</div>
          <Link to="/register" className="underline font-semibold">
            Jetzt registrieren!
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
