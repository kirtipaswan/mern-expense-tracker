import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import Labels from './Labels';
import { chart_Data, getTotal, getLabels } from '../helper/helper';

Chart.register(ArcElement);

export default function Graph() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/transactions');
            if (!response.ok) throw new Error('Error fetching transactions');
            const transactionsData = await response.json();
            console.log("Fetched Transactions:", transactionsData); // Log fetched transactions
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

    const labelsData = getLabels(transactions);
    console.log("Labels Data for Chart:", labelsData); // Log the labels data

    if (labelsData.length === 0) {
        return <div>No data available for chart</div>;
    }

    const graphData = chart_Data(labelsData);
    console.log("Graph Data Config:", graphData); // Log the chart configuration

    const totalAmount = getTotal(transactions); // Use the updated getTotal function
    console.log("Total Amount for Center Text:", totalAmount); // Log the total amount

    return (
        <div className='flex justify-content m-w-xxs mx-auto py-8'>
            <div className='item'>
                <div className='chart relative'>
                    <Doughnut {...graphData} />
                    <h3 className='mb-4 font-bold title'>Total
                        <span className='block text-3xl text-emerald-400'>${totalAmount ?? 0}</span>
                    </h3>
                </div>

                <div className='flex flex-col py-10 gap-4'>
                    <Labels />
                </div>
            </div>
        </div>
    );
}
