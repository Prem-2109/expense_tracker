import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpenseTracker from "./pages/ExpenseTracker";
import Tracker from "./pages/Tracker";
import QuotationGenerator from "./pages/QuotationGenerator";
import Dashboard from "./pages/Dashboard";
// import Header from "./components/Header";

function App() {
  // const [search, setSearch] = useState("");
  // const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <BrowserRouter>
      {/* <Header
        search={search}
        setSearch={setSearch}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      /> */}

      <Routes>
        <Route path="/" element={<ExpenseTracker  />} />
        <Route path="/tracker" element={<Tracker  />} />
        <Route path="/dashboard" element={<Dashboard  />} />
        <Route
          path="/quotation-generator"
          element={<QuotationGenerator />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;