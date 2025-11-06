import axios, { AxiosInstance } from 'axios';
import { Transaction } from '../types/Transaction';

const apiClient: AxiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data ?? error.message)
);

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const data = await apiClient.get<Transaction[]>('/transactions');
    return data;
};

export default apiClient;