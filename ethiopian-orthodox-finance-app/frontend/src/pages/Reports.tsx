import React from 'react';
import { useTranslation } from 'react-i18next';

const Reports: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('reports.title')}</h1>
            <p>{t('reports.description')}</p>
            {/* Additional report components can be added here */}
        </div>
    );
};

export default Reports;