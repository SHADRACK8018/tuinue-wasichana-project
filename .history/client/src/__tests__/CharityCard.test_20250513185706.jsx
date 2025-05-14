import React from "react";
import { render, screen } from "@testing-library/react";
import CharityCard from "../components/CharityCard";

describe("CharityCard Component", () => {
  test("renders without crashing", () => {
    const charity = {
      id: 1,
      name: "Test Charity",
      description: "Test Description",
    };
    render(<CharityCard charity={charity} />);
    expect(screen.getByText(/test charity/i)).toBeInTheDocument();
  });
});
