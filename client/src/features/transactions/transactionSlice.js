import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchTransactions = createAsyncThunk("transactions/fetch", async () => {
  const res = await axios.get(`${API_URL}/transactions`);
  return res.data;
});

export const addTransaction = createAsyncThunk("transactions/add", async (data) => {
  const res = await axios.post(`${API_URL}/transactions`, data);
  return res.data;
});

export const deleteTransaction = createAsyncThunk("transactions/delete", async (id) => {
  await axios.delete(`${API_URL}/transactions/${id}`);
  return id;
});

export const updateTransaction = createAsyncThunk("transactions/update", async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/transactions/${id}`, data);
  return res.data;
});

export const reorderTransactions = createAsyncThunk("transactions/reorder", async (updates) => {
  // updates = [{ id, sno }, ...]
  await axios.post(`${API_URL}/transactions/reorder`, updates);
  return updates;
});

export const verifyImport = createAsyncThunk("transactions/verifyImport", async (data) => {
  const res = await axios.post(`${API_URL}/transactions/verify-import`, data);
  return res.data;
});

export const importTransactions = createAsyncThunk("transactions/import", async ({ data, skipDuplicates }) => {
  const res = await axios.post(`${API_URL}/transactions/import`, { transactions: data, skipDuplicates });
  return res.data;
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    // Optimistic local reorder — swaps sno values in state immediately
    reorderLocal(state, action) {
      // action.payload = new ordered list of full objects
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(importTransactions.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload.inserted];
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { reorderLocal } = transactionSlice.actions;
export default transactionSlice.reducer;