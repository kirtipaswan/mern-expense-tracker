import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Form() {
    const { register, handleSubmit, reset } = useForm();
    const [transactions, setTransactions] = useState([]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:8080/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Transaction saved successfully', result);
                fetchTransactions(); // Fetch updated list of transactions after submitting
            } else {
                console.error('Error saving transaction:', result);
            }

            reset(); // Reset the form fields
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Fetch transactions from the backend
    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Fetch transactions when the component mounts
    useEffect(() => {
        fetchTransactions();
    }, []);

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
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <div className='form max-w-sm mx-auto w-96 m-4 gap-3'>
            <h1 className='font-bold pb-4 text-xl'>Transaction</h1>

            <form id='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-4'>
                    <div className='input-group'>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            placeholder='Salary, House Rent, SIP'
                            className='form-input'
                        />
                    </div>

                    <select className='form-input' {...register('type', { required: true })}>
                        <option value="Investment">Investment</option>
                        <option value="Expense">Expense</option>
                        <option value="Savings">Savings</option>
                    </select>

                    <div className='input-group'>
                        <input
                            type="number"
                            {...register('amount', { required: true })}
                            placeholder='Amount'
                            className='form-input'
                        />
                    </div>

                    <div className='submit-btn'>
                        <button className='border py-2 text-white bg-indigo-500 w-full'>
                            Make Transaction
                        </button>
                    </div>
                </div>
            </form>

            <h2 className='font-bold pt-6 text-xl'>History</h2>
            <div className="flex flex-col py-2 gap-2">
                {transactions.map(transaction => (
                    <Transaction key={transaction._id} transaction={transaction} onDelete={deleteTransaction} />
                ))}
            </div>
        </div>
    );
}

function Transaction({ transaction, onDelete }) {
    // Determine the color based on transaction type
    const getColor = (type) => {
        switch (type) {
            case 'Investment':
                return '#FF6384'; // Red
            case 'Expense':
                return '#36A2EB'; // Blue
            case 'Savings':
                return '#FFCE56'; // Yellow
            default:
                return '#000'; // Default color
        }
    };

    return (
        <div className="item flex items-center justify-between bg-gray-50 py-2 rounded">
            <button onClick={() => onDelete(transaction._id)} aria-label={`Delete transaction ${transaction.name}`} style={{ color: getColor(transaction.type), paddingLeft: '5px' }} className="mr-2">

                <i className='bx bx-trash' style={{ fontSize: '20px' }}></i>
            </button>
            <span className='block w-full'>{transaction.name} - {transaction.type}: ${transaction.amount}</span>
        </div>
    );
}
