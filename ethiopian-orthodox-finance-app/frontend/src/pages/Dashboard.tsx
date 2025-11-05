import React from 'react';
import { useTranslation } from 'react-i18next';
import FinanceChart from '../components/charts/FinanceChart';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const financeData = useSelector((state: RootState) => state.finance.data);

    return (
        <div className="dashboard">
            <h1>{t('dashboard.title')}</h1>
            <FinanceChart data={financeData} />
            <div className="summary">
                <h2>{t('dashboard.summary')}</h2>
                {/* Additional summary components can be added here */}
            </div>
        </div>
    );
};

export default Dashboard;