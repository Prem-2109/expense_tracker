import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

import { fetchTransactions } from '../features/transactions/transactionSlice.js';
import { fetchTable2 } from '../features/transactions/table2Slice.js';
import { fetchTable3 } from '../features/transactions/table3Slice.js';
import { fetchTable4 } from '../features/transactions/table4Slice.js';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

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
    ].filter(d => d.Income > 0 || d.Expense > 0);
  }, [list1, list2, list3]);

  const totalIncome = aggregateData.reduce((acc, curr) => acc + curr.Income, 0);
  const totalExpense = aggregateData.reduce((acc, curr) => acc + curr.Expense, 0);
  const totalBalance = totalIncome - totalExpense;

  const pieData = aggregateData.map(d => ({ name: d.name, value: d.Expense })).filter(d => d.value > 0);
  
  const topCategory = pieData.length > 0 ? pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current) : null;
  const topCategoryName = topCategory ? topCategory.name : 'N/A';
  const topCategoryPercent = totalExpense > 0 && topCategory ? Math.round((topCategory.value / totalExpense) * 100) : 0;
  
  const highestBalanceCategory = aggregateData.length > 0 ? aggregateData.reduce((prev, current) => (prev.Balance > current.Balance) ? prev : current) : null;

  const incomeVsExpenseDiff = totalExpense > 0 ? ((totalIncome - totalExpense) / totalExpense * 100).toFixed(1) : 0;
  
  const projectedMargin = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(0) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatCurrencyCrore = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return formatCurrency(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
          <p style={{ color: '#f8fafc', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 'bold' }}>{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Mock data for mini charts to make it look like the mockup
  const miniIncomeData = [{val: 40}, {val: 30}, {val: 45}, {val: 25}, {val: 55}, {val: 65}, {val: 60}, {val: 80}];
  const miniExpenseData = [{val: 30}, {val: 40}, {val: 20}, {val: 50}, {val: 45}, {val: 65}, {val: 50}, {val: 70}];
  const miniBalanceData = [{val: 10}, {val: 15}, {val: 20}, {val: 30}, {val: 40}, {val: 35}, {val: 50}, {val: 60}];

  const panelStyle = {
    backgroundColor: '#0b1120',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div className="app-shell" style={{ overflowY: 'auto', backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc' }}>
      {/* <header className="app-header" style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#020617', padding: '16px 0' }}>
        <div className="header-inner" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-logo">
            <Link to="/" style={{ textDecoration: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>←</div>
              <div>
                <h1 className="header-title" style={{ color: '#94a3b8', fontSize: '16px', margin: 0, fontWeight: 500 }}>Back to Tracker</h1>
              </div>
            </Link>
          </div>
          <div className="header-logo">
            <h1 className="header-title" style={{ fontSize: '1.25rem', margin: 0, color: '#f8fafc', fontWeight: 600 }}>Financial Dashboard</h1>
          </div>
        </div>
      </header> */}

      <main className="app-main" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Total Income */}
          <div style={{ ...panelStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', zIndex: 1 }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#10b981', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Total Income</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{formatCurrency(totalIncome)}</h3>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#10b981', margin: '4px 0 0 54px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
               ▲ 2.1% from last month
            </p>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60%', height: '70px', zIndex: 0 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={miniIncomeData}>
                   <defs>
                     <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Total Expense */}
          <div style={{ ...panelStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', zIndex: 1 }}>
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '10px', borderRadius: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#f43f5e', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Total Expense</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{formatCurrency(totalExpense)}</h3>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#f43f5e', margin: '4px 0 0 54px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
               ▼ 0.5% from last month
            </p>
            <div style={{ position: 'absolute', bottom: 15, right: 20, width: '40%', height: '50px', zIndex: 0 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={miniExpenseData}>
                    <Bar dataKey="val" fill="#f43f5e" radius={[2, 2, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Net Balance */}
          <div style={{ ...panelStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', zIndex: 1 }}>
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '10px', borderRadius: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <div style={{ zIndex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#818cf8', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Net Balance</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{formatCurrency(totalBalance)}</h3>
              </div>
            </div>
            <div style={{ margin: '4px 0 0 54px', zIndex: 1 }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px 0' }}>Projected Margin: {projectedMargin}%</p>
              <div style={{ width: '100px', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${Math.min(Math.max(projectedMargin, 0), 100)}%`, height: '100%', backgroundColor: '#6366f1' }}></div>
              </div>
              <p style={{ fontSize: '12px', color: '#818cf8', margin: 0 }}>Positive</p>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '80px', zIndex: 0 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={miniBalanceData}>
                   <defs>
                     <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          
          {/* Bar Chart: Income vs Expense per Category */}
          <div style={{ ...panelStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px' }}>📊</div>
                Income vs Expense by Category
              </h2>
              <div style={{ cursor: 'pointer', color: '#94a3b8' }}>⋮</div>
            </div>
            
            <div style={{ width: '100%', height: 320, flexGrow: 1 }}>
              <ResponsiveContainer>
                <BarChart data={aggregateData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" iconSize={12} formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px', marginRight: '16px' }}>{value}</span>} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={36} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '10px', borderRadius: '50%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect></svg>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5' }}>
                Total Income is <span style={{ color: '#10b981', fontWeight: 'bold' }}>{incomeVsExpenseDiff}%</span> higher than total Expense this month.
              </p>
            </div>
          </div>

          {/* Line Chart: Balance across Categories */}
          <div style={{ ...panelStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px' }}>📈</div>
                Net Balance by Category
              </h2>
              <div style={{ cursor: 'pointer', color: '#94a3b8' }}>⋮</div>
            </div>
            
            <div style={{ width: '100%', height: 320, flexGrow: 1 }}>
              <ResponsiveContainer>
                <AreaChart data={aggregateData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalanceMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" iconSize={10} formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>} />
                  <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalanceMain)" dot={{ r: 5, fill: '#fff', strokeWidth: 2, stroke: '#6366f1' }} activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '10px', borderRadius: '50%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5' }}>
                <span style={{ color: '#f8fafc' }}>{highestBalanceCategory?.name || 'N/A'}</span> has the highest positive balance of <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{formatCurrency(highestBalanceCategory?.Balance || 0)}</span>.
              </p>
            </div>
          </div>

          {/* Pie Chart: Expenses Breakdown */}
          <div style={{ ...panelStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px' }}>🍩</div>
                Expense Breakdown
              </h2>
              <div style={{ cursor: 'pointer', color: '#94a3b8' }}>⋮</div>
            </div>
            
            <div style={{ width: '100%', height: 320, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60%', height: '100%', position: 'relative' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
                   <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Expense</p>
                   <h3 style={{ margin: '4px 0', fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>{formatCurrencyCrore(totalExpense)}</h3>
                   <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>Top Category:</p>
                   <p style={{ margin: 0, fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>{topCategoryName}</p>
                </div>
              </div>
              <div style={{ width: '40%', paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                {pieData.map((entry, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{entry.name}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '18px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: COLORS[index % COLORS.length] }}>{totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0}%</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatCurrency(entry.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '10px', borderRadius: '50%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5' }}>
                <span style={{ color: '#f8fafc' }}>{topCategoryName}</span> contributes <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{topCategoryPercent}%</span> of the total expenses.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

