import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./Routes/Home.jsx";
import { AdminPanel } from "./Routes/AdminPanel.jsx";
import { Detail } from "./Components/Detail/Detail.jsx";
import { AddVehiculoForm } from "./Components/AddVehiculoForm/AddVehiculoForm.jsx";
import { VehicleTable } from "./Components/VehicleTable/VehicleTable.jsx";
import { UpdateVehicle } from "./Components/UpdateVehicle/UpdateVehicle.jsx";
import { RegisterForm } from "./Components/RegisterForm/RegisterForm.jsx";
import { LoginForm } from "./Components/LoginForm/LoginForm.jsx";
import { AdminFilter } from "./Components/AdminFilter/AdminFilter.jsx";
import { Unauthorized } from "./Components/AdminFilter/Unauthorized.jsx";
import { UserTable } from "./Components/UserTable/UserTable.jsx";
import { AddCharacteristicForm } from "./Components/AddCharacteristicForm/AddCharacteristicForm.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          <Route
            path="/administracion"
            element={
              <AdminFilter>
                <Outlet />
              </AdminFilter>
            }
          >
            <Route index element={<AdminPanel />} />
            <Route path="add-vehiculo" element={<AddVehiculoForm />} />
            <Route path="lista-vehiculos" element={<VehicleTable />} />
            <Route path="actualizar/:id" element={<UpdateVehicle />} />
            <Route path="listar-usuarios" element={<UserTable />}/>
            <Route path="agregar-caracteristica" element={<AddCharacteristicForm />}/>
          </Route>

          <Route path="/vehicle/:id" element={<Detail />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
