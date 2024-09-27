import { OfficeObject } from "../../types";
import { useNavigate } from "react-router-dom";

type OfficeViewProps = {
  data: OfficeObject[];
};

export const OfficeView = ({ data }: OfficeViewProps) => {
  const navigate = useNavigate(); // useNavigate hook for page navigation

  return (
    <section className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
      {data.map((office) => (
        <div
          key={office.id}
          onClick={() => navigate(`${office.id}`)}
          className="bg-booking_lightgrey hover:bg-booking_grey transition-all text-center text-lg font-light shadow rounded p-8 cursor-pointer">
          <p>{office.name}</p>
        </div>
      ))}
    </section>
  );
};
