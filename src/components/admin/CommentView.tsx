import { useState } from "react";
import { useGetAllComments } from "../../hooks/admin/useGetAllComments";
import { useDeleteComment } from "../../hooks/admin/useDeleteComment";
import { useQueryClient } from "react-query";
import { Loader } from "../Loader";
import { formatDateToGerman } from "../../utils";
import { PopupWindow } from "../PopupWindow";

export const CommentView = () => {
  const { data: comments, isLoading, isError } = useGetAllComments(); // Get all comments
  const createDeleteCommentMutation = useDeleteComment(); // Delete comment
  const queryClient = useQueryClient(); // Use query client to invalidate comments-query to update data after button click

  // Setup for popup window
  const [popupMessage, setPopupMessage] = useState(""); // useState to set popup message
  const [showPopup, setShowPopup] = useState(false); // useState to set popup visible/invisible
  const handleClosePopup = () => setShowPopup(false); // Close popup window

  // Handle delete button click
  const handleDelete = (id: string) => {
    createDeleteCommentMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["comments"]); // Update comments
        },
        onError: (error) => {
          console.error("Error deleting comments:", error);
          setPopupMessage("Fehler beim Löschen des Kommentars!");
          setShowPopup(true);
        },
      }
    );
  };

  return (
    <section className="my-10">
      <h2>Kommentare</h2>
      {comments && comments.length > 0 ? (
        <ul className="my-6">
          {comments.map((comment: any) => (
            <li
              key={comment.id}
              className="flex items-center justify-between border-b-[1.5px]">
              <div className="w-5/6 my-2">
                <p className="font-bold">
                  Von {comment.user.firstname} {comment.user.lastname} zu{" "}
                  {comment.desk.label}:
                </p>
                <p className="leading-5">{comment.comment}</p>
                <p className="text-xs mt-1">
                  am {formatDateToGerman(new Date(comment.commentedAt))}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1">
                  <img
                    src="/assets/icons/x.svg"
                    alt="Löschen"
                    className="w-4 h-6"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 mb-10">Keine Kommentare!</p>
      )}
      {isLoading && <Loader />}
      {isError && (
        <p className="mb-10">
          Kommentare konnten nicht geladen werden. Bitte später erneut
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
