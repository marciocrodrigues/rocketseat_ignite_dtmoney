import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string
}

interface TransactionProviderProps {
    children: ReactNode
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>
}

// interface TransactionInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// } -> criar uma interface

// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>; -> cria um tipo selecionando os campos de uma interface

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'> // cria um tipo apartir de uma interface excluindo campos selecionados

const TransactionContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('/transactions')
            .then(res => setTransactions(res.data.transactions));
    }, [])

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        });
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction
        ]);
    }

    return (
        <TransactionContext.Provider value={{ transactions, createTransaction }}>
            { children }
        </TransactionContext.Provider>
    )

}

export function useTransactions() {
    const context = useContext(TransactionContext);

    return context;
}