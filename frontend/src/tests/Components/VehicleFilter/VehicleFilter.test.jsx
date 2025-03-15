import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import { expect, describe, vi, beforeEach, afterEach, test } from "vitest";
import axios from "axios";
import * as AuthContext from "../../../context/Auth.Context";
import { DesktopProvider } from "../../../context/Desktop.Context";
import { VehicleFilter } from "../../../Components/VehicleFilter/VehicleFilter";
import { FavoriteProvider } from "../../../context/Favorite.Context";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

// mock de VehicleCard
vi.mock("../../../Components/VehicleCard/VehicleCard", () => ({
  VehicleCard: ({ vehicle }) => (
    <div data-testid={`vehicle-${vehicle.id}`}>
      {vehicle.brand} {vehicle.model}
    </div>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const mockVehicles = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    category: { id: 1, name: "Sedan" },
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    category: { id: 2, name: "Hatchback" },
  },
  {
    id: 3,
    brand: "Ford",
    model: "Mustang",
    category: { id: 1, name: "Sedan" },
  },
];

describe("VehicleFilter Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockVehicles });
    useSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
  });

  test("no deberia mostrar vehiculos si no se selecciona una categoria", async () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <FavoriteProvider>
            <VehicleFilter />
            </FavoriteProvider>
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // grid que muestra las cards con los resultados
    const vehicleGrid = document.querySelector(".grid");
    
    // ver si esta vacio
    expect(vehicleGrid).toBeEmptyDOMElement();
    
  });


  test("deberia mostrar resultados si se selecciona una categoria disponible", async () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <VehicleFilter />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Sedan/i)).toBeInTheDocument();
    });

    // selecciona categoria
    fireEvent.click(screen.getByLabelText(/Sedan/i));

    
    await waitFor(() => {
  
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
      
      // este vehiculo no deberia estar presente
      expect(screen.queryByText(/Honda Civic/i)).not.toBeInTheDocument();
    });

  });
});