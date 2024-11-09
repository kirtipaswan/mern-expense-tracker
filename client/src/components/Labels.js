import React, { useEffect, useState } from 'react';
import { getLabels } from '../helper/helper';

// Define the same color mapping for the labels
const typeColors = {
    Investment: '#FF6384', // Red
    Expense: '#36A2EB', // Blue
    Savings: '#FFCE56' // Yellow
};

export default function Labels() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/transactions');
            if (!response.ok) throw new Error('Error fetching transactions');
            const transactionsData = await response.json();
            setTransactions(transactionsData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) return <div>Fetching...</div>;
    if (error) return <div>Error: {error}</div>;

    // Use the helper function to get label data based on transactions
    const labelsData = getLabels(transactions);

    if (labelsData.length === 0) {
        return <div>No labels available</div>;
    }

    return (
        <>
            {labelsData.map((label, index) => (
                <LabelComponent key={index} data={label} />
            ))}
        </>
    );
}

function LabelComponent({ data }) {
    if (!data) return null;

    // Assign color based on the transaction type using the typeColors map
    const color = typeColors[data.type] || '#f9c74f'; // Fallback to yellow if type not found

    return (
        <div className="labels flex justify-between">
            <div className="flex gap-2 items-center">
                {/* Change dimensions and add border-radius for rounder corners */}
                <div 
                    className='w-1 h-6' 
                    style={{ 
                        background: color, 
                        borderRadius: '5px' // Add border-radius for rounder corners
                    }} 
                />
                <h3 className='text-md'>{data.type ?? 'Unknown'}</h3>
            </div>
            <h3 className='font-bold'>{Math.round(data.percent)}%</h3>
        </div>
    );
}
