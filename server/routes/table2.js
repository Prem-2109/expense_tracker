const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  reorderTransactions
} = require("../controllers/table2Controller");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.post("/reorder", reorderTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
