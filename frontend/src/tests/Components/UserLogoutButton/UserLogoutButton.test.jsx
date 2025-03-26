import { BrowserRouter, useNavigate } from "react-router-dom";
import * as AuthContext from "../../../context/Auth.Context";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../../../Components/UI/Header/Header";
import { AdminPanel } from "../../../Components/Admin/AdminPanel/AdminPanel";


vi.mock("axios");
vi.mock("jwt-decode");

// mock navigate
const mockNavigate = vi.fn();

// mock de login
const mockLogin = vi.fn();

// mock react router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// mock Auth.Context
vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
  };
});

// mock Desktop context
vi.mock("../../../context/Desktop.Context", () => ({
  DesktopProvider: ({ children }) => children,
  useDesktop: vi.fn().mockReturnValue({ isDesktop: true }),
}));

beforeEach(() => {
  // resetea mocks
  mockNavigate.mockClear();
  mockLogin.mockClear();

  // prepara mock de desktop
  useDesktop.mockReturnValue({
    isDesktop: true,
  });

  // prepara mock de auth
  const mockLogout = vi.fn().mockImplementation(() => {
    mockNavigate("/unauthorized");
  });

  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { roles: ["ROLE_ADMIN"] },
    isAuthenticated: true,
    loading: false,
    login: mockLogin,
    logout: mockLogout,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Admin Logout Functionality", () => {
  test("Un usuario con ROLE_ADMIN que hace logout desde /administracion debe ser redirigido a /unauthorized", async () => {
    window.history.pushState({}, "Admin Page", "/administracion");

    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <Header />
            <AdminPanel />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    const user = userEvent.setup();

    const logoutButton = screen.getByRole("button", { name: /Salir/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/unauthorized");
    });
  });

  test("El componente Header muestra el botón de logout cuando el usuario está autenticado", () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <Header />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /Salir/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test("El componente Header no muestra el botón de logout cuando el usuario no está autenticado", () => {
    // esta vez no está authenticado
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <DesktopProvider>
            <Header />
          </DesktopProvider>
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    // el botón de cerrar sesion no está presente
    const logoutButton = screen.queryByRole("button", {
      name: /Cerrar sesión/i,
    });
    expect(logoutButton).not.toBeInTheDocument();

    const createAccountButton = screen.getByRole("button", {
      name: /Crear Cuenta/i,
    });
    const loginButton = screen.getByRole("button", { name: /Iniciar sesión/i });
    expect(createAccountButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
