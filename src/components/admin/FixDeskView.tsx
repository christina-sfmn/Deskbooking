import { useState } from "react";
import { useGetAllFixdeskRequests } from "../../hooks/admin/useGetAllFixdeskRequests";
import { useApproveFixdeskRequest } from "../../hooks/admin/useApproveFixdeskRequest";
import { useDeleteFixdeskRequest } from "../../hooks/useDeleteFixdeskRequest";
import { useQueryClient } from "react-query";
import { Loader } from "../Loader";
import { formatDateToGerman } from "../../utils";
import { PopupWindow } from "../PopupWindow";

export const FixDeskView = () => {
  const {
    data: fixdeskRequests,
    isLoading,
    isError,
  } = useGetAllFixdeskRequests(); // Get all FixDesk requests
  const createApproveFixdeskRequestMutation = useApproveFixdeskRequest(); // Approve FixDesk request
  const createDeleteFixdeskRequestMutation = useDeleteFixdeskRequest(); // Delete FixDesk request
  const queryClient = useQueryClient(); // Use query client to invalidate query to update data after button click

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Only show Fixdesk requests that are not yet approved
  const fixdeskRequestsToApprove = fixdeskRequests?.filter(
    (fixdesk: any) => fixdesk.status !== "approved"
  );

  // Handle approve button click
  const handleApprove = (id: string) => {
    createApproveFixdeskRequestMutation.mutate(
      { id, status: "approved" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["fixdesks"]); // Update FixDesk requests
        },
        onError: (error) => {
          console.error("Error approving FixDesk request:", error);
          setPopupMessage("Fehler beim Bestätigen der FixDesk-Anfrage!");
          setShowPopup(true);
        },
      }
    );
  };

  // Handle decline button click
  const handleDecline = (id: string) => {
    createDeleteFixdeskRequestMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["fixdesks"]); // Update FixDesk requests
        },
        onError: (error) => {
          console.error("Error deleting FixDesk request:", error);
          alert("Fehler beim Löschen der FixDesk-Anfrage!");
        },
      }
    );
  };

  return (
    <section className="border-b-[1.5px] my-10">
      <h2>FixDesk-Anfragen</h2>
      {fixdeskRequestsToApprove && fixdeskRequestsToApprove.length > 0 ? (
        <ul className="mb-10">
          {fixdeskRequestsToApprove.map((fixdesk: any) => (
            <li key={fixdesk.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  {fixdesk.desk.label} / {fixdesk.desk.office.name}
                </h3>
                <p>
                  <span className="font-bold">Angefragt von: </span>
                  {fixdesk.user.firstname} {fixdesk.user.lastname}
                </p>
                <p>
                  <span className="font-bold">Angefragt am: </span>
                  {formatDateToGerman(new Date(fixdesk.createdAt))}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleApprove(fixdesk.id)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1">
                  <img
                    src="/src/assets/icons/check.svg"
                    alt="Bestätigen"
                    className="w-4 h-6"
                  />
                </button>
                <button
                  onClick={() => handleDecline(fixdesk.id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1">
                  <img
                    src="/src/assets/icons/x.svg"
                    alt="Löschen"
                    className="w-4 h-6"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 mb-10">Keine FixDesk-Anfragen!</p>
      )}
      {isLoading && <Loader />}
      {isError && (
        <p className="mb-10">
          FixDesk-Anfragen konnten nicht geladen werden. Bitte später erneut
          versuchen!
        </p>
      )}
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
