import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CharityRoutes from "../routes/CharityRoutes.jsx";
import CharityDashboard from "../pages/charity/CharityDashboard";
import BeneficiariesPage from "../pages/beneficiary/Beneficiary";
import InventoryPage from "../pages/inventory/Inventory";
import StoryManagement from "../pages/charity/StoryManagement";
import CharityDetails from "../pages/charity/CharityDetails";
import { test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import store from "../store";

const renderWithRouter = (initialEntries) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <CharityRoutes />
      </MemoryRouter>
    </Provider>
  );
};

test("renders CharityDashboard at /:id", () => {
  renderWithRouter(["/123"]);
  expect(screen.getByText(/charity dashboard/i)).toBeInTheDocument();
});

test("renders BeneficiariesPage at /:id/beneficiaries", () => {
  renderWithRouter(["/123/beneficiaries"]);
  expect(screen.getByText(/beneficiaries/i)).toBeInTheDocument();
});

test("renders InventoryPage at /:id/inventory", () => {
  renderWithRouter(["/123/inventory"]);
  expect(screen.getByText(/inventory/i)).toBeInTheDocument();
});

test("renders StoryManagement at /:id/stories", () => {
  renderWithRouter(["/123/stories"]);
  expect(screen.getByText(/post a new story/i)).toBeInTheDocument();
});

const mockCharity = {
  id: 123,
  image: "/test-image.jpg",
  full_name: "Test Charity",
  description: "Test charity description",
  email: "test@example.com",
  contact: "1234567890",
  website_url: "http://testcharity.org",
};

const mockBeneficiaries = [
  { id: 1, name: "Beneficiary One" },
  { id: 2, name: "Beneficiary Two" },
];

const mockInventory = [
  { id: 1, item: "Pads", quantity: 100 },
  { id: 2, item: "Tampons", quantity: 50 },
];

const mockStories = [
  { id: 1, title: "Story One", content: "Content One" },
  { id: 2, title: "Story Two", content: "Content Two" },
];

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes("/charities/123/beneficiaries")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBeneficiaries),
      });
    }
    if (url.includes("/charities/123/inventory")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInventory),
      });
    }
    if (url.includes("/charities/123/stories")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStories),
      });
    }
    if (url.includes("/charities/123")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharity),
      });
    }
    return Promise.reject(new Error("Unknown URL"));
  });
});

import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

test("renders CharityDetails at /charity-details/:id", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("/beneficiaries")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/inventory")) {
      return Promise.resolve({ data: [] });
    }
    if (url.includes("/stories")) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: mockCharity });
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CharityDetails charity={mockCharity} />
      </MemoryRouter>
    </Provider>
  );
  const charityName = await screen.findByRole("heading", {
    name: /test charity/i,
  });
  expect(charityName).toBeInTheDocument();
});
