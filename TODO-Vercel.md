# Vercel Separate Deploys Progress
✅ Root vercel.json (monorepo fallback)
✅ client/server vercel.json emptied
✅ .env.example

## TODO Steps
- [ ] Update transactionSlice.js: API_URL = import.meta.env.VITE_API_URL || '/api/transactions'
- [ ] Frontend vercel.json: rewrites /api/* → https://moneymintbackend.vercel.app/api/$1
- [ ] Backend: Ensure deployed, test https://moneymintbackend.vercel.app/api/transactions
- [ ] Frontend redeploy
- [ ] Local: vite.config.js proxy /api → http://localhost:5000
