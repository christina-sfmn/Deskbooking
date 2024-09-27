import { useGetAllOffices } from "../../hooks/booking/useGetAllOffices";
import { OfficeView } from "./OfficeView";
import { Loader } from "../Loader";

export const BookingPlanPage = () => {
  const { data, isLoading, isError } = useGetAllOffices(); // Get data from useGetAllOffices hook

  return (
    <>
      <h1 className="text-center">Offices</h1>
      {data && <OfficeView data={data} />}
      {isLoading && <Loader />}
      {isError && (
        <p className="text-center">
          Büros konnten nicht geladen werden. Bitte später erneut versuchen!
        </p>
      )}
    </>
  );
};
