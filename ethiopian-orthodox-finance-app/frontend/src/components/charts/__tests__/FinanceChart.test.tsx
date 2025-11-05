import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FinanceChart from '../FinanceChart';

type MockFinanceRecord = { date: string; amount: number };

const lineSpy = vi.fn();

vi.mock('react-chartjs-2', () => ({
    Line: (props: { data: unknown }) => {
        lineSpy(props);
        return <div data-testid="line-chart" />;
    },
}));

let mockState: { finance?: { data?: MockFinanceRecord[] | undefined } } = {
    finance: { data: [] },
};

vi.mock('react-redux', () => ({
    useSelector: (selector: (state: typeof mockState) => unknown) =>
        selector(mockState),
}));

const baseTranslations: Record<string, string> = {
    'financeChart.title': 'Vue financière',
    'financeChart.label': 'Montant (EUR)',
};
let currentTranslations = { ...baseTranslations };

vi.mock('../../../hooks/useLocalization', () => ({
    useLocalization: () => ({
        t: (key: string) => currentTranslations[key] ?? key,
    }),
}));

describe('FinanceChart', () => {
    beforeEach(() => {
        lineSpy.mockClear();
        mockState = { finance: { data: [] } };
        currentTranslations = { ...baseTranslations };
    });

    const renderComponent = () => render(<FinanceChart />);
    const getLastChartProps = () =>
        lineSpy.mock.calls[lineSpy.mock.calls.length - 1]?.[0] as
            | {
                  data: {
                      labels: string[];
                      datasets: Array<{
                          data: number[];
                          label: string;
                          borderColor: string;
                          backgroundColor: string;
                          fill: boolean;
                      }>;
                  };
              }
            | undefined;

    test('renders the translated chart title', () => {
        mockState = {
            finance: {
                data: [
                    { date: '2024-01-01', amount: 1200 },
                    { date: '2024-02-01', amount: 980 },
                ],
            },
        };

        renderComponent();

        const heading = screen.getByRole('heading', {
            level: 2,
            name: baseTranslations['financeChart.title'],
        });
        expect(heading).toBeDefined();
    });

    test('passes finance data to the Line chart', () => {
        const sampleData: MockFinanceRecord[] = [
            { date: '2024-03-01', amount: 1500 },
            { date: '2024-04-01', amount: 1325 },
        ];
        mockState = { finance: { data: sampleData } };

        renderComponent();

        expect(lineSpy).toHaveBeenCalled();
        const props = getLastChartProps();
        expect(props).toBeDefined();

        const { labels, datasets } = props!.data;
        expect(labels).toEqual(sampleData.map((item) => item.date));
        expect(datasets[0].label).toBe(baseTranslations['financeChart.label']);
        expect(datasets[0].data).toEqual(
            sampleData.map((item) => item.amount)
        );
    });

    test('handles empty finance data without errors', () => {
        mockState = { finance: { data: undefined } };

        renderComponent();

        expect(lineSpy).toHaveBeenCalled();
        const props = getLastChartProps();
        expect(props).toBeDefined();

        const { labels, datasets } = props!.data;
        expect(labels).toEqual([]);
        expect(datasets[0].data).toEqual([]);
    });

    test('applies themed styling to the primary dataset', () => {
        mockState = {
            finance: {
                data: [
                    { date: '2024-05-01', amount: 500 },
                    { date: '2024-06-01', amount: 750 },
                ],
            },
        };

        renderComponent();

        const props = getLastChartProps();
        expect(props).toBeDefined();

        const dataset = props!.data.datasets[0];
        expect(dataset.borderColor).toBe('rgba(75,192,192,1)');
        expect(dataset.backgroundColor).toBe('rgba(75,192,192,0.2)');
        expect(dataset.fill).toBe(true);
    });

    test('falls back to translation keys when no localization is provided', () => {
        currentTranslations = {};
        mockState = { finance: { data: [] } };

        renderComponent();

        const heading = screen.getByRole('heading', {
            level: 2,
            name: 'financeChart.title',
        });
        expect(heading).toBeDefined();

        const props = getLastChartProps();
        expect(props).toBeDefined();
        expect(props!.data.datasets[0].label).toBe('financeChart.label');
    });
});