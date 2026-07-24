import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchTable5 = createAsyncThunk("table5/fetch", async () => {
  const res = await axios.get(`${API_URL}/table5`);
  return res.data;
});

export const addTable5 = createAsyncThunk("table5/add", async (data) => {
  const res = await axios.post(`${API_URL}/table5`, data);
  return res.data;
});

export const deleteTable5 = createAsyncThunk("table5/delete", async (id) => {
  await axios.delete(`${API_URL}/table5/${id}`);
  return id;
});

export const updateTable5 = createAsyncThunk("table5/update", async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/table5/${id}`, data);
  return res.data;
});

export const reorderTable5 = createAsyncThunk("table5/reorder", async (updates) => {
  await axios.post(`${API_URL}/table5/reorder`, updates);
  return updates;
});

export const verifyImportTable5 = createAsyncThunk("table5/verifyImport", async (data) => {
  const res = await axios.post(`${API_URL}/table5/verify-import`, data);
  return res.data;
});

export const importTable5 = createAsyncThunk("table5/import", async ({ data, skipDuplicates }) => {
  const res = await axios.post(`${API_URL}/table5/import`, { transactions: data, skipDuplicates });
  return res.data;
});

const table5Slice = createSlice({
  name: "table5",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    reorderLocal5(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable5.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTable5.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(importTable5.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload.inserted];
      })
      .addCase(deleteTable5.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      })
      .addCase(updateTable5.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { reorderLocal5 } = table5Slice.actions;
export default table5Slice.reducer;
