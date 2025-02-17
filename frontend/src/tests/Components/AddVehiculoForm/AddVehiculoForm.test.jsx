import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { AddVehiculoForm } from "../../../Components/AddVehiculoForm/AddVehiculoForm";
import userEvent from "@testing-library/user-event";
import { DesktopProvider } from "../../../context/Desktop.context";

vi.mock("axios");

const categoriasDeVehiculos = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
  { id: 3, name: "Category 3" },
];

test("Debe mostrar el mensaje de error si 'fuelType' no se ingresa en el form", async () => {
  axios.get.mockResolvedValueOnce({ data: categoriasDeVehiculos });

  render(
    <BrowserRouter>
      <DesktopProvider>
        <AddVehiculoForm />
      </DesktopProvider>
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

  render(
    <BrowserRouter>
      <DesktopProvider>
        <AddVehiculoForm />
      </DesktopProvider>
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

  render(
    <BrowserRouter>
      <DesktopProvider>
        <AddVehiculoForm />
      </DesktopProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByRole("button", { name: /Añadir Vehiculo/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Debe insertar imagenes/i)).toBeInTheDocument();
  });
});
