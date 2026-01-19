# Flight Search Engine

A modern, responsive flight search engine built with React, featuring real-time pricing insights and powerful filtering capabilities.

## Features

- 🔍 Comprehensive flight search with autocomplete
- 📊 Real-time price trend analysis and graphs
- 🎯 Advanced filtering (price, stops, airlines, time)
- 📱 Fully responsive design (mobile-first)
- ⚡ Fast performance with optimized rendering
- ♿ Accessible and keyboard-friendly

## Tech Stack

- **Framework**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: Amadeus Self-Service API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Amadeus API credentials (get from [developers.amadeus.com](https://developers.amadeus.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd flight-search-engine
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Amadeus API credentials to `.env`:
```
VITE_AMADEUS_API_KEY=your_api_key
VITE_AMADEUS_API_SECRET=your_api_secret
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
flight-search-engine/
├── src/
│   ├── components/        # React components
│   ├── services/          # API integration
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # Configuration
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
└── index.html
```

## License

MIT

## Author

Built as part of a technical assessment
