import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { AuthProvider, useAuth } from "../../../context/Auth.Context";
import { DesktopProvider, useDesktop } from "../../../context/Desktop.Context";
import { UserRegisterForm } from "../../../Components/User/UserRegisterForm/UserRegisterForm";

vi.mock("axios");

// mock de navigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock("../../../context/Desktop.Context", () => ({
  DesktopProvider: ({ children }) => children,
  useDesktop: vi.fn().mockReturnValue({ isDesktop: true }),
}));


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

test("Debe mostrar mensaje de error si se intenta usar un email que ya está registrado", async () => {
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

test("Debe mostrar informacion si se registra usuario exitosamente y se envian los datos correctos", async () => {
  const mockPost = vi.spyOn(axios, "post").mockResolvedValue({
    status: 201,
    data: {
      id: "914f87ee-b3e9-49d5-bb29-f43cbc9961ae",
      firstName: "Roberto",
      lastName: "Gonzales",
      email: "toberto@gmail.com",
      roles: [{ id: 1, name: "ROLE_USER", description: "Usuario registrado normalmente" }],
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

  
  await waitFor(async () => {
    expect(mockPost).toHaveBeenCalled();
    const response = await mockPost.mock.results[0].value;
    expect(response.status).toBe(201);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
