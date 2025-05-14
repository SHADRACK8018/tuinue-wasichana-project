vi.mock("../pages/public/HomePage", () => ({
  __esModule: true,
  default: () => <div>Home Page Content</div>,
}));
vi.mock("../pages/charity/CharityDashboard", () => ({
  __esModule: true,
  default: () => <div>Charity Dashboard Content</div>,
}));
vi.mock("../pages/public/AboutPage", () => ({
  __esModule: true,
  default: () => <div>About Page Content</div>,
}));
vi.mock("../pages/public/CharityListingPage", () => ({
  __esModule: true,
  default: () => <div>Charity Listing Page Content</div>,
}));
vi.mock("../pages/public/CharityDetails", () => ({
  __esModule: true,
  default: () => <div>Charity Details Content</div>,
}));
vi.mock("../pages/public/DonationPage", () => ({
  __esModule: true,
  default: () => <div>Donation Page Content</div>,
}));
vi.mock("../components/auth/LoginForm", () => ({
  __esModule: true,
  default: () => <div>Login Form Content</div>,
}));
vi.mock("../components/auth/RegistrationChoice", () => ({
  __esModule: true,
  default: () => <div>Registration Choice Content</div>,
}));
vi.mock("../components/auth/CharityRegistration", () => ({
  __esModule: true,
  default: () => <div>Charity Registration Content</div>,
}));
vi.mock("../components/auth/DonorRegistration", () => ({
  __esModule: true,
  default: () => <div>Donor Registration Content</div>,
}));
vi.mock("../components/auth/ResetPassword", () => ({
  __esModule: true,
  default: () => <div>Reset Password Content</div>,
}));
vi.mock("../pages/public/StoryPage", () => ({
  __esModule: true,
  default: () => <div>Story Page Content</div>,
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicRoutes from "../routes/PublicRoutes.jsx";
import { test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import store from "../store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const renderWithRouter = (initialEntries) => {
  return render(
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": "test" }}>
        <MemoryRouter initialEntries={initialEntries}>
          <PublicRoutes />
        </MemoryRouter>
      </PayPalScriptProvider>
    </Provider>
  );
};

test("renders HomePage and interacts correctly", async () => {
  renderWithRouter(["/"]);
  await waitFor(() => {
    expect(screen.getByText(/home page content/i)).toBeInTheDocument();
  });
});

test("renders CharityDashboard and interacts correctly", async () => {
  renderWithRouter(["/charitydashboard"]);
  await waitFor(() => {
    expect(screen.getByText(/charity dashboard content/i)).toBeInTheDocument();
  });
});

test("renders AboutPage and interacts correctly", async () => {
  renderWithRouter(["/about"]);
  await waitFor(() => {
    expect(screen.getByText(/about page content/i)).toBeInTheDocument();
  });
});

test("renders CharityListingPage and interacts correctly", async () => {
  renderWithRouter(["/charities"]);
  await waitFor(() => {
    expect(
      screen.getByText(/charity listing page content/i)
    ).toBeInTheDocument();
  });
});

test("renders CharityDetails and interacts correctly", async () => {
  renderWithRouter(["/charity-details/1/"]);
  await waitFor(() => {
    expect(screen.getByText(/charity details content/i)).toBeInTheDocument();
  });
});

test("renders DonationPage and interacts correctly", async () => {
  renderWithRouter(["/donate"]);
  await waitFor(() => {
    expect(screen.getByText(/donation page content/i)).toBeInTheDocument();
  });
});

test("renders LoginForm and interacts correctly", async () => {
  renderWithRouter(["/login"]);
  await waitFor(() => {
    expect(screen.getByText(/login form content/i)).toBeInTheDocument();
  });
});

test("renders RegistrationChoice and interacts correctly", async () => {
  renderWithRouter(["/register"]);
  await waitFor(() => {
    expect(
      screen.getByText(/registration choice content/i)
    ).toBeInTheDocument();
  });
});

test("renders CharityRegistration and interacts correctly", async () => {
  renderWithRouter(["/register/charity/testUserType"]);
  await waitFor(() => {
    expect(
      screen.getByText(/charity registration content/i)
    ).toBeInTheDocument();
  });
});

test("renders DonorRegistration and interacts correctly", async () => {
  renderWithRouter(["/register/donor/testUserType"]);
  await waitFor(() => {
    expect(screen.getByText(/donor registration content/i)).toBeInTheDocument();
  });
});

test("renders ResetPassword and interacts correctly", async () => {
  renderWithRouter(["/reset-password"]);
  await waitFor(() => {
    expect(screen.getByText(/reset password content/i)).toBeInTheDocument();
  });
});

test("renders StoryPage and interacts correctly", async () => {
  renderWithRouter(["/charities/1/stories"]);
  await waitFor(() => {
    expect(screen.getByText(/story page content/i)).toBeInTheDocument();
  });
});
