import React from "react";
import { render, screen } from "@testing-library/react";
import DonorRegistrationPage from "../DonorRegistrationPage";

describe("DonorRegistrationPage Component", () => {
  test("renders without crashing", () => {
    render(<DonorRegistrationPage />);
    // Add more specific tests here as needed
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
