import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";

describe("Navbar component", () => {
  test("renders without crashing", () => {
    render(<Navbar />);
    const navbarElement = screen.getByTestId("navbar");
    expect(navbarElement).toBeInTheDocument();
  });
});
