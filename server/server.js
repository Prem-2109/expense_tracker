const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// DB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/expense_tracker")
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  console.log("Please make sure MongoDB is running and MONGO_URI is set in .env file");
});

// Routes
const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

const table2Routes = require("./routes/table2");
app.use("/api/table2", table2Routes);

const table3Routes = require("./routes/table3");
app.use("/api/table3", table3Routes);

const table4Routes = require("./routes/table4");
app.use("/api/table4", table4Routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
