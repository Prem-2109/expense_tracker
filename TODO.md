# Vercel Server Configuration Progress

## Plan Steps (Option 1: Separate Backend Deploy)
- [x] 1. Update `server/package.json`: Set `"main": "server.js"`
- [x] 2. Update `server/vercel.json`: Builds/routing for `server.js`
- [x] 3. Optimize `server/server.js` for Vercel serverless (connection pooling, export app)
- [x] 4. Update `client/vite.config.js`: Local proxy
- [x] 5. Update `client/src/features/transactions/transactionSlice.js`: API_URL env
- [x] 6. Update `client/vercel.json`: Proxy to https://moneymintbackend.vercel.app
- [x] 7. Create/update `.env.example` with MONGO_URI
- [x] 8. Test/deploy: `cd server && vercel --prod`
- [x] 9. Test API endpoint
- [x] 10. Deploy client
