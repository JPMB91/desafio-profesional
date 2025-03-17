import { render, screen, waitFor } from "@testing-library/react";
import * as AuthContext from "../../../context/Auth.Context";
import { BrowserRouter } from "react-router-dom";
import { ReviewAddForm } from "../../../Components/ReviewAddForm/ReviewAddForm";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vi.mock("axios");
vi.mock("jwt-decode");
const mockOnReviewAdded = vi.fn();

vi.mock("../../../context/Auth.Context", async () => {
  const actual = await vi.importActual("../../../context/Auth.Context");
  return {
    ...actual,
  };
});

beforeEach(() => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { roles: ["ROLE_USER"] },
    isAuthenticated: true,
    loading: false,
    token: "mocktoken",
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockVehicleId = "8bbfd852-a9ba-4593-87e1-16cb651c4955";

const mockUser = {
  sub: "user@user.com",
  roles: ["ROLE_USER"],
};

test("debe permitir realizar una reseña a un usuario logeado", async () => {
  const mockPost = vi.spyOn(axios, "post").mockResolvedValue({
    status: 201,
    data: {
      reviewId: 36,
      vehicleId: mockVehicleId,
      comment: "test review",
      createdAt: "2025-03-17T18:01:56.4226526",
      userName: "User User",
      score: 4,
    },
  });
  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <ReviewAddForm
          user={mockUser}
          vehicleId={mockVehicleId}
          onReviewAdded={mockOnReviewAdded}
        />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();

  const starRating = screen.getByText("Selecciona una puntuación");
  expect(starRating).toBeInTheDocument();

  const stars = screen.getAllByText(/[★☆⯪]/);
  expect(stars.length).toBe(5);

  await user.click(stars[3]);

  const commentField = screen.getByPlaceholderText(
    "Comparte tu experiencia..."
  );
  await user.type(commentField, "test comment");

  const submitButton = screen.getByRole("button", { name: /Enviar Reseña/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      "http://localhost:8080/api/reviews",
      {
        score: 4,
        comment: "test comment",
        email: mockUser.sub,
        vehicleId: mockVehicleId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mocktoken",
        },
      }
    );
  });

  expect(mockOnReviewAdded).toHaveBeenCalledTimes(1);

  const response = await mockPost.mock.results[0].value;
  expect(response.status).toBe(201);
});

test("No debe permitir crear una reseña si no se selecciona una puntuación", async () => {
  const mockPost = vi.spyOn(axios, "post").mockResolvedValue({
    status: 201,
    data: {
      reviewId: 36,
      vehicleId: mockVehicleId,
      comment: "test review",
      createdAt: "2025-03-17T18:01:56.4226526",
      userName: "User User",
      score: 4,
    },
  });
  render(
    <BrowserRouter>
      <AuthContext.AuthProvider>
        <ReviewAddForm
          user={mockUser}
          vehicleId={mockVehicleId}
          onReviewAdded={mockOnReviewAdded}
        />
      </AuthContext.AuthProvider>
    </BrowserRouter>
  );

  const user = userEvent.setup();
  const commentField = screen.getByPlaceholderText(
    "Comparte tu experiencia..."
  );
  await user.type(commentField, "test comment");

  const submitButton = screen.getByRole("button", { name: /Enviar Reseña/i });
  await user.click(submitButton);

  expect(
    screen.getByText(/La puntuación no puede quedar vacía/i)
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(mockPost).not.toHaveBeenCalled();
  });

  expect(mockOnReviewAdded).not.toHaveBeenCalled();
});
