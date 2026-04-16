# Expense Tracker Server

## Setup Instructions

1. Create a `.env` file in the server directory with the following content:
```
MONGO_URI=mongodb://localhost:27017/expense_tracker
PORT=5000
```

2. Make sure MongoDB is running on your system

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm run dev
```

The server will run on port 5000 by default. 