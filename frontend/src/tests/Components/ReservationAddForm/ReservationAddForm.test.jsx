import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ReservationAddForm } from "../../../Components/Reservation/ReservationAddForm/ReservationAddForm";
import * as AuthContext from "../../../context/Auth.Context";
import axios from "axios";
import { ReservationSuccess } from "../../../Pages/ReservationSuccess";
import { Unauthorized } from "../../../Components/Admin/AdminFilter/Unauthorized";

vi.mock("axios");

beforeEach(() => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { roles: ["ROLE_USER"] },
    isAuthenticated: true,
    loading: false,
    token: "mocktoken",
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockVehicleId = "8bbfd852-a9ba-4593-87e1-16cb651c4955";

const mockUser = {
  sub: "user@user.com",
  roles: ["ROLE_USER"],
};

const mockLocationState = {
  state: {
    user: mockUser,
    startDate: "2025-03-28",
    endDate: "2025-03-30",
    vehicleId: mockVehicleId,
    vehicleImage: "mockImage.jpg",
    vehicleBrand: "Toyota",
    vehicleModel: "Corolla",
    vehicleDailyCost: 50,
  },
};

test("Debe permitir la reservación de un vehículo a un usuario que ha iniciado sesión", async () => {
  axios.post.mockResolvedValueOnce({ status: 200 });

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/crear-reserva", ...mockLocationState }]}
    >
      <Routes>
        <Route path="/crear-reserva" element={<ReservationAddForm />} />
        <Route path="/reserva-exitosa" element={<ReservationSuccess />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Toyota")).toBeInTheDocument();
  expect(screen.getByText("Corolla")).toBeInTheDocument();
  expect(screen.getByText("$ 100")).toBeInTheDocument();

  const submitButton = screen.getByText("Confirmar Reserva");
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/reservations",
      {
        email: "user@user.com",
        startDate: "2025-03-28",
        endDate: "2025-03-30",
        vehicleId: mockVehicleId,
        message: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mocktoken",
        },
      }
    );
  });

  // redirección a la página de éxito
  await waitFor(() => {
    expect(screen.getByText("Reserva Éxitosa")).toBeInTheDocument();
  });
});

test("No debe permitir reserva si el usuario no está autenticado", () => {
  // usuario no autenticado
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: null,
    isAuthenticated: false,
    loading: false,
    token: null,
  });

  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/crear-reserva", ...mockLocationState }]}
    >
      <Routes>
        <Route path="/crear-reserva" element={<ReservationAddForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </MemoryRouter>
  );

  // se muestra el componente por no estar autorizado
  expect(
    screen.getByText(
      "No cuenta con los permisos necesarios para ver este contenido."
    )
  ).toBeInTheDocument();
});
