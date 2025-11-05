import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FinanceState {
    transactions: Array<{ id: string; amount: number; description: string; date: string }>;
    totalBalance: number;
}

const initialState: FinanceState = {
    transactions: [],
    totalBalance: 0,
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        addTransaction(state, action: PayloadAction<{ id: string; amount: number; description: string; date: string }>) {
            state.transactions.push(action.payload);
            state.totalBalance += action.payload.amount;
        },
        removeTransaction(state, action: PayloadAction<string>) {
            const index = state.transactions.findIndex(transaction => transaction.id === action.payload);
            if (index !== -1) {
                state.totalBalance -= state.transactions[index].amount;
                state.transactions.splice(index, 1);
            }
        },
        setTransactions(state, action: PayloadAction<Array<{ id: string; amount: number; description: string; date: string }>>) {
            state.transactions = action.payload;
            state.totalBalance = action.payload.reduce((total, transaction) => total + transaction.amount, 0);
        },
    },
});

export const { addTransaction, removeTransaction, setTransactions } = financeSlice.actions;

export default financeSlice.reducer;