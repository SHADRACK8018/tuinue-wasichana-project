import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import DeleteCharity from "../pages/admin/DeleteCharity";

vi.mock("axios");

describe("DeleteCharity Component", () => {
  const charitiesMock = [
    { id: 1, name: "Charity One", description: "Description One" },
    { id: 2, name: "Charity Two", description: "Description Two" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: charitiesMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    axios.get.mockReturnValue(new Promise(() => {})); // never resolves
    render(<DeleteCharity />);
    expect(screen.getByText(/loading charities/i)).toBeInTheDocument();
  });

  test("renders charities after fetch", async () => {
    render(<DeleteCharity />);
    await waitFor(() => {
      expect(screen.getByText("Charity One")).toBeInTheDocument();
      expect(screen.getByText("Charity Two")).toBeInTheDocument();
    });
  });

  test("shows error message on fetch failure", async () => {
    axios.get.mockRejectedValue(new Error("Fetch error"));
    render(<DeleteCharity />);
    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch charities/i)
      ).toBeInTheDocument();
    });
  });

  test("opens and closes delete modal", async () => {
    render(<DeleteCharity />);
    await waitFor(() => screen.getByText("Charity One"));
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    expect(
      screen.getByText(/are you sure you want to delete this charity/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(
      screen.queryByText(/are you sure you want to delete this charity/i)
    ).not.toBeInTheDocument();
  });
});
