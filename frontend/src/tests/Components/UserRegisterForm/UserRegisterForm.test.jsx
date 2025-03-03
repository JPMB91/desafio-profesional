import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { test } from "vitest";
import axios from "axios";
import { AuthProvider, useAuth } from "../../../context/Auth.Context";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import { UserRegisterForm } from "../../../Components/UserRegisterForm/UserRegisterForm";

vi.mock("axios");

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
    token: mockDecodedToken,
    loading: false,
  });
});

//mock DesktopContext
vi.mock("../../../context/Desktop.Context", () => ({
  DesktopProvider: ({ children }) => children,
  useDesktop: vi.fn().mockReturnValue({ isDesktop: true }),
}));

beforeEach(() => {
  useDesktop.mockReturnValue({
    isDesktop: true,
  });
});

// reseta los mocks luego de cada test
afterEach(() => {
  vi.restoreAllMocks();
});

const userRegisterData = [
  {
    firstName: "Roberto",
    lastName: "Gonzales",
    email: "toberto@gmail.com", 
    password: "password",
    repeatPassword: "password",
  },
];


const mockDecodedToken = { roles: ["ROLE_ADMIN"] };

test("Debe mostrar mensaje de error si se intenta usar un email que ya está registrado", async () => {

  // mock de la respuesta cuando se usa un correo ya registrado
  axios.post.mockRejectedValue({
    response: {
      data: "Error: Usuario ya existe",
    },
  });

  render(
    <BrowserRouter>
      <AuthProvider>
        <DesktopProvider>
          <UserRegisterForm />
        </DesktopProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();


  await user.type(screen.getByLabelText("Nombre"), userRegisterData[0].firstName);
  await user.type(screen.getByLabelText("Apellido"), userRegisterData[0].lastName);
  await user.type(screen.getByLabelText("Correo Electrónico"), userRegisterData[0].email);
  await user.type(screen.getByLabelText("Contraseña"), userRegisterData[0].password);
  await user.type(screen.getByLabelText("Repita la contraseña"), userRegisterData[0].repeatPassword);

  const submitButton = screen.getByRole("button", { name: /Registrarse/i });
  await user.click(submitButton);


  await waitFor(() => {
    expect(
      screen.getByText(
        /Este correo electrónico ya está registrado\. Por favor, inicia sesión o utiliza otro\./i
      )
    ).toBeInTheDocument();
  });
});

test("Debe mostrar mensajes de error si no se ingresan datos", async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <DesktopProvider>
          <UserRegisterForm />
        </DesktopProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByRole("button", { name: /Registrarse/i });
  await user.click(submitButton);


  await waitFor(() => {
    expect(screen.getByText(/Debe ingresar un nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Debe ingresar un apellido/i)).toBeInTheDocument();
    expect(screen.getByText(/Debe ingresar un correo electrónico válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingrese una contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingrese nuevamente una contraseña/i)).toBeInTheDocument();
  });

});