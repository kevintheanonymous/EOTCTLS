import React from 'react';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { store } from '../state/store';

const translations: Record<string, string> = {
    'dashboard.title': 'Ethiopian Orthodox Tewahedo Church Finance Management',
    'financeChart.title': 'Finance Overview',
    'dashboard.summary': 'Summary',
    'languageSwitcher.button': 'Switch Language',
    'sidebar.ariaLabel': 'Main Navigation',
};

const mockedRouterMarkup = (
    <div className="dashboard">
        <header>
            <h1>{translations['dashboard.title']}</h1>
            <button type="button">
                {translations['languageSwitcher.button']}
            </button>
        </header>

        <section aria-labelledby="finance-overview-heading">
            <h2 id="finance-overview-heading">
                {translations['financeChart.title']}
            </h2>
            <div role="img" aria-label="finance chart placeholder" />
        </section>

        <section aria-labelledby="summary-heading">
            <h2 id="summary-heading">{translations['dashboard.summary']}</h2>
        </section>

        <nav aria-label={translations['sidebar.ariaLabel']} />
    </div>
);

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>(
        'react-router-dom'
    );

    return {
        ...actual,
        createBrowserRouter: vi.fn(() => ({})),
        RouterProvider: ({ router }: { router: unknown }) => mockedRouterMarkup,
    };
});

vi.mock('../components/charts/FinanceChart', () => ({
    default: () => <div role="img" aria-label="finance chart placeholder" />,
}));

beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
        () => ({} as CanvasRenderingContext2D)
    );
});

const renderWithProviders = () =>
    render(
        <Provider store={store}>
            <App routerOverride={{}} />
        </Provider>
    );

describe('App Component', () => {
    test('renders the application title', () => {
        renderWithProviders();
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: translations['dashboard.title'],
            })
        ).toBeDefined();
    });

    test('renders the language switcher', () => {
        renderWithProviders();
        const buttons = screen.getAllByRole('button', {
            name: translations['languageSwitcher.button'],
        });
        expect(buttons.length).toBeGreaterThan(0);
    });

    test('renders the sidebar', () => {
        renderWithProviders();
        const navigations = screen.getAllByRole('navigation');
        expect(navigations.length).toBeGreaterThan(0);
    });
});