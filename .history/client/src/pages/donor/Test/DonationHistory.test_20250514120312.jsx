import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DonationHistory from "../DonationHistory";
import { vi } from "vitest";
import { Provider } from "react-redux";
import store from "../../../store.js";

const mockDonations = [
  { id: 1, amount: 50, date: "2023-01-01", charityName: "Charity A" },
  { id: 2, amount: 100, date: "2023-02-01", charityName: "Charity B" },
];

describe("DonationHistory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDonations),
      })
    );
  });

  test("renders loading state initially", () => {
    render(
      <Provider store={store}>
        <DonationHistory />
      </Provider>
    );
    expect(screen.getByText(/loading donation history/i)).toBeInTheDocument();
  });

  test("renders donation history list", async () => {
    render(
      <Provider store={store}>
        <DonationHistory />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/loading donation history/i)
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/charity a/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/charity b/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
  });

  test("renders message when no donations", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
    render(
      <Provider store={store}>
        <DonationHistory />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/loading donation history/i)
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/no donations found/i)).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Fetch failed")));
    render(
      <Provider store={store}>
        <DonationHistory />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/loading donation history/i)
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(/failed to load donation history/i)
    ).toBeInTheDocument();
  });
});
