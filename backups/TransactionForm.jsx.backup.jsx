import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../features/transactions/transactionSlice.js";

export default function TransactionForm() {
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "expense",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addTransaction({
        date: form.date,
        description: form.description,
        income: form.type === "income" ? +form.amount : 0,
        outgoing: form.type === "expense" ? +form.amount : 0,
      })
    );

    setForm({ date: "", description: "", amount: "", type: "expense" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
        ➕ Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg sm:rounded-xl p-1">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: "expense" })}
            className={`flex-1 py-2 px-2 sm:px-0 rounded-lg text-xs sm:text-sm font-medium ${
              form.type === "expense"
                ? "bg-red-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Expense 💸
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, type: "income" })}
            className={`flex-1 py-2 px-2 sm:px-0 rounded-lg text-xs sm:text-sm font-medium ${
              form.type === "income"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Income 💰
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm text-gray-600">Amount</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₹
            </span>
            <input
              name="amount"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full pl-8 pr-3 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Date */}
        {/* <div>
          <label className="text-sm text-gray-600">Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div> */}

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <input
            name="description"
            type="text"
            placeholder="e.g. Client Payment / Hosting Fee"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition"
        >
          Add Transaction
        </button>

        {/* Hint */}
        <p className="text-xs text-gray-400 text-center">
          Tip: Use clear descriptions for better tracking 📊
        </p>
      </form>
    </div>
  );
}
