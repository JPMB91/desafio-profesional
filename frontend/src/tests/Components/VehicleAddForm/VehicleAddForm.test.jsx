import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { expect, test, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";

import * as AuthContext from "../../../context/Auth.Context";
import { VehicleAddForm } from "../../../Components/Vehicle/VehicleAddForm/VehicleAddForm";

vi.mock("axios");
vi.mock("jwt-decode");

vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
  };
});

beforeEach(() => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { roles: ["ROLE_ADMIN"] },
    isAuthenticated: true,
    loading: false,
  });
});

vi.mock("../../../context/Desktop.Context", () => ({
  DesktopProvider: ({ children }) => children,
  useDesktop: vi.fn().mockReturnValue({ isDesktop: true }),
}));

beforeEach(() => {
  useDesktop.mockReturnValue({
    isDesktop: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const categoriasDeVehiculos = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
  { id: 3, name: "Category 3" },
];

const characteristics = [{ id: 1, name: "Sunroof" }];

test("Debe mostrar el mensaje de error si 'fuelType' no se ingresa en el form", async () => {
  axios.get.mockResolvedValueOnce({ data: categoriasDeVehiculos });
  axios.get.mockResolvedValueOnce({ data: characteristics });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <VehicleAddForm />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByRole("button", { name: /Añadir Vehiculo/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText(/Tipo de combustible es requerido/i)
    ).toBeInTheDocument();
  });
});

test("Debe mostrar todos los mensajes de error si no se ingresa ningun dato", async () => {
  axios.get.mockResolvedValueOnce({ data: categoriasDeVehiculos });
  axios.get.mockResolvedValueOnce({ data: characteristics });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <VehicleAddForm />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByRole("button", { name: /Añadir Vehiculo/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Marca es requerida/i)).toBeInTheDocument();
    expect(screen.getByText(/Modelo es requerido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Año de fabricación es requerido/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Descripción es requerida/i)).toBeInTheDocument();

    expect(screen.getByText(/Categoría es requerida/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Tipo de transmisión es requerido/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Número de puertas es requerido/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Tipo de combustible es requerido/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Matrícula es requerida/i)).toBeInTheDocument();

    expect(screen.getByText(/Costo diario es requerido/i)).toBeInTheDocument();

    expect(screen.getByText(/Debe insertar imagenes/i)).toBeInTheDocument();
  });
});

test("Debe mostrar mensaje de error si no se selecionan imagenes", async () => {
  axios.get.mockResolvedValueOnce({ data: categoriasDeVehiculos });
  axios.get.mockResolvedValueOnce({ data: characteristics });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <VehicleAddForm />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByRole("button", { name: /Añadir Vehiculo/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Debe insertar imagenes/i)).toBeInTheDocument();
  });
});

test("Debe poder crearse un nuevo vehículo si se ingresan los datos correctamente", async () => {
  axios.get.mockResolvedValueOnce({ data: categoriasDeVehiculos });
  axios.get.mockResolvedValueOnce({ data: characteristics });

  const mockCreateObjectURL = vi.fn();
  URL.createObjectURL = mockCreateObjectURL;
  mockCreateObjectURL.mockReturnValue("mock-url");

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <VehicleAddForm />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Marca"), "Toyota");
  await user.type(screen.getByLabelText("Modelo"), "Corolla");
  await user.type(screen.getByLabelText("Año de fabricación"), "2019");
  await user.type(
    screen.getByLabelText("Descripcion"),
    "Vehículo toyota corolla"
  );
  await user.type(screen.getByLabelText("Matricula"), "ABCD22");
  await user.type(screen.getByLabelText("Costo diario"), "70");

  await user.selectOptions(
    screen.getByLabelText("Categoría"),
    String(categoriasDeVehiculos[0].id)
  );
  await user.selectOptions(screen.getByLabelText("Numero de asientos"), "5");
  await user.selectOptions(screen.getByLabelText("Número de puertas"), "4");
  await user.selectOptions(
    screen.getByLabelText("Tipo de transmisión"),
    "AUTOMATIC"
  );
  await user.selectOptions(
    screen.getByLabelText("Tipo de combustible"),
    "GASOLINE"
  );

  //imagenes

  const fileInput = screen.getByLabelText("Imágenes");
  const file = new File([" images "], "example.png", {
    type: "image/png",
  });

  fireEvent.change(fileInput, { target: { files: [file] } });

  const submitButton = screen.getByRole("button", { name: /Añadir Vehiculo/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByLabelText("Marca")).toHaveValue("");
    expect(screen.getByLabelText("Modelo")).toHaveValue("");
  });
});