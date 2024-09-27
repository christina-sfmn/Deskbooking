// Type for PopupWindowProps
export type PopupWindowProps = {
  message: string;
  onClose: () => void;
};

export const PopupWindow = ({ message, onClose }: PopupWindowProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center bg-white rounded shadow-lg max-w-[23.5rem] p-8 md:-mt-10 mt-0 mx-auto">
        <p className="text-center font-semibold">{message}</p>
        <button onClick={onClose} className="min-w-32 mt-3">
          Ok
        </button>
      </div>
    </div>
  );
};
