const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
// Using mongoose.models to prevent OverwriteModelError if imported multiple times
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const table5Schema = new mongoose.Schema(
  {
    sno: { type: Number, unique: true },
    description: { type: String, required: true },
    income: { type: Number, default: 0 },
    outgoing: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-increment sno before saving
table5Schema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "table5_sno",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.sno = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Table5", table5Schema);
