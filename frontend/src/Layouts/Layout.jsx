import { Outlet } from "react-router-dom";
import { Header } from "../Components/Header/Header";
import { Footer } from "../Components/Footer/Footer";
// import '../index.css'

export const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
