import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/transactions/transactionSlice.js";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});