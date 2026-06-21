import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpenseTracker from "./pages/ExpenseTracker";
import QuotationGenerator from "./pages/QuotationGenerator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExpenseTracker />} />
        <Route path="/quotation-generator" element={<QuotationGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;