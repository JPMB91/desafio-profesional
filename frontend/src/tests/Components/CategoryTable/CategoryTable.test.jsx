import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import axios from "axios";
import { BrowserRouter,  } from "react-router-dom";
import { expect, test, vi, beforeEach, afterEach, describe, it } from "vitest";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import * as AuthContext from "../../../context/Auth.Context";
import { CategoryTable } from "../../../Components/Category/CategoryTable/CategoryTable";

vi.mock("axios");
vi.mock("jwt-decode");

const fireMock = vi.fn(() => Promise.resolve({ isConfirmed: true }));

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

describe("<CategoryTable/>", () => {
  const mockCategory = [
    {
      id: 34,
      name: "Sedán",
      categoryDescription:
        "El sedán es un auto amplio de carrocería clásica de tres volúmenes separados: motor, habitáculo, y maletero, con puertas totalmente autónomas.",
      categoryImage: {
        id: 34,
        filename: "9a877950-7b61-4be2-adbf-49a5f3b993c4_sedan-category.jpg",
      },
    },
  ];

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

  beforeEach(() => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { roles: ["ROLE_ADMIN"] },
      isAuthenticated: true,
      loading: false,
      token: mockToken,
    });
  });

  const mockToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sIm5hbWUiOiJhZG1pbiBhZG1pbiIsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc0MDk2NjgxNywiZXhwIjoxNzQxMDAyODE3fQ.VZLsBi4H5Dln2uvZ_nItH2MGb6Q8JFiDjDhYwOUJ628";

  test("Debe mostrar informacion de la categoría", async () => {
    axios.get.mockReturnValue({ data: mockCategory });

    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <CategoryTable />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sedán/i)).toBeInTheDocument();
    });
  });

  test("Debe permitir borra una categoría", async () => {
    axios.get.mockReturnValue({ data: mockCategory });

    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <CategoryTable />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sedán/i)).toBeInTheDocument();
    });

    // identifico la celda y el boton 'eliminar'
    const rowToDelete = screen.getByRole("row", { name: /Sedán/i });
    const deleteButton = within(rowToDelete).getByRole("button", {
      name: /Eliminar/i,
    });

    fireEvent.click(deleteButton);

    // se verifica que se llamo al endpoint y la categoría ya no existe en la tabla
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8080/api/categories/34",
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(screen.queryByText(/Sedán/i)).not.toBeInTheDocument();
    });

    // se mostraron 2 modales de sweet alert: confirmar eliminacion
    expect(fireMock).toHaveBeenCalledTimes(2);
  });
});
