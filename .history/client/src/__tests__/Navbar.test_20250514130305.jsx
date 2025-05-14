import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";

describe("Navbar component", () => {
  test("renders without crashing", () => {
    render(<Navbar />);
    const headingElement = screen.getByText(/Tuinue Wasichana/i);
    expect(headingElement).toBeInTheDocument();
  });
});
