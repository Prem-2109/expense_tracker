import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'https://moneymintbackend.vercel.app';

export const fetchTransactions = createAsyncThunk("transactions/fetch", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const addTransaction = createAsyncThunk("transactions/add", async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
});

export const deleteTransaction = createAsyncThunk("transactions/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  },
});

export default transactionSlice.reducer;