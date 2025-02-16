import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { test, expect, vi } from "vitest";
import { VehiculoCard } from "../../../Components/VehiculoCard/VehiculoCard";
import axios from "axios";

// Simula llamada axios
vi.mock("axios");

const vehiculos = [
  {
    id: 1,
    name: "Toyota Corolla",
    brand: "Toyota",
    images: [{ filename: "image1.jpg" }],
  },
  {
    id: 2,
    name: "Honda Civic",
    brand: "Honda",
    images: [{ filename: "image2.jpg" }],
  },
];

test('primero puestra el texto "LOADING" y luego muestra la data', async () => {
  axios.get.mockResolvedValueOnce({ data: vehiculos });

  render(
    <BrowserRouter>
      <VehiculoCard />
    </BrowserRouter>
  );

  // Antes de recibir data muestra el text LOADING
  expect(screen.getByText(/LOADING/i)).toBeInTheDocument();

  //simula llamada a axios
  await waitFor(() => {
    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
  });

  //verifica que se muestre el contenido en pantalla
  const img = await screen.findByRole("img", { name: /Toyota Corolla/i });
  expect(img).toHaveAttribute("src", expect.stringContaining("image1.jpg"));
});
