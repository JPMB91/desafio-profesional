import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Routes/Home.jsx";
import { AdminPanel } from "./Routes/AdminPanel.jsx";
import { Detail } from "./Components/Detail/Detail.jsx";
import { AddVehiculoForm } from "./Components/AddVehiculoForm/AddVehiculoForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/add-vehiculo" element={<AddVehiculoForm/>}/>
          <Route path="/vehicle/:id" element={<Detail/> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
