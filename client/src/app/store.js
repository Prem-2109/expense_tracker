import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/transactions/transactionSlice.js";
import table2Reducer from "../features/transactions/table2Slice.js";
import table3Reducer from "../features/transactions/table3Slice.js";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    table2: table2Reducer,
    table3: table3Reducer,
  },
});