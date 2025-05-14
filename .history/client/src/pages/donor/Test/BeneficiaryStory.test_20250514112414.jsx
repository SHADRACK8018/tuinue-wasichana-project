import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { vi } from "vitest";
import BeneficiaryStory from "../BeneficiaryStory"; // Adjust path as needed
import * as ReactRouterDom from "react-router-dom";

// Sample mock data
const mockDonations = [{ charity_id: 1 }, { charity_id: 2 }];

const mockCharities = {
  1: {
    id: 1,
    name: "Charity A",
    description: "Charity A helps girls access education.",
  },
  2: {
    id: 2,
    name: "Charity B",
    description: "Charity B provides scholarships to girls.",
  },
};

const mockStories = {
  1: [
    {
      id: 101,
      title: "Story One",
      content:
        "This is the full content of the first story. It contains more details.",
      beneficiary_name: "Beneficiary One",
      image_url: "/images/story1.jpg",
    },
  ],
  2: [
    {
      id: 201,
      title: "Story Two",
      content:
        "This is the full content of the second story. It contains more details.",
      beneficiary_name: "Beneficiary Two",
      image_url: "/images/story2.jpg",
    },
  ],
};

// Setup mock for global fetch with conditional responses
const setupFetchMock = () => {
  global.fetch = vi.fn((url) => {
    if (url.includes("/donors/")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDonations),
      });
    }
    if (url.includes("/charities/")) {
      const charityId = Number(url.split("/").pop());
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharities[charityId]),
      });
    }
    if (url.includes("/charity/") && url.includes("/stories")) {
      const charityId = Number(url.split("/")[2]);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStories[charityId] || []),
      });
    }
    return Promise.reject(new Error("Unknown URL"));
  });
};

describe("BeneficiaryStory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage donorId for component fetch calls
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "1"),
        setItem: vi.fn(() => null),
        removeItem: vi.fn(() => null),
        clear: vi.fn(() => null),
      },
      writable: true,
    });
    setupFetchMock();
  });

  it("shows loading initially", () => {
    render(<BeneficiaryStory />);
    expect(screen.getByText("Loading stories...")).toBeInTheDocument();
  });

  it("renders stories and charity info correctly", async () => {
    render(<BeneficiaryStory />);

    // Wait for stories to load and check content
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    // Now we can check for specific story content
    expect(screen.getByText("Beneficiary Stories")).toBeInTheDocument();
    expect(screen.getByText("Story One")).toBeInTheDocument();
    expect(
      screen.getByText("Charity A helps girls access education.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This is the full content of the first story/)
    ).toBeInTheDocument();
  });

  it("shows message when no stories available", async () => {
    // Mock empty donations response
    global.fetch = vi.fn((url) => {
      if (url.includes("/donors/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(<BeneficiaryStory />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    // Check for no stories message
    expect(
      screen.getByText(/you haven't donated to any charities with stories yet/i)
    ).toBeInTheDocument();
  });

  it("opens and closes modal with full story", async () => {
    render(<BeneficiaryStory />);

    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    // Find and click the first view full story button
    const viewButtons = screen.getAllByRole("button", {
      name: /view full story/i,
    });
    fireEvent.click(viewButtons[0]);

    // Check that modal has opened with story details
    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText("Story One")).toBeInTheDocument();
    expect(
      within(modal).getByText(
        "This is the full content of the first story. It contains more details."
      )
    ).toBeInTheDocument();

    // Find and click close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Check modal is closed (full content no longer visible)
    await waitFor(() => {
      expect(
        screen.queryByText(
          "This is the full content of the first story. It contains more details."
        )
      ).not.toBeInTheDocument();
    });
  });

  it("toggles see more and see less in modal", async () => {
    render(<BeneficiaryStory />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByRole("button", {
      name: /view full story/i,
    });
    fireEvent.click(viewButtons[0]);

    // Find and click "See More" button
    const toggleButton = within(screen.getByRole("dialog")).getByText(
      /see more/i
    );
    fireEvent.click(toggleButton);

    // Check text has changed to "See Less"
    expect(
      within(screen.getByRole("dialog")).getByText(/see less/i)
    ).toBeInTheDocument();

    // Click "See Less" and check it changes back
    fireEvent.click(within(screen.getByRole("dialog")).getByText(/see more/i));
    expect(
      within(screen.getByRole("dialog")).getByText(/see more/i)
    ).toBeInTheDocument();
  });

  it("displays error message on fetch failure", async () => {
    // Mock a fetch error
    global.fetch = vi.fn(() => Promise.reject(new Error("Fetch failed")));

    render(<BeneficiaryStory />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/failed to load beneficiary stories/i)
    ).toBeInTheDocument();
  });

  it("handles slow network response gracefully", async () => {
    // Setup a delayed response
    global.fetch = vi.fn((url) => {
      if (url.includes("/donors/")) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockDonations),
            });
          }, 1000);
        });
      }
      if (url.includes("/charities/")) {
        const charityId = url.split("/").pop();
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCharities[charityId]),
        });
      }
      if (url.includes("/charity/") && url.includes("/stories")) {
        const charityId = url.split("/")[4];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStories[charityId] || []),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    render(<BeneficiaryStory />);

    // Check loading state is shown
    expect(screen.getByText("Loading stories...")).toBeInTheDocument();

    // Wait for content to eventually load
    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading stories...")
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify story content appears
    expect(screen.getByText("Story One")).toBeInTheDocument();
  });

  it("handles unusual data gracefully", async () => {
    // Mock malformed data response
    global.fetch = vi.fn(() => Promise.resolve({}));

    render(<BeneficiaryStory />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading stories...")).not.toBeInTheDocument();
    });

    // Should show fallback message
    expect(
      screen.getByText(/you haven't donated to any charities with stories yet/i)
    ).toBeInTheDocument();
  });
});
