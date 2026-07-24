const Table4 = require("../models/Table4");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Table4.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const newTransaction = new Table4(req.body);
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Table4.findByIdAndUpdate(
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
    await Table4.findByIdAndDelete(req.params.id);
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
        Table4.findByIdAndUpdate(id, { sno }, { new: true })
      )
    );
    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const mongoose = require("mongoose");

/**
 * Verify imported data against existing records to find duplicates.
 * Match criteria: description (case-insensitive, trimmed) + income + outgoing
 */
exports.verifyImport = async (req, res) => {
  try {
    const transactions = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: "No transactions provided for verification" });
    }

    const orConditions = transactions.map((t) => ({
      description: { $regex: new RegExp(`^${escapeRegex(String(t.description || "").trim())}$`, "i") },
      income: Number(t.income) || 0,
      outgoing: Number(t.outgoing) || 0,
    }));

    const existingMatches = await Table4.find({ $or: orConditions });

    const existingKeys = new Set(
      existingMatches.map(
        (e) =>
          `${String(e.description).trim().toLowerCase()}|${e.income}|${e.outgoing}`
      )
    );

    const duplicates = [];
    const newRecords = [];

    transactions.forEach((t) => {
      const key = `${String(t.description || "").trim().toLowerCase()}|${Number(t.income) || 0}|${Number(t.outgoing) || 0}`;
      if (existingKeys.has(key)) {
        duplicates.push(t);
      } else {
        newRecords.push(t);
      }
    });

    res.json({
      duplicates,
      newRecords,
      duplicateCount: duplicates.length,
      newCount: newRecords.length,
      total: transactions.length,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.importTransactions = async (req, res) => {
  try {
    const { transactions, skipDuplicates } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: "No transactions provided for import" });
    }

    let dataToInsert = transactions;

    if (skipDuplicates !== false) {
      const orConditions = transactions.map((t) => ({
        description: { $regex: new RegExp(`^${escapeRegex(String(t.description || "").trim())}$`, "i") },
        income: Number(t.income) || 0,
        outgoing: Number(t.outgoing) || 0,
      }));

      const existingMatches = await Table4.find({ $or: orConditions });
      const existingKeys = new Set(
        existingMatches.map(
          (e) =>
            `${String(e.description).trim().toLowerCase()}|${e.income}|${e.outgoing}`
        )
      );

      dataToInsert = transactions.filter((t) => {
        const key = `${String(t.description || "").trim().toLowerCase()}|${Number(t.income) || 0}|${Number(t.outgoing) || 0}`;
        return !existingKeys.has(key);
      });
    }

    if (dataToInsert.length === 0) {
      return res.json({ inserted: [], skipped: transactions.length, message: "All records already exist (duplicates skipped)" });
    }

    const Counter = mongoose.models.Counter || mongoose.model("Counter");
    let counter = await Counter.findById("table4_sno");
    let currentSeq = counter ? counter.seq : 0;

    const docsToInsert = dataToInsert.map((t) => {
      currentSeq++;
      return {
        sno: currentSeq,
        description: t.description || "",
        income: Number(t.income) || 0,
        outgoing: Number(t.outgoing) || 0,
      };
    });

    await Counter.findByIdAndUpdate(
      "table4_sno",
      { seq: currentSeq },
      { upsert: true, new: true }
    );

    const saved = await Table4.insertMany(docsToInsert);
    const skippedCount = transactions.length - dataToInsert.length;
    res.status(201).json({
      inserted: saved,
      skipped: skippedCount,
      message: skippedCount > 0
        ? `Imported ${saved.length} records, skipped ${skippedCount} duplicates`
        : `Successfully imported ${saved.length} records`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

