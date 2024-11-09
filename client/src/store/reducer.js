import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories : [],
    transaction: []
}

export const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers : {
        getTransactions: (state) => {
                // This reducer can be responsible for updating state after fetching transactions from MongoDB
                // You can dispatch this when you get data from MongoDB
        }
    }
})

export const { getTransactions } = expenseSlice.actions; 
export default expenseSlice.reducer;
