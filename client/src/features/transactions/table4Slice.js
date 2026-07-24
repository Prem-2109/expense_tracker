import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchTable4 = createAsyncThunk("table4/fetch", async () => {
  const res = await axios.get(`${API_URL}/table4`);
  return res.data;
});

export const addTable4 = createAsyncThunk("table4/add", async (data) => {
  const res = await axios.post(`${API_URL}/table4`, data);
  return res.data;
});

export const deleteTable4 = createAsyncThunk("table4/delete", async (id) => {
  await axios.delete(`${API_URL}/table4/${id}`);
  return id;
});

export const updateTable4 = createAsyncThunk("table4/update", async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/table4/${id}`, data);
  return res.data;
});

export const reorderTable4 = createAsyncThunk("table4/reorder", async (updates) => {
  await axios.post(`${API_URL}/table4/reorder`, updates);
  return updates;
});

export const verifyImportTable4 = createAsyncThunk("table4/verifyImport", async (data) => {
  const res = await axios.post(`${API_URL}/table4/verify-import`, data);
  return res.data;
});

export const importTable4 = createAsyncThunk("table4/import", async ({ data, skipDuplicates }) => {
  const res = await axios.post(`${API_URL}/table4/import`, { transactions: data, skipDuplicates });
  return res.data;
});

const table4Slice = createSlice({
  name: "table4",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    reorderLocal4(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable4.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTable4.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(importTable4.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload.inserted];
      })
      .addCase(deleteTable4.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      })
      .addCase(updateTable4.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { reorderLocal4 } = table4Slice.actions;
export default table4Slice.reducer;
