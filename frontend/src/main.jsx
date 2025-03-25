import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Outlet, Route, Routes, ScrollRestoration } from "react-router-dom";
import { Home } from "./Pages/Home.jsx";


import { AdminFilter } from "./Components/Admin/AdminFilter/AdminFilter.jsx";
import { Unauthorized } from "./Components/Admin/AdminFilter/Unauthorized.jsx";
import { UserTable } from "./Components/User/UserTable/UserTable.jsx";


import { CharacteristicTable } from "./Components/Characteristic/CharacteristicTable/CharacteristicTable.jsx";
import { CharacteristicUpdateForm } from "./Components/Characteristic/CharacteristicUpdateForm/CharacteristicUpdateForm.jsx";
import { VehicleUpdateForm } from "./Components/Vehicle/VehicleUpdateForm/VehicleUpdateForm.jsx";
import { CharacteristicAddForm } from "./Components/Characteristic/CharacteristicAddForm/CharacteristicAddForm.jsx";
import { VehicleAddForm } from "./Components/Vehicle/VehicleAddForm/VehicleAddForm.jsx";
import { VehicleDetail } from "./Components/Vehicle/VehicleDetail/VehicleDetail.jsx";
import { CategoryAddForm } from "./Components/Category/CategoryAddForm/CategoryAddForm.jsx";
import { UserRegisterForm } from "./Components/User/UserRegisterForm/UserRegisterForm.jsx";
import { UserLoginForm } from "./Components/User/UserLoginForm/UserLoginForm.jsx";

import { CategoryTable } from "./Components/Category/CategoryTable/CategoryTable.jsx";
import { ReservationAddForm } from "./Components/ReservationAddForm/ReservationAddForm.jsx";
import { ReservationSuccess } from "./Pages/ReservationSuccess.jsx";
import { UserReservationHistory } from "./Components/User/UserReservationHistory/UserReservationHistory.jsx";
import { AdminLayout } from "./Layouts/AdminLayout.jsx";
import { VehicleTable } from "./Components/Vehicle/VehicleTable/VehicleTable.jsx";
import { UserFavoriteList } from "./Components/User/UserFavoriteList/UserFavoriteList.jsx";

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
            
            <Route path="listar-categorias"
            element={<CategoryTable />}/>

          </Route>
          <Route path="/vehicle/:id" element={<VehicleDetail   />} />
          <Route path="/register" element={<UserRegisterForm />} />
          <Route path="/login" element={<UserLoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/listar-favoritos" element={<UserFavoriteList />}/>
          <Route path="crear-reserva" element={<ReservationAddForm/>}/>
          <Route path="reserva-exitosa" element={<ReservationSuccess/>}/>
          <Route path="historial-reservas" element={<UserReservationHistory />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
