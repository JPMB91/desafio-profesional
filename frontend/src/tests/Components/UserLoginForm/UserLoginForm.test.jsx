import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { test, vi } from "vitest";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthContext from "../../../context/Auth.Context";
import { UserLoginForm } from "../../../Components/User/UserLoginForm/UserLoginForm";


vi.mock("axios");
vi.mock("jwt-decode");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

beforeEach(() => {
  useNavigate.mockReturnValue(mockNavigate);
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({ login: mockLogin });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("Debe permitir realizar login y redirigir a un usuario admin a /administracion", async () => {
  const mockToken = "mockToken";
  const mockDecodedToken = { roles: ["ROLE_ADMIN"] };

  axios.post.mockResolvedValue({ data: { token: mockToken } });
  jwtDecode.mockReturnValue(mockDecodedToken);

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <UserLoginForm />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Correo Electrónico"), "test@example.com");
  await user.type(screen.getByLabelText("Contraseña"), "password123");
  await user.click(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith(mockToken);
    expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    expect(mockNavigate).toHaveBeenCalledWith("/administracion");
  });
});

test("Debe mostrar un mensaje de error para credenciales inválidas", async () => {
  axios.post.mockRejectedValue({
    response: { data: { message: "Credenciales inválidas" } },
  });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <UserLoginForm />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Correo Electrónico"), "test@example.com");
  await user.type(screen.getByLabelText("Contraseña"), "wrongpassword");
  await user.click(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => {
    expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
  });
});


test("Debe redirigir a / si el rol del usuario es ROLE_USER", async () => {
  const mockToken = "mockToken";
  const mockDecodedToken = { roles: ["ROLE_USER"] };

  axios.post.mockResolvedValue({ data: { token: mockToken } });
  jwtDecode.mockReturnValue(mockDecodedToken);

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <UserLoginForm />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Correo Electrónico"), "test@example.com");
  await user.type(screen.getByLabelText("Contraseña"), "password123");
  await user.click(screen.getByRole("button", { name: /Login/i }));

  // await waitFor(() => {
  //   expect(mockNavigate).toHaveBeenCalledWith("/");
  // });
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/", {
      state: { dates: undefined, source: undefined },
    });
  });
});