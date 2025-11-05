import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useLocalization } from '../../hooks/useLocalization';

type FinanceDataPoint = {
    date: string;
    amount: number;
};

const EMPTY_FINANCE_DATA: readonly FinanceDataPoint[] = [];

const selectFinanceData = (financeState: RootState['finance'] | undefined): readonly FinanceDataPoint[] => {
    if (Array.isArray(financeState)) {
        return financeState;
    }

    if (financeState && typeof financeState === 'object') {
        const data = (financeState as { data?: unknown }).data;
        if (Array.isArray(data)) {
            return data as FinanceDataPoint[];
        }
    }

    return EMPTY_FINANCE_DATA;
};

const FinanceChart: React.FC = () => {
    const { t } = useLocalization();
    const financeData = useSelector((state: RootState) => selectFinanceData(state.finance));

    const chartData = useMemo(
        () => ({
            labels: financeData.map((item) => item.date),
            datasets: [
                {
                    label: t('financeChart.label'),
                    data: financeData.map((item) => item.amount),
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: true,
                },
            ],
        }),
        [financeData, t]
    );

    return (
        <div>
            <h2>{t('financeChart.title')}</h2>
            <Line data={chartData} />
        </div>
    );
};

export default FinanceChart;
