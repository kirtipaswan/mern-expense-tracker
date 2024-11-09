const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourLocalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to local MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB:", err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Label Schema
const labelSchema = new mongoose.Schema({
    type: { type: String, required: true },
    color: { type: String, default: '#000000' },
});

const Label = mongoose.model('Label', labelSchema);

// Route to create a new transaction
app.post('/api/transaction', async (req, res) => {
    try {
        const { name, type, amount } = req.body;
        const newTransaction = new Transaction({ name, type, amount });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: "Error saving transaction", error });
    }
});

// Route to fetch all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
});

// Route to create a new label
app.post('/api/labels', async (req, res) => {
    try {
        const { type } = req.body;
        const newLabel = new Label({ type });
        const savedLabel = await newLabel.save();
        res.status(201).json(savedLabel);
    } catch (error) {
        res.status(400).json({ message: "Error creating label", error });
    }
});


// Fetch labels
// Fetch labels from Label collection
app.get('/api/labels', async (req, res) => {
    try {
        const labels = await Label.find(); // Fetch labels from Label collection
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching labels", error });
    }
});

// Route to delete a transaction by ID
app.delete('/api/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});