import { BrowserRouter, useNavigate } from "react-router-dom";
import * as AuthContext from "../../../context/Auth.Context";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import { UserTable } from "../../../Components/UserTable/UserTable";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { test } from "vitest";

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

// mock sweet alert
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
  // resetea mocks
  mockNavigate.mockClear();
  mockLogin.mockClear();

  // prepara mock de desktop
  useDesktop.mockReturnValue({
    isDesktop: true,
  });

  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { roles: ["ROLE_ADMIN"] },
    isAuthenticated: true,
    loading: false,
    login: mockLogin,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const userData = [
  {
    id: "31d30df6-74d5-408c-bc43-8kkd8d2",
    firstName: "Pedro",
    lastName: "Perez",
    email: "pedro@perez.com",
    roles: [
      {
        id: 2,
        name: "ROLE_USER",
        description: "Usuario registrado",
      },
    ],
  },
];

test("Debe permitir cambiar el tipo de rol de un usuario", async () => {
  axios.get.mockResolvedValueOnce({ data: userData });
  axios.put.mockResolvedValueOnce({
    data: {
      ...userData[0],
      roles: [{ id: 1, name: "ROLE_ADMIN", description: "Usuario registrado con permisos administrativos" }],
    },
  });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <DesktopProvider>
          <UserTable />
        </DesktopProvider>
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();

  await waitFor(() => {
    const updateUserRoleButton = screen.getByRole("button", {
      name: /Actualizar Permisos/i,
    });
    expect(updateUserRoleButton).toBeInTheDocument();
  });

  const updateUserRoleButton = screen.getByRole("button", {
    name: /Actualizar Permisos/i,
  });
  await user.click(updateUserRoleButton);

  await waitFor(() => {
    expect(screen.getByText(/ROLE_ADMIN/i)).toBeInTheDocument();
  });
});