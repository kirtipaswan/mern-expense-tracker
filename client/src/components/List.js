import React, { useEffect, useState } from 'react';

export default function List() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/transactions');
            if (!response.ok) throw new Error('Error fetching transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/transaction/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error deleting transaction');
            fetchTransactions(); // Refresh the list after deletion
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) return <div>Fetching...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col py-6 gap-3">
            <h1 className='py-4 font-bold text-xl'>History</h1>
            {transactions.map(transaction => (
                <Transaction key={transaction._id} transaction={transaction} onDelete={deleteTransaction} />
            ))}
        </div>
    );
}

function Transaction({ transaction, onDelete }) {
    console.log(transaction); // Add this line to check transaction data
    return (
        <div className="item flex justify-between bg-gray-50 py-2 rounded">
            <span className='block w-full'>{transaction.name} - {transaction.type}: ${transaction.amount}</span>
            <button 
                onClick={() => onDelete(transaction._id)} 
                aria-label={`Delete transaction ${transaction.name}`}
                className="text-red-500 hover:text-red-700"
            >
                <box-icon name="trash" color="#e5e5e5" size="15px" />
            </button>
        </div>
    );
}
