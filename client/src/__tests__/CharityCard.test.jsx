import React from "react";
import { render, screen } from "@testing-library/react";
import CharityCard from "../pages/donor/CharityCard";

describe("CharityCard Component", () => {
  test("renders without crashing", () => {
    const charity = {
      id: 1,
      name: "Test Charity",
      description: "Test Description",
    };
    const { container } = render(<CharityCard charity={charity} />);
    console.log(container.innerHTML);
    expect(screen.getByText(/test charity/i)).toBeInTheDocument();
  });
});
