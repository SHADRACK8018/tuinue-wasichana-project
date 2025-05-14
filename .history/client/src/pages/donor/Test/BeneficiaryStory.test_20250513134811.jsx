import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import BeneficiaryStory from '../BeneficiaryStory'; // Adjust path as needed

// Sample mock data
const mockStories = [
  {
    id: 1,
    title: 'Story One',
    summary: 'This is a summary of the first story.',
    content: 'This is the full content of the first story. It contains more details.',
    charityName: 'Charity A',
    charityDescription: 'Charity A helps girls access education.',
    imageUrl: 'https://example.com/image1.jpg',
  },
  {
    id: 2,
    title: 'Story Two',
    summary: 'This is a summary of the second story.',
    content: 'This is the full content of the second story. It contains more details.',
    charityName: 'Charity B',
    charityDescription: 'Charity B provides scholarships to girls.',
    imageUrl: 'https://example.com/image2.jpg',
  },
];

// Setup mock for global fetch
const setupFetchMock = (data, delay = 0) => {
  global.fetch = vi.fn(() => 
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve(data)
        });
      }, delay);
    })
  );
};

describe('BeneficiaryStory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful response with no delay
    setupFetchMock({ stories: mockStories });
  });

  it('shows loading initially', () => {
    render(<BeneficiaryStory />);
    expect(screen.getByText('Loading stories...')).toBeInTheDocument();
  });

  it('renders stories and charity info correctly', async () => {
    render(<BeneficiaryStory />);
    
    // Wait for stories to load and check content
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    // Now we can check for specific story content
    expect(screen.getByText('Beneficiary Stories')).toBeInTheDocument();
    expect(screen.getByText('Story One')).toBeInTheDocument();
    expect(screen.getByText('Charity A helps girls access education.')).toBeInTheDocument();
    expect(screen.getByText(/This is a summary of the first story/)).toBeInTheDocument();
  });

  it('shows message when no stories available', async () => {
    // Mock empty stories response
    setupFetchMock({ stories: [] });
    
    render(<BeneficiaryStory />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    // Check for no stories message
    expect(screen.getByText(/you haven't donated to any charities with stories yet/i)).toBeInTheDocument();
  });

  it('opens and closes modal with full story', async () => {
    render(<BeneficiaryStory />);
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    // Find and click the view full story button
    const viewButton = screen.getByRole('button', { name: /view full story/i });
    fireEvent.click(viewButton);
    
    // Check that modal has opened with story details
    expect(screen.getByText('Story One')).toBeInTheDocument();
    expect(screen.getByText('This is the full content of the first story. It contains more details.')).toBeInTheDocument();
    
    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check modal is closed (full content no longer visible)
    await waitFor(() => {
      expect(screen.queryByText('This is the full content of the first story. It contains more details.')).not.toBeInTheDocument();
    });
  });

  it('toggles see more and see less in modal', async () => {
    render(<BeneficiaryStory />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /view full story/i }));
    
    // Find and click "See More" button
    const toggleButton = screen.getByText(/see more/i);
    fireEvent.click(toggleButton);
    
    // Check text has changed to "See Less"
    expect(screen.getByText(/see less/i)).toBeInTheDocument();
    
    // Click "See Less" and check it changes back
    fireEvent.click(screen.getByText(/see less/i));
    expect(screen.getByText(/see more/i)).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    // Mock a fetch error
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch failed')));
    
    render(<BeneficiaryStory />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/failed to load beneficiary stories/i)).toBeInTheDocument();
  });

  it('handles slow network response gracefully', async () => {
    // Setup a delayed response
    setupFetchMock({ stories: mockStories }, 1000);
    
    render(<BeneficiaryStory />);
    
    // Check loading state is shown
    expect(screen.getByText('Loading stories...')).toBeInTheDocument();
    
    // Wait for content to eventually load
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Verify story content appears
    expect(screen.getByText('Story One')).toBeInTheDocument();
  });

  it('handles unusual data gracefully', async () => {
    // Mock malformed data response
    setupFetchMock({ 
      // No stories array, just an empty object
    });
    
    render(<BeneficiaryStory />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading stories...')).not.toBeInTheDocument();
    });
    
    // Should show fallback message
    expect(screen.getByText(/you haven't donated to any charities with stories yet/i)).toBeInTheDocument();
  });
});