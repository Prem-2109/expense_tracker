import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "./transactionSlice.js";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Sort data (important for correct balance)
  const sortedList = [...list].sort((a, b) =>
    (a._id || "").localeCompare(b._id || "")
  );

  let runningBalance = 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (sortedList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90">Total Income</p>
          <p className="text-xl sm:text-2xl font-bold">
            {formatCurrency(sortedList.reduce((sum, tx) => sum + tx.income, 0)).replace('$', '₹')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90">Total Expenses</p>
          <p className="text-xl sm:text-2xl font-bold">
            {formatCurrency(sortedList.reduce((sum, tx) => sum + tx.outgoing, 0)).replace('$', '₹')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90">Net Balance</p>
          <p className="text-xl sm:text-2xl font-bold">
            {formatCurrency(sortedList.reduce((sum, tx) => sum + tx.income - tx.outgoing, 0)).replace('$', '₹')}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">

            {/* Header */}
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Income
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Expense
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedList.map((tx, index) => {
                runningBalance += (tx.income - tx.outgoing);

                return (
                  <tr key={tx._id} className="hover:bg-blue-50 transition duration-200">

                    {/* Serial Number */}
                    <td className="px-6 py-4 text-center text-gray-500 font-medium">
                      {index + 1}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </div>
                    </td>

                    {/* Income */}
                    <td className="px-6 py-4 text-right">
                      {tx.income > 0 ? (
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(tx.income).replace('$', '₹')}
                        </span>
                      ) : "-"}
                    </td>

                    {/* Expense */}
                    <td className="px-6 py-4 text-right">
                      {tx.outgoing > 0 ? (
                        <span className="text-red-600 font-medium">
                          -{formatCurrency(tx.outgoing).replace('$', '₹')}
                        </span>
                      ) : "-"}
                    </td>

                    {/* Balance */}
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${
                        runningBalance >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {formatCurrency(runningBalance).replace('$', '₹')}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => dispatch(deleteTransaction(tx._id))}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
