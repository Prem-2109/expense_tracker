const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Allow requests from local dev and the deployed Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this in Vercel dashboard if needed
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// DB connection — cached for Vercel serverless (avoids reconnecting on every request)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/expense_tracker");
  isConnected = true;
  console.log("MongoDB connected");
}
connectDB().catch(err => {
  console.error("MongoDB connection error:", err.message);
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

const table2Routes = require("./routes/table2");
app.use("/api/table2", table2Routes);

const table3Routes = require("./routes/table3");
app.use("/api/table3", table3Routes);

const table4Routes = require("./routes/table4");
app.use("/api/table4", table4Routes);

const table5Routes = require("./routes/table5");
app.use("/api/table5", table5Routes);

// Export app for Vercel serverless; only listen locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
