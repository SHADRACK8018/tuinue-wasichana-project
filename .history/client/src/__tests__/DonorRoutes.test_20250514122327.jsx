import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DonorRoutes from "../routes/DonorRoutes.jsx";
import { test, expect } from "vitest";
import { Provider } from "react-redux";
import store from "../store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const renderWithRouter = (initialEntries) => {
  return render(
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": "test" }}>
        <MemoryRouter initialEntries={initialEntries}>
          <DonorRoutes />
        </MemoryRouter>
      </PayPalScriptProvider>
    </Provider>
  );
};

test("renders DonorDashboard at /:id", async () => {
  renderWithRouter(["/123"]);
  expect(
    await screen.findByText(/choose a charity to support/i)
  ).toBeInTheDocument();
});

test("renders DonationPage at /:donorId/donate/:charityId", async () => {
  renderWithRouter(["/123/donate/456"]);
  expect(await screen.findByText(/make a donation/i)).toBeInTheDocument();
});

test("renders DonationHistory at /:id/donation-history", async () => {
  renderWithRouter(["/123/donation-history"]);
  expect(await screen.findByText(/donation history/i)).toBeInTheDocument();
});

test("renders BeneficiaryStory at /:id/beneficiary-stories", async () => {
  renderWithRouter(["/123/beneficiary-stories"]);
  expect(await screen.findByText(/beneficiary stories/i)).toBeInTheDocument();
});
