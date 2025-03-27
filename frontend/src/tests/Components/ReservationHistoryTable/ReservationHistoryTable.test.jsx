import axios from "axios";
import * as AuthContext from "../../../context/Auth.Context";
import { afterEach, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { UserReservationHistory } from "../../../Components/User/UserReservationHistory/UserReservationHistory";


vi.mock("axios");

vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
  };
});

beforeEach(() => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { sub: "user@user.com", roles: ["ROLE_USER"] },
    isAuthenticated: true,
    loading: false,
    token: "mocktoken",
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("Debe mostrar un registro de las reservaciones hechas en el historial", async () => {
  const mockReservations = [
    {
      id: "1",
      vehicleName: "Toyota Corolla",
      createdAt: "2025-03-27T12:00:00Z",
      startDate: "2025-03-28",
      endDate: "2025-03-30",
    },
  ];

  axios.get.mockResolvedValueOnce({ data: mockReservations });

  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <UserReservationHistory />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Lista de Reservas")).toBeInTheDocument();
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
  });
});
