import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./features/auth/authSlice";

import Header from "./components/Header";
import ExpenseTracker from "./pages/ExpenseTracker";
import Tracker from "./pages/Tracker";
import QuotationGenerator from "./pages/QuotationGenerator";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Header search={search} setSearch={setSearch} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* <Route path="/" element={ <ProtectedRoute> <ExpenseTracker /> </ProtectedRoute> } /> */}
        <Route path="/" element={ <ProtectedRoute> <Tracker /> </ProtectedRoute> }/>
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
        <Route path="/quotation-generator" element={ <ProtectedRoute> <QuotationGenerator /> </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;