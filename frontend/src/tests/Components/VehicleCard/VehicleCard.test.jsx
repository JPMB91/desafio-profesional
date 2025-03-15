import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { test, expect, vi } from "vitest";
import { VehicleCard } from "../../../Components/VehicleCard/VehicleCard";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import { AuthProvider, useAuth } from "../../../context/Auth.Context";
import { FavoriteProvider } from "../../../context/Favorite.Context";
import axios from "axios"; 

vi.mock("axios"); 

const mockToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sIm5hbWUiOiJhZG1pbiBhZG1pbiIsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc0MDk2NjgxNywiZXhwIjoxNzQxMDAyODE3fQ.VZLsBi4H5Dln2uvZ_nItH2MGb6Q8JFiDjDhYwOUJ628";

vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

beforeEach(() => {
  useAuth.mockReturnValue({
    user: { roles: ["ROLE_ADMIN"] },
    isAuthenticated: true,
    token: mockToken,
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

test("<VehicleCard/> muestra la data del vehículo", async () => {
  const vehicle = {
    id: 1,
    name: "Toyota Corolla",
    brand: "Toyota",
    images: [{ filename: "image1.jpg" }],
    manufacturingYear: 2020,
    numberOfDoors: 4,
    numberOfSeats: 5,
    category: { name: "Sedan" },
    dailyCost: 50,
    fuelType: "Gasoline",
    gearShift: "Automatic",
  };

  const mockVehicleRating = {
    data: {
      averageScore: 4.5,
      reviewCount: 10,
    },
  };

  axios.get.mockResolvedValue(mockVehicleRating); 

  render(
    <BrowserRouter>
      <AuthProvider>
        <DesktopProvider>
          <FavoriteProvider>
            <VehicleCard vehicle={vehicle} />
          </FavoriteProvider>
        </DesktopProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
  expect(screen.getByText(/2020 • 4 puertas • 5 asientos/i)).toBeInTheDocument();
  expect(screen.getByText(/Sedan/i)).toBeInTheDocument();
  expect(screen.getByText(/\$50.00\/día/i)).toBeInTheDocument();
  expect(screen.getByText(/Gasoline/i)).toBeInTheDocument();
  expect(screen.getByText(/Automatic/i)).toBeInTheDocument();

  const img = await screen.findByRole("img", { name: /Toyota Corolla/i });
  expect(img).toHaveAttribute("src", expect.stringContaining("image1.jpg"));

  await waitFor(() => {
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:8080/api/reviews/1"
  );
});