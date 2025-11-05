import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../../hooks/useLocalization';

const Sidebar: React.FC = () => {
    const { t } = useLocalization();

    return (
        <aside className="sidebar">
            <h2>{t('sidebar.title')}</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard">{t('sidebar.dashboard')}</Link>
                    </li>
                    <li>
                        <Link to="/transactions">{t('sidebar.transactions')}</Link>
                    </li>
                    <li>
                        <Link to="/reports">{t('sidebar.reports')}</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;