import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

export default function RootLayout() {
  return (
    <section>
      <Nav />
      <Sidebar />
      <div className="md:ml-[220px] xl:ml-[240px] min-h-screen mt-14 md:mt-0">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </section>
  );
}
