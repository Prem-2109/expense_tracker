import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

import { fetchTransactions } from '../features/transactions/transactionSlice.js';
import { fetchTable2 } from '../features/transactions/table2Slice.js';
import { fetchTable3 } from '../features/transactions/table3Slice.js';
import { fetchTable4 } from '../features/transactions/table4Slice.js';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

export default function Dashboard() {
  const dispatch = useDispatch();

  const { list: list1, status: status1 } = useSelector(state => state.transactions);
  const { list: list2, status: status2 } = useSelector(state => state.table2);
  const { list: list3, status: status3 } = useSelector(state => state.table3);
  const { list: list4, status: status4 } = useSelector(state => state.table4);

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      if (list1.length === 0) dispatch(fetchTransactions());
      if (list2.length === 0) dispatch(fetchTable2());
      if (list3.length === 0) dispatch(fetchTable3());
      if (list4.length === 0) dispatch(fetchTable4());
    }
  }, [dispatch, list1.length, list2.length, list3.length, list4.length]);

  const aggregateData = useMemo(() => {
    const calculateTotals = (list, name) => {
      const income = list.reduce((sum, item) => sum + (Number(item.income) || 0), 0);
      const expense = list.reduce((sum, item) => sum + (Number(item.outgoing) || 0), 0);
      return {
        name,
        Income: income,
        Expense: expense,
        Balance: income - expense
      };
    };

    return [
      calculateTotals(list1, 'Suresh To Durai'),
      calculateTotals(list2, 'Suresh To Swamy'),
      calculateTotals(list3, 'Suresh To Sunder'),
      calculateTotals(list4, 'Travel Expenses'),
    ];
  }, [list1, list2, list3, list4]);

  const totalIncome = aggregateData.reduce((acc, curr) => acc + curr.Income, 0);
  const totalExpense = aggregateData.reduce((acc, curr) => acc + curr.Expense, 0);
  const totalBalance = totalIncome - totalExpense;

  const pieData = aggregateData.map(d => ({ name: d.name, value: d.Expense })).filter(d => d.value > 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '10px', borderRadius: '8px' }}>
          <p style={{ color: '#f8fafc', marginBottom: '5px', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-shell" style={{ overflowY: 'auto' }}>
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</div>
              <div>
                <h1 className="header-title">Back to Tracker</h1>
              </div>
            </Link>
          </div>
          <div className="header-logo">
            <h1 className="header-title" style={{ fontSize: '1.5rem', margin: 0 }}>Financial Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="app-main" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Summary Cards */}
        <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card stat-card-income" style={{ padding: '24px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#6ee7b7', marginBottom: '8px', letterSpacing: '0.06em' }}>Total Income</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#d1fae5', margin: 0 }}>{formatCurrency(totalIncome)}</p>
          </div>
          <div className="stat-card stat-card-expense" style={{ padding: '24px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#fda4af', marginBottom: '8px', letterSpacing: '0.06em' }}>Total Expense</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#fecdd3', margin: 0 }}>{formatCurrency(totalExpense)}</p>
          </div>
          <div className="stat-card stat-card-balance" style={{ padding: '24px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', marginBottom: '8px', letterSpacing: '0.06em' }}>Net Balance</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: totalBalance >= 0 ? '#c7d2fe' : '#fecdd3', margin: 0 }}>{formatCurrency(totalBalance)}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
          
          {/* Bar Chart: Income vs Expense per Category */}
          <div className="panel" style={{ padding: '24px' }}>
            <h2 className="panel-title" style={{ marginBottom: '20px' }}>
              <span className="panel-title-icon">📊</span>
              Income vs Expense by Category
            </h2>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={aggregateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Balance across Categories */}
          <div className="panel" style={{ padding: '24px' }}>
            <h2 className="panel-title" style={{ marginBottom: '20px' }}>
              <span className="panel-title-icon">📈</span>
              Net Balance by Category
            </h2>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={aggregateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Expenses Breakdown */}
          <div className="panel" style={{ padding: '24px', gridColumn: '1 / -1', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <h2 className="panel-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <span className="panel-title-icon">🍩</span>
              Expense Breakdown
            </h2>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
