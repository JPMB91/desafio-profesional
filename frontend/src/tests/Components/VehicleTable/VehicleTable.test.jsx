import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { BrowserRouter, data } from "react-router-dom";
import { test, expect, vi } from "vitest";
import axios from "axios";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import { AuthProvider, useAuth } from "../../../context/Auth.Context";
import { VehicleTable } from "../../../Components/Vehicle/VehicleTable/VehicleTable";

const fireMock = vi.fn(() => Promise.resolve({ isConfirmed: true }));

vi.mock("axios");

//mock sweet alert
vi.mock("sweetalert2", () => {
  return {
    __esModule: true,
    default: {
      mixin: vi.fn(() => ({
        fire: fireMock,
      })),
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
    },
  };
});

// Mock de AuthContext
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
    loading: false
  });
});


//mock DesktopContext
vi.mock("../../../context/Desktop.Context", () => ({
  DesktopProvider: ({ children }) => children,
  useDesktop: vi.fn().mockReturnValue({ isDesktop: true })
}));

beforeEach(() =>{
  useDesktop.mockReturnValue({
    isDesktop: true
  })
})


// reseta los mocks luego de cada test
afterEach(() => {
  vi.restoreAllMocks();
});
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
const mockToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sIm5hbWUiOiJhZG1pbiBhZG1pbiIsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc0MDk2NjgxNywiZXhwIjoxNzQxMDAyODE3fQ.VZLsBi4H5Dln2uvZ_nItH2MGb6Q8JFiDjDhYwOUJ628";

test("Deberia mostrar vehiculos en una lista", async () => {
  axios.get.mockResolvedValueOnce({ data: vehiculos });
  render(
    <BrowserRouter>
      <AuthProvider>
        <DesktopProvider>
          <VehicleTable />
        </DesktopProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    expect(screen.getByText(/Honda Civic/i)).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByRole("cell", { name: /1/i })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /Toyota Corolla/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /2/i })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /Honda Civic/i })
    ).toBeInTheDocument();
  });
});

test("Si el contenido protegido se accede desde mobile debería mostrar un mensaje 'contenido solo disponible en dispositivos de escritorio'", async () => {
  axios.get.mockResolvedValueOnce({ data: vehiculos });

  render(
    <BrowserRouter>
      <VehicleTable />
    </BrowserRouter>
  );

  useDesktop.mockReturnValue({
    isDesktop: false
  })

  await waitFor(() => {
    expect(
      screen.getByText(
        /contenido solo disponible en dispositivos de escritorio/i
      )
    ).toBeInTheDocument();
  });
});

test("El botón 'Eliminar' deberia permitir la eliminación de un registro", async () => {
  fireMock.mockClear();

  axios.get.mockResolvedValueOnce({ data: vehiculos });
  axios.delete.mockResolvedValueOnce();

  render(
    <BrowserRouter>
      <AuthProvider>
        <DesktopProvider>
          <VehicleTable />
        </DesktopProvider>
      </AuthProvider>
    </BrowserRouter>
  );

 

  useAuth.mockReturnValue({
    user: { roles: ["ROLE_ADMIN"] },
    isAuthenticated: true,
    token: mockToken,
    loading: false
  });

  // verifico que el vehiculo existe en la tabla
  await waitFor(() => {
    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
  });

  // identifico la celda y el boton 'eliminar'
  const rowToDelete = screen.getByRole("row", { name: /Toyota Corolla/i });
  const deleteButton = within(rowToDelete).getByRole("button", {
    name: /Eliminar/i,
  });

  // lo borro
  fireEvent.click(deleteButton);

  // se verifica que se llamo al endpoint y el vehiculo ya no existe en la tabla
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:8080/api/vehicles/1", {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        }
      }
    );
    expect(screen.queryByText(/Toyota Corolla/i)).not.toBeInTheDocument();
  });

  // se mostraron 2 modales de sweet alert: confirmar eliminacion y modal de exito
  expect(fireMock).toHaveBeenCalledTimes(2);

  // se mostró el modal de exito
  expect(fireMock).toHaveBeenNthCalledWith(2, {
    title: "Borrado",
    text: "El vehiculo ha sido borrado",
    icon: "success",
    timer: "1500",
    className: "py-1 px-2 rounded",
    showConfirmButton: false,
  });
});
