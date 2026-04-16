import React from "react";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./features/transactions/TransactionList.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            💰 Expense Tracker
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Track your income and expenses with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="card bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-100 sticky top-4 sm:top-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Add Transaction
                </h2>
                <TransactionForm />
              </div>
            </div>

            {/* Transactions Section */}
            <div className="lg:col-span-2">
              <div className="card bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Transaction History
                </h2>
                <TransactionList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
