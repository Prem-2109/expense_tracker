const Table2 = require("../models/Table2");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Table2.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const newTransaction = new Table2(req.body);
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Table2.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Table2.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.reorderTransactions = async (req, res) => {
  try {
    const updates = req.body;
    await Promise.all(
      updates.map(({ id, sno }) =>
        Table2.findByIdAndUpdate(id, { sno }, { new: true })
      )
    );
    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
