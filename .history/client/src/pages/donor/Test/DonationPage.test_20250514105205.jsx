import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DonationPage from "../DonationPage";
import { vi } from "vitest";

describe("DonationPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders donation form fields", () => {
    render(<DonationPage />);
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/charity/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /donate/i })).toBeInTheDocument();
  });

  test("shows validation errors on empty submission", async () => {
    render(<DonationPage />);
    fireEvent.click(screen.getByRole("button", { name: /donate/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/charity is required/i)).toBeInTheDocument();
    });
  });

  test("submits form successfully with valid data", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    render(<DonationPage onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/charity/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /donate/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        amount: "50",
        charity: "1",
      });
    });
  });

  test("shows error message on submission failure", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("Donation failed"));
    render(<DonationPage onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/charity/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /donate/i }));

    await waitFor(() => {
      expect(screen.getByText(/donation failed/i)).toBeInTheDocument();
    });
  });
});
