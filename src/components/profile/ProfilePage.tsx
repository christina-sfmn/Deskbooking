import { useState } from "react";
import useAuth from "../../hooks/layout+login/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { useGetAllDepartments } from "../../hooks/useGetAllDepartments";
import { useUpdateUser } from "../../hooks/profile/useUpdateUser";
import { Loader } from "../Loader";
import { useQueryClient } from "react-query";
import { PopupWindow } from "../PopupWindow";
import { formatDateToGerman } from "../../utils";

// Type for form validation
export type UserForm = {
  firstname: string;
  lastname: string;
  email: string;
  department: string;
  password: string;
};

export const ProfilePage = () => {
  const navigate = useNavigate(); // useNavigate hook for page navigation
  const { data: currentUser, isLoading, isError } = useGetCurrentUser(); // Get current user
  const { data: departments } = useGetAllDepartments(); // Get all departments
  const createUpdateUserMutation = useUpdateUser(); // Update user
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click
  const { logout } = useAuth(); // Logout user

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Setup yup form validation schema
  const schema = yup.object().shape({
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

  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: UserForm) => {
    createUpdateUserMutation.mutate(
      { userId: currentUser.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["user"]); // Update user
          setPopupMessage("Benutzerdaten erfolgreich aktualisiert!");
          setShowPopup(true);
        },
        onError: () => {
          setPopupMessage("Fehler beim Aktualisieren der Benutzerdaten!");
          setShowPopup(true);
        },
      }
    );
  };

  // Logout user + navigate back to LoginPage
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <h1>Profil</h1>
      <div className="flex md:flex-row flex-col items-end justify-center gap-20">
        {currentUser && departments && (
          <>
            <form className="md:w-3/5 w-full mt-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="label-container">
                <label htmlFor="firstname">Vorname:</label>
                <input
                  id="firstname"
                  type="text"
                  defaultValue={currentUser.firstname}
                  {...register("firstname")}
                  className="mb-2"
                />
              </div>
              {errors.firstname && (
                <p className=" text-red-600 mb-2">{errors.firstname.message}</p>
              )}
              <div className="label-container">
                <label htmlFor="lastname">Nachname:</label>
                <input
                  id="lastname"
                  type="text"
                  defaultValue={currentUser.lastname}
                  {...register("lastname")}
                  className="mb-2"
                />
              </div>
              {errors.lastname && (
                <p className=" text-red-600 mb-2">{errors.lastname.message}</p>
              )}
              <div className="label-container">
                <label htmlFor="email">E-Mail:</label>
                <input
                  id="email"
                  type="email"
                  defaultValue={currentUser.email}
                  {...register("email")}
                  className="mb-2"
                />
              </div>
              {errors.email && (
                <p className=" text-red-600 mb-2">{errors.email.message}</p>
              )}
              <div className="label-container">
                <label htmlFor="department">Abteilung:</label>
                <select
                  id="department"
                  defaultValue={currentUser.department}
                  {...register("department")}
                  className="mb-2">
                  <option>Abteilung</option>
                  {departments?.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className=" text-red-600 mb-2">
                  {errors.department.message}
                </p>
              )}
              <div className="label-container">
                <label htmlFor="password">Passwort:</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Neues Passwort eingeben"
                  {...register("password")}
                  className="mb-2"
                />
              </div>
              {errors.password && (
                <p className=" text-red-600 mb-2">{errors.password.message}</p>
              )}

              <button type="submit" className="w-full mt-2">
                Daten ändern
              </button>
            </form>
            <section className="md:w-2/5 w-full leading-7">
              <img
                src="/assets/img/user-profile.svg"
                alt="User Profil"
                className="md:w-full w-1/2 max-h-80 mb-5 mx-auto"
              />
              <p>
                <span className="font-bold">Eingeloggt als: </span>
                {currentUser.firstname} {currentUser.lastname}
              </p>
              <p>
                <span className="font-bold">Account erstellt am: </span>
                {formatDateToGerman(new Date(currentUser.createdAt))}
              </p>
              <p>
                <span className="font-bold">Zuletzt angemeldet am: </span>
                {formatDateToGerman(new Date(currentUser.updatedAt))}
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-booking_grey hover:bg-booking_lightgrey text-black leading-normal mt-2">
                Logout
              </button>
            </section>
          </>
        )}
        {isLoading && <Loader />}
        {isError && (
          <p>
            Userdaten konnte nicht geladen werden. Bitte später erneut
            versuchen!
          </p>
        )}
      </div>

      {showPopup && (
        <PopupWindow
          message={popupMessage}
          onClose={() => {
            handleClosePopup();
          }}
        />
      )}
    </>
  );
};
