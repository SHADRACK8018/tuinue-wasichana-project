import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DonorDashboard from '../DonorDashboard'; 

import * as reactRouterDom from 'react-router-dom';

// Mock react-router-dom hooks and components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' }),
    MemoryRouter: actual.MemoryRouter,
    Routes: actual.Routes,
    Route: actual.Route,
    NavLink: actual.NavLink,
  };
});

const mockCharities = [
  {
    id: 1,
    full_name: 'Hope Foundation',
    description: 'Supporting children in need.',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    full_name: 'Charity B',
    description: '',
    image: 'https://via.placeholder.com/150',
  },
];

function createMockStore() {
    return configureStore({
        reducer: {
            donor: (state = { donations: [], charities: mockCharities }) => state,
            auth: (state = { user: { id: 1, full_name: 'Test User' } }) => state,
        },
    });
}

beforeEach(() => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockCharities),
        })
    );
    localStorage.clear();
});

afterEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.clearAllMocks();
});

function renderWithProviders() {
    const store = createMockStore();

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/donor/1']}>
                <Routes>
                    <Route path="/donor/:id" element={<DonorDashboard />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
}

describe('DonorDashboard', () => {
    test('displays welcome message and navigation links', async () => {
        renderWithProviders();

        expect(await screen.findByText(/choose a charity to support/i)).toBeInTheDocument();
        expect(screen.getByText(/donation history/i)).toBeInTheDocument();
        expect(screen.getByText(/beneficiary stories/i)).toBeInTheDocument();
    });

    test('fetches and displays charity cards', async () => {
        renderWithProviders();

        expect(await screen.findByText('Hope Foundation')).toBeInTheDocument();
        expect(screen.getByText('Charity B')).toBeInTheDocument();
    });

    test('switches to favorites tab and shows empty state', async () => {
        renderWithProviders();

        await waitFor(() => screen.getByText('Hope Foundation'));

        const favTab = screen.getByRole('button', { name: /favorites/i });
        fireEvent.click(favTab);

        expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
    });

    test('adds and removes charity from favorites', async () => {
        renderWithProviders();

        await waitFor(() => expect(screen.getByText('Choose a Charity to Support')).toBeInTheDocument());

        // Adjust selector to find heart buttons with class "favorite"
        const heartButtons = await screen.findAllByRole('button');
        const firstHeartButton = heartButtons.find(button => button.classList.contains('favorite')) || heartButtons[0];

        fireEvent.click(firstHeartButton);

        // More precise way to find the Favorites tab button with waitFor and getByText
        const favTab = await screen.findByText(/favorites/i);
        fireEvent.click(favTab);

        await waitFor(() => expect(screen.getByText('Hope Foundation')).toBeInTheDocument());

        // remove from favorites
        const filledHeart = screen.getAllByRole('button').find(button => button.classList.contains('favorite')) || heartButtons[0];
        fireEvent.click(filledHeart);

        await waitFor(() => expect(screen.queryByText('Hope Foundation')).not.toBeInTheDocument());
        expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
    });

    test('shows loading state', async () => {
        renderWithProviders();
        expect(screen.getByText(/loading charities/i)).toBeInTheDocument();
        await screen.findByText('Hope Foundation');
    });

    test('shows error message on fetch failure', async () => {
        fetch.mockImplementationOnce(() => Promise.reject('API failure'));

        renderWithProviders();
        expect(await screen.findByText(/failed to load charities/i)).toBeInTheDocument();
    });
});
