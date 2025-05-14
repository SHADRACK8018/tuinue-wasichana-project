import React from "react";
import { render, screen } from "@testing-library/react";
import DonorSideBar from "../pages/donor/DonorSideBar";

describe("DonorSideBar Component", () => {
  test("renders without crashing", () => {
    render(<DonorSideBar />);
    // Add more specific tests here as needed
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
