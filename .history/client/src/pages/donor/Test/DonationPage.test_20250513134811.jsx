import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import DonationPage from '../DonationPage';
import { renderWithPayPal } from '../../../test-utils/paypal-test-utils';

// Mock the PayPal Button component behavior
vi.mock('@paypal/react-paypal-js', async () => {
  const actual = await vi.importActual('@paypal/react-paypal-js');
  return {
    ...actual,
    PayPalButtons: ({ createOrder, onApprove, onError }) => {
      return (
        <div data-testid="paypal-button">
          <button
            data-testid="mock-paypal-submit"
            onClick={() => {
              const orderID = 'mock-order-id';
              createOrder().then((id) => {
                onApprove({ orderID });
              });
            }}
          >
            PayPal Submit
          </button>
          <button
            data-testid="mock-paypal-error"
            onClick={() => {
              onError(new Error('PayPal error'));
            }}
          >
            Trigger PayPal Error
          </button>
        </div>
      );
    },
  };
});

// Mock fetch for simulating backend responses
global.fetch = vi.fn();

describe('DonationPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('renders quick amount buttons and allows selection', async () => {
    renderWithPayPal(<DonationPage />);
    
    // Check that quick amount buttons render
    const button50 = screen.getByRole('button', { name: /\$50/i });
    expect(button50).toBeInTheDocument();
    
    // Click a button and verify it becomes selected
    fireEvent.click(button50);
    expect(button50).toHaveClass('selected'); // Adjust class name as needed
    
    // Check that PayPal button wrapper is present
    expect(screen.getByTestId('paypal-button')).toBeInTheDocument();
  });

  it('allows custom amount input and clears quick amount selection', async () => {
    renderWithPayPal(<DonationPage />);
    
    // First select a quick amount
    const button100 = screen.getByRole('button', { name: /\$100/i });
    fireEvent.click(button100);
    expect(button100).toHaveClass('selected'); // Adjust class name as needed
    
    // Then enter a custom amount
    const customInput = screen.getByLabelText(/other amount/i) || screen.getByPlaceholderText(/other amount/i);
    fireEvent.change(customInput, { target: { value: '75' } });
    
    // The quick amount button should no longer be selected
    expect(button100).not.toHaveClass('selected');
    expect(customInput.value).toBe('75');
  });

  it('toggles anonymous donation checkbox', () => {
    renderWithPayPal(<DonationPage />);
    
    const anonymousCheckbox = screen.getByLabelText(/donate anonymously/i) || 
                              screen.getByRole('checkbox', { name: /anonymous/i });
    
    // Check initial state (likely unchecked)
    expect(anonymousCheckbox.checked).toBe(false);
    
    // Toggle it on
    fireEvent.click(anonymousCheckbox);
    expect(anonymousCheckbox.checked).toBe(true);
    
    // Toggle it off
    fireEvent.click(anonymousCheckbox);
    expect(anonymousCheckbox.checked).toBe(false);
  });

  it('toggles donation type radio buttons and set reminder button alerts', () => {
    renderWithPayPal(<DonationPage />);
    
    // Find donation type radio buttons
    const oneTimeRadio = screen.getByLabelText(/one-time/i);
    const monthlyRadio = screen.getByLabelText(/monthly/i);
    
    // Check initial state (usually one-time is default)
    expect(oneTimeRadio.checked).toBe(true);
    expect(monthlyRadio.checked).toBe(false);
    
    // Toggle to monthly
    fireEvent.click(monthlyRadio);
    expect(oneTimeRadio.checked).toBe(false);
    expect(monthlyRadio.checked).toBe(true);
    
    // Test reminder button if available
    const reminderButton = screen.queryByRole('button', { name: /set reminder/i });
    if (reminderButton) {
      fireEvent.click(reminderButton);
      expect(screen.getByText(/reminder has been set/i)).toBeInTheDocument();
    }
  });

  it('displays PayPal button wrapper', () => {
    renderWithPayPal(<DonationPage />);
    expect(screen.getByTestId('paypal-button')).toBeInTheDocument();
  });

  it('handles backend donation error gracefully by simulating onApprove callback', async () => {
    // Mock a backend error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to process donation' }),
    });
    
    renderWithPayPal(<DonationPage />);
    
    // Select an amount
    const button25 = screen.getByRole('button', { name: /\$25/i });
    fireEvent.click(button25);
    
    // Trigger the PayPal button submit
    fireEvent.click(screen.getByTestId('mock-paypal-submit'));
    
    // Verify that an error message appears
    await waitFor(() => {
      expect(screen.getByText(/failed to process donation/i)).toBeInTheDocument();
    });
  });

  it('simulates successful donation alert', async () => {
    renderWithPayPal(<DonationPage />);
    
    // Select an amount and submit
    const button25 = screen.getByRole('button', { name: /\$25/i });
    fireEvent.click(button25);
    fireEvent.click(screen.getByTestId('mock-paypal-submit'));
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/donation successful/i)).toBeInTheDocument();
    });
  });

  it('simulates PayPal error alert', async () => {
    renderWithPayPal(<DonationPage />);
    
    // Trigger a PayPal error
    fireEvent.click(screen.getByTestId('mock-paypal-error'));
    
    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/payment error/i)).toBeInTheDocument();
    });
  });
});