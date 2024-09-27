import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";

const AuthenticatedLayout = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto py-20 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AuthenticatedLayout;
