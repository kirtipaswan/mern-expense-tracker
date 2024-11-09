// controller.js
const model = require('../models/model');

// GET: http://localhost:8080/api/transaction-summary
async function getTransactionSummary(req, res) {
    try {
        const summary = await model.Transaction.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                }
            }
        ]);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction summary', error });
    }
}

// POST: http://localhost:8080/api/categories
async function create_Categories(req, res) {
    try {
        const { type, color } = req.body;
        if (!type || !color) {
            return res.status(400).json({ message: "Missing category type or color" });
        }
        
        const category = new model.Categories({ type, color });
        const savedCategory = await category.save();
        res.json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// GET: http://localhost:8080/api/categories
async function get_Categories(req, res) {
    try {
        const data = await model.Categories.find({});
        const filter = data.map(v => ({ type: v.type, color: v.color }));
        res.json(filter);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
}

// POST: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    const { name, type, amount } = req.body;

    if (!name || !type || !amount || isNaN(amount)) {
        return res.status(400).json("Invalid input data");
    }

    try {
        const category = await model.Categories.findOne({ type });
        if (!category) {
            return res.status(400).json({ message: `Category type ${type} not found` });
        }

        const newTransaction = new model.Transaction({
            name,
            type,
            amount,
            color: category.color,
            uniqueId: new Date().toISOString() // Ensures better uniqueness
        });

        const savedTransaction = await newTransaction.save();
        res.json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: `Error creating transaction: ${error.message}` });
    }
}

// GET: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
    try {
        const data = await model.Transaction.find({});
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
}

// DELETE: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    if (!req.body || !req.body._id) {
        return res.status(400).json({ message: "Request body or _id missing" });
    }

    try {
        const deleted = await model.Transaction.deleteOne({ _id: req.body._id });
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Record Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
}

module.exports = {
    getTransactionSummary,
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
};
