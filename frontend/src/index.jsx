// src/index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Routes/Home.jsx";
import { AdminLayout } from "./Routes/AdminLayout.jsx";
import { AdminPanel } from "./Routes/AdminPanel.jsx";
import { AddVehiculoForm } from "./Components/AddVehiculoForm/AddVehiculoForm.jsx";
import { VehicleTable } from "./Components/VehicleTable/VehicleTable.jsx";
import { UpdateVehicle } from "./Components/UpdateVehicle/UpdateVehicle.jsx";
import { UserTable } from "./Components/UserTable/UserTable.jsx";
import { AddCharacteristicForm } from "./Components/AddCharacteristicForm/AddCharacteristicForm.jsx";
import { Detail } from "./Components/Detail/Detail.jsx";
import { LoginForm } from "./Components/LoginForm/LoginForm.jsx";
import { RegisterForm } from "./Components/RegisterForm/RegisterForm.jsx";
import { Unauthorized } from "./Components/AdminFilter/Unauthorized.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="vehicle/:id" element={<Detail />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/administracion" 
        // element={<AdminLayout />}
        >
          <Route index element={<AdminLayout />}/>
           {/* element={<AdminPanel />} /> */}
          <Route path="add-vehiculo" element={<AddVehiculoForm />} />
          <Route path="lista-vehiculos" element={<VehicleTable />} />
          <Route path="actualizar/:id" element={<UpdateVehicle />} />
          <Route path="listar-usuarios" element={<UserTable />} />
          <Route path="agregar-caracteristica" element={<AddCharacteristicForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);