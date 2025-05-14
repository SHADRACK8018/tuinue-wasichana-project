import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CharityRoutes from "../routes/CharityRoutes.jsx";
import { test, expect, vi } from "vitest";

vi.mock("../pages/charity/CharityDashboard", () => ({
  __esModule: true,
  default: () => <div>Charity Dashboard Content</div>,
}));
vi.mock("../pages/beneficiary/Beneficiary", () => ({
  __esModule: true,
  default: () => <div>Beneficiaries Content</div>,
}));
vi.mock("../pages/inventory/Inventory", () => ({
  __esModule: true,
  default: () => <div>Inventory Content</div>,
}));
vi.mock("../pages/charity/StoryManagement", () => ({
  __esModule: true,
  default: () => <div>Story Management Content</div>,
}));
vi.mock("../pages/charity/CharityDetails", () => ({
  __esModule: true,
  default: () => <div>Charity Details Content</div>,
}));

const renderWithRouter = (initialEntries) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CharityRoutes />
    </MemoryRouter>
  );
};

test("renders CharityDashboard and interacts correctly", async () => {
  renderWithRouter(["/123"]);
  await waitFor(() => {
    expect(screen.getByText(/charity dashboard content/i)).toBeInTheDocument();
  });
});

test("renders BeneficiariesPage and interacts correctly", async () => {
  renderWithRouter(["/123/beneficiaries"]);
  await waitFor(() => {
    expect(screen.getByText(/beneficiaries content/i)).toBeInTheDocument();
  });
});

test("renders InventoryPage and interacts correctly", async () => {
  renderWithRouter(["/123/inventory"]);
  await waitFor(() => {
    expect(screen.getByText(/inventory content/i)).toBeInTheDocument();
  });
});

test("renders StoryManagement and interacts correctly", async () => {
  renderWithRouter(["/123/stories"]);
  await waitFor(() => {
    expect(screen.getByText(/story management content/i)).toBeInTheDocument();
  });
});

test("renders CharityDetails and interacts correctly", async () => {
  renderWithRouter(["/charity-details/123"]);
  await waitFor(() => {
    expect(screen.getByText(/charity details content/i)).toBeInTheDocument();
  });
});
