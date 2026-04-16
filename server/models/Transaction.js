const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

const transactionSchema = new mongoose.Schema(
  {
    sno: { type: Number, unique: true },
    description: { type: String, required: true },
    income: { type: Number, default: 0 },
    outgoing: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-increment sno before saving
transactionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "transaction_sno",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.sno = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
