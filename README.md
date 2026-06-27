# DocSamajh — Backend API (Next.js)

AI-powered Hindi document comprehension backend. Upload documents and get AI-generated summaries in Hindi.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **AI**: Groq API (LLaMA)
- **Auth**: Google OAuth 2.0 + JWT
- **DB**: MongoDB (Mongoose)
- **Payments**: Razorpay

## Environment Variables (set in Railway)

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key |
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth Web Client ID |
| `JWT_SECRET` | A long random string for signing JWTs |
| `MONGODB_URI` | MongoDB connection URI |
| `RAZORPAY_KEY_ID` | Razorpay key ID (optional for production) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret (optional for production) |

## API Routes

- `POST /api/auth/google` — Google OAuth login/register
- `POST /api/analyze` — Analyze uploaded document
- `POST /api/subscription/verify` — Verify payment and upgrade plan

## Deployment (Railway)

1. Push this folder to a GitHub repo
2. Create a new Railway project → "Deploy from GitHub"
3. Select the repo
4. Add all environment variables in Railway dashboard
5. Railway auto-detects Next.js and deploys

## Local Development

```bash
npm install
npm run dev
```
