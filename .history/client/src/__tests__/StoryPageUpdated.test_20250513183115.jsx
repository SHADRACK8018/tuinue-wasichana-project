import { render, screen, waitFor } from "@testing-library/react";
import StoryPage from "../pages/public/StoryPage.jsx";
import { test, expect, describe, vi } from "vitest";
import { act } from "react-dom/test-utils";

describe("StoryPage component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: "Charity Story 1" },
            { id: 2, title: "Charity Story 2" },
          ]),
      })
    );
  });

  test("renders the girl empowerment stories section", async () => {
    await act(async () => {
      render(<StoryPage />);
    });

    await waitFor(() => {
      const heading = screen.getByText(/charity stories/i);
      expect(heading).toBeInTheDocument();
    });
  });

  test("renders list of stories", async () => {
    await act(async () => {
      render(<StoryPage />);
    });

    await waitFor(() => {
      const story1 = screen.getByText(/charity story 1/i);
      const story2 = screen.getByText(/charity story 2/i);
      expect(story1).toBeInTheDocument();
      expect(story2).toBeInTheDocument();
    });
  });

  test("renders empty state when no stories", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => {
      render(<StoryPage />);
    });

    await waitFor(() => {
      const emptyMessage = screen.getByText((content) =>
        /no stories have been posted for this charity yet/i.test(content)
      );
      expect(emptyMessage).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    global.fetch = vi.fn(() => Promise.reject("API is down"));

    await act(async () => {
      render(<StoryPage />);
    });

    await waitFor(() => {
      const errorMessage = screen.getByText((content) =>
        /no stories have been posted for this charity yet/i.test(content)
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
