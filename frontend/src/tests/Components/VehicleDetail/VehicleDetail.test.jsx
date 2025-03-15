import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { expect, test } from "vitest";
import axios from "axios";
import * as AuthContext from "../../../context/Auth.Context";
import { DesktopProvider } from "../../../context/Desktop.Context";
import { CharacteristicsDisplay } from "../../../Components/CharacteristicsDisplay/CharacteristicsDisplay";
import { VehicleDetail } from "../../../Components/VehicleDetail/VehicleDetail";

//mock de scroll into view
global.scrollTo = vi.fn();

vi.mock("../../../hooks/useVehicleRating", () => ({
  useVehicleRating: () => ({
    vehicleRating: 4.5,
    vehicleReviewCount: 10,
    loading: false,
    error: null,
    refreshRating: vi.fn(),
  }),
}));

vi.mock("axios");

// mock de useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "a3f5b0a1-34f9-4c67-aa46-9e841e251ffd" }),
    useNavigate: () => vi.fn(),
  };
});

// reseta los mocks luego de cada test
afterEach(() => {
  vi.restoreAllMocks();
});

const vehicle = {
  id: "a3f5b0a1-34f9-4c67-aa46-9e841e251ffd",
  registrationPlate: "Gj2772hd",
  manufacturingYear: "2019",
  brand: "Toyota",
  model: "Corolla",
  numberOfSeats: 5,
  category: {
    id: 4,
    name: "Sedán",
    categoryDescription:
      "El sedán es un auto amplio de carrocería clásica de tres volúmenes separados: motor, habitáculo, y maletero, con puertas totalmente autónomas.",
    categoryImage: {
      id: 4,
      filename: "eb3cdd33-ef37-4594-bc4e-fe7b92bb954a_sedan.jpg",
    },
  },
  description:
    "El Toyota Corolla es un vehículo confiable y eficiente, ideal para la conducción diaria en ciudad y carretera. Su diseño moderno y aerodinámico optimiza el consumo de combustible. Además, ofrece tecnología avanzada en seguridad y comodidad.",
  name: "Toyota Corolla",
  dailyCost: 70.0,
  numberOfDoors: 4,
  fuelType: "GASOLINE",
  gearShift: "AUTOMATIC",
  characteristics: [
    {
      id: 4,
      name: "Silla para Bebé",
      characteristicImage: {
        id: 4,
        filename:
          "fcc34b3a-7d8c-4b40-a2af-61f9a4f4c590_baby-car-seat-svgrepo-com-1-.svg",
      },
    },
  ],
};

test("Debe verse los caracteristicas del vehiculo en <VehicleDetail/> dentro del componente <CharacteristicsDisplay/>", () => {
  axios.get.mockResolvedValueOnce({ data: vehicle });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <VehicleDetail />
          <CharacteristicsDisplay characteristics={vehicle.characteristics} />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  waitFor(() => {
    expect(screen.getByText(/Silla para Bebé/i)).toBeInTheDocument();
  });
});
