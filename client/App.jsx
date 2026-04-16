import React from "react";
import TransactionForm from "./src/components/TransactionForm.jsx";
import TransactionList from "./src/features/transactions/TransactionList.jsx";

function App() {
  return (
    <div>
      <h2>Expense Tracker</h2>
      <TransactionForm />
      <TransactionList />
    </div>
  );
}

export default App;