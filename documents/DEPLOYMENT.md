# Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CodeWithFin/flight-search-engine)

### Steps:

1. **Fork or clone this repository**

2. **Set up environment variables** in your Vercel project:
   - `VITE_AMADEUS_API_KEY` - Your Amadeus API Key
   - `VITE_AMADEUS_API_SECRET` - Your Amadeus API Secret
   - `VITE_AMADEUS_API_BASE_URL` - `https://test.api.amadeus.com`

3. **Deploy:**
   ```bash
   npm install
   npm run build
   ```

## Alternative: Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables (same as above)

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AMADEUS_API_KEY=your_api_key_here
VITE_AMADEUS_API_SECRET=your_api_secret_here
VITE_AMADEUS_API_BASE_URL=https://test.api.amadeus.com
```

Get your Amadeus API credentials at: https://developers.amadeus.com/
