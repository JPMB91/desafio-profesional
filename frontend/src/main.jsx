import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home.jsx";
import { VehicleTable } from "./Components/VehicleTable/VehicleTable.jsx";

import { AdminFilter } from "./Components/AdminFilter/AdminFilter.jsx";
import { Unauthorized } from "./Components/AdminFilter/Unauthorized.jsx";
import { UserTable } from "./Components/UserTable/UserTable.jsx";

import { AdminLayout } from "./Layouts/AdminLayout.jsx";
import { CharacteristicTable } from "./Components/CharacteristicTable/CharacteristicTable.jsx";
import { CharacteristicUpdateForm } from "./Components/CharacteristicUpdateForm/CharacteristicUpdateForm.jsx";
import { VehicleUpdateForm } from "./Components/VehicleUpdateForm/VehicleUpdateForm.jsx";
import { CharacteristicAddForm } from "./Components/CharacteristicAddForm/CharacteristicAddForm.jsx";
import { VehicleAddForm } from "./Components/VehicleAddForm/VehicleAddForm.jsx";
import { VehicleDetail } from "./Components/VehicleDetail/VehicleDetail.jsx";
import { CategoryAddForm } from "./Components/CategoryAddForm/CategoryAddForm.jsx";
import { UserRegisterForm } from "./Components/UserRegisterForm/UserRegisterForm.jsx";
import { UserLoginForm } from "./Components/UserLoginForm/UserLoginForm.jsx";

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
                <AdminLayout />
              </AdminFilter>
            }
          >
            <Route index element={<VehicleTable  />} />
            <Route path="add-vehiculo" element={<VehicleAddForm />} />
            <Route path="lista-vehiculos" element={<VehicleTable />} />
            <Route path="actualizar/:id" element={<VehicleUpdateForm />} />
            <Route path="listar-usuarios" element={<UserTable />} />
            <Route
              path="agregar-caracteristica"
              element={<CharacteristicAddForm />}
            />
            <Route
              path="listar-caracteristicas"
              element={<CharacteristicTable />}
            />
            <Route
              path="actualizar-caracteristica/:id"
              element={<CharacteristicUpdateForm />}
            />

            <Route path="agregar-categoria"
            element={<CategoryAddForm/>}/>

            //! agregar categoria ruta
          </Route>
          <Route path="/vehicle/:id" element={<VehicleDetail   />} />
          <Route path="/register" element={<UserRegisterForm />} />
          <Route path="/login" element={<UserLoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
