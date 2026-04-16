// src/features/transactions/TransactionList.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "./transactionSlice";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  let runningBalance = 0;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Description</th><th>Income</th><th>Outgoing</th><th>Balance</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map(tx => {
          runningBalance += (tx.income - tx.outgoing);
          return (
            <tr key={tx._id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.income}</td>
              <td>{tx.outgoing}</td>
              <td>{runningBalance}</td>
              <td><button onClick={() => dispatch(deleteTransaction(tx._id))}>Delete</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
