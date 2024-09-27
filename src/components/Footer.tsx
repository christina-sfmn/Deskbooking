export const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between w-full bg-booking_matteblack text-white text-sm p-10">
      <p>© 2024 | Merisa Kapic & Christina Schöffmann</p>
      <div className="text-right flex gap-3 md:mb-0 mb-3">
        <a href="https://diamir.io/kontakt/" target="blank">
          Impressum
        </a>
        <a href="https://diamir.io/datenschutzerklarung/" target="blank">
          Datenschutz
        </a>
      </div>
    </footer>
  );
};