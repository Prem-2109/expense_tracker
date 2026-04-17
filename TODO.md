# Vercel Deployment Steps

## Local Development (already works)
- Client: `cd client && npm run dev` (http://localhost:5173)
- Server: `cd server && npm run dev` (http://localhost:5000)
- Full local: Update client axios to `http://localhost:5000/api`

## Production (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. `vercel login`
3. Copy `.env.example` to `.env.local`, set MONGO_URI (Atlas)
4. `vercel` (from root) - follow prompts, add MONGO_URI env var
5. `vercel --prod` for production

Test: Frontend loads, API calls to /api/transactions work (proxied to serverless).
