import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DonorRegistrationPage from "../DonorRegistrationPage";
import { vi } from "vitest";

describe("DonorRegistrationPage Component", () => {
  test("renders without crashing", () => {
    render(<DonorRegistrationPage />);
    // Add more specific tests here as needed
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders registration form fields", () => {
    render(<DonorRegistrationPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submission", async () => {
    render(<DonorRegistrationPage />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("submits form successfully with valid data", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    render(<DonorRegistrationPage onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("shows error message on submission failure", async () => {
    const mockSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Registration failed"));
    render(<DonorRegistrationPage onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
