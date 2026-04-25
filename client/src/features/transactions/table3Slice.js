import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchTable3 = createAsyncThunk("table3/fetch", async () => {
  const res = await axios.get(`${API_URL}/table3`);
  return res.data;
});

export const addTable3 = createAsyncThunk("table3/add", async (data) => {
  const res = await axios.post(`${API_URL}/table3`, data);
  return res.data;
});

export const deleteTable3 = createAsyncThunk("table3/delete", async (id) => {
  await axios.delete(`${API_URL}/table3/${id}`);
  return id;
});

const table3Slice = createSlice({
  name: "table3",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable3.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTable3.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteTable3.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  },
});

export default table3Slice.reducer;
