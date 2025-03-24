import { Outlet } from "react-router-dom";
import { Header } from "../Components/Header/Header";
import { Footer } from "../Components/Footer/Footer";
import { WhatsAppButton } from "../Components/WhatsAppButton/whatsAppButton";

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