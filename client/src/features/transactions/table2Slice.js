import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchTable2 = createAsyncThunk("table2/fetch", async () => {
  const res = await axios.get(`${API_URL}/table2`);
  return res.data;
});

export const addTable2 = createAsyncThunk("table2/add", async (data) => {
  const res = await axios.post(`${API_URL}/table2`, data);
  return res.data;
});

export const deleteTable2 = createAsyncThunk("table2/delete", async (id) => {
  await axios.delete(`${API_URL}/table2/${id}`);
  return id;
});

export const updateTable2 = createAsyncThunk("table2/update", async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/table2/${id}`, data);
  return res.data;
});

export const reorderTable2 = createAsyncThunk("table2/reorder", async (updates) => {
  await axios.post(`${API_URL}/table2/reorder`, updates);
  return updates;
});

const table2Slice = createSlice({
  name: "table2",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    reorderLocal2(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable2.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTable2.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteTable2.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      })
      .addCase(updateTable2.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { reorderLocal2 } = table2Slice.actions;
export default table2Slice.reducer;
