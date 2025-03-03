import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { expect, test } from "vitest";
import axios from "axios";
import * as AuthContext from "../../../context/Auth.Context";
import { DesktopProvider} from "../../../context/Desktop.Context";
import { CharacteristicsDisplay } from "../../../Components/CharacteristicsDisplay/CharacteristicsDisplay";
import {VehicleDetail} from "../../../Components/VehicleDetail/VehicleDetail"

vi.mock("axios");


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
  images: [
    {
      id: 1,
      filename: "d4032180-0b86-4bc5-8f3a-b8b309d500a6_1corolla1.jpg",
    },
    {
      id: 2,
      filename:
        "7c36536d-1946-4826-b3c7-715f0be112a8_corolla_xei_2019_interior_preto.webp",
    },
    {
      id: 3,
      filename:
        "cd559c8e-3e4e-41c3-8898-3d30f4091d52_Toyota-Corolla-2019--2-.webp",
    },
    {
      id: 4,
      filename:
        "98ecaac3-9e42-4e20-a8e3-c5b529689d4c_Toyota-Corolla-2019--3-.webp",
    },
    {
      id: 5,
      filename:
        "212b903d-a36b-436f-8d03-d0ef0f702125_Toyota-Corolla-2019--4-.webp",
    },
  ],
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

    waitFor(() =>{
      expect(screen.getByText(/Silla para Bebé/i)).toBeInTheDocument()
    })
    
});
