import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTransactions } from '../services/apiClient';
import { Transaction } from '../types/Transaction';

const Transactions: React.FC = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchTransactions();
                setTransactions(data);
            } catch (err) {
                setError(t('error.fetchTransactions'));
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [t]);

    if (loading) {
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{t('transactions.title')}</h1>
            <table>
                <thead>
                    <tr>
                        <th>{t('transactions.date')}</th>
                        <th>{t('transactions.amount')}</th>
                        <th>{t('transactions.description')}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.date}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;