const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  reorderTransactions,
  importTransactions,
  verifyImport
} = require("../controllers/table5controller");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.post("/import", importTransactions);
router.post("/verify-import", verifyImport);
router.post("/reorder", reorderTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
