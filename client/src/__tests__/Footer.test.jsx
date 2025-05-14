import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer component", () => {
  test("renders without crashing", () => {
    render(<Footer />);
    const headingElement = screen.getByText(/Connect With Us/i);
    expect(headingElement).toBeInTheDocument();
  });
});
