import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Routes/Home.jsx";
import { AdminPanel } from "./Routes/AdminPanel.jsx";
import { Detail } from "./Components/Detail/Detail.jsx";
import { AddVehiculoForm } from "./Components/AddVehiculoForm/AddVehiculoForm.jsx";
import { VehicleTable } from "./Components/VehicleTable/VehicleTable.jsx";
import { UpdateVehicle } from "./Components/UpdateVehicle/UpdateVehicle.jsx";
import { RegisterForm } from "./Components/RegisterForm/RegisterForm.jsx";
import { LoginForm } from "./Components/LoginForm/LoginForm.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/administracion" element={<AdminPanel />} />
          <Route path="/administracion/add-vehiculo" element={<AddVehiculoForm/>}/>
          <Route path="/administracion/lista-vehiculos" element={<VehicleTable />}/>
          <Route path="/administracion/actualizar/:id" element={<UpdateVehicle/>}/>
          <Route path="/vehicle/:id" element={<Detail/> }/>
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/login" element={<LoginForm />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
