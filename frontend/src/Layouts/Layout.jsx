import { Outlet } from "react-router-dom";
import { Header } from "../Components/UI/Header/Header";
import { Footer } from "../Components/UI/Footer/Footer";
import { WhatsAppButton } from "../Components/UI/WhatsAppButton/WhatsAppButton";


export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>

      <WhatsAppButton />

      <Footer />
    </div>
  );
};