import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../../context/Auth.Context";
import { ReservationCalendar } from "../../../Components/ReservationCalendar/ReservationCalendar";

vi.mock("axios");

describe("<ReservationCalendar/>", () => {
  const mockId = "123";
  const mockReservations = {
    reservedPeriods: [
      {
        startDate: "2025-03-20T00:00:00.000Z",
        endDate: "2025-03-25T00:00:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("debe mostrar información sobre fechas reservadas", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReservations });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ReservationCalendar id={mockId} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/vehicles/${mockId}/calendar`
    );

    await waitFor(() => {
      expect(
        screen.getByText("Seleccione el período que desea reservar")
      ).toBeInTheDocument();
    });
  });

  it("debe mostrar mensaje de error si falla la obtención de fechas", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error de conexion"));

    render(
      <BrowserRouter>
        <AuthProvider>
          <ReservationCalendar id={mockId} />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Información no disponible por el momento, intente mas tarde"
        )
      ).toBeInTheDocument();
    });
  });

  it("deshabilita el botón reservar si no se seleccionan fechas", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReservations });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ReservationCalendar id={mockId} />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const button = screen.getByText("Seleccione fechas");
      expect(button).toBeDisabled();
    });
  });
});
