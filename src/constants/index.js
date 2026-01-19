export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_AMADEUS_API_BASE_URL || 'https://test.api.amadeus.com',
  API_KEY: import.meta.env.VITE_AMADEUS_API_KEY,
  API_SECRET: import.meta.env.VITE_AMADEUS_API_SECRET,
}

export const CABIN_CLASSES = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS: 'Business',
  FIRST: 'First Class',
}

export const AIRPORTS = {
  JFK: { code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
  LAX: { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
  ORD: { code: 'ORD', city: 'Chicago', name: "O'Hare International" },
  ATL: { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson' },
  DFW: { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International' },
  DEN: { code: 'DEN', city: 'Denver', name: 'Denver International' },
  SFO: { code: 'SFO', city: 'San Francisco', name: 'San Francisco International' },
  MIA: { code: 'MIA', city: 'Miami', name: 'Miami International' },
  LAS: { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid International' },
  SEA: { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International' },
  BOS: { code: 'BOS', city: 'Boston', name: 'Logan International' },
  LHR: { code: 'LHR', city: 'London', name: 'Heathrow' },
  CDG: { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
  DXB: { code: 'DXB', city: 'Dubai', name: 'Dubai International' },
  SIN: { code: 'SIN', city: 'Singapore', name: 'Singapore Changi' },
  HND: { code: 'HND', city: 'Tokyo', name: 'Tokyo Haneda' },
}

export const AIRLINES = {
  AA: { code: 'AA', name: 'American Airlines' },
  DL: { code: 'DL', name: 'Delta Air Lines' },
  UA: { code: 'UA', name: 'United Airlines' },
  WN: { code: 'WN', name: 'Southwest Airlines' },
  B6: { code: 'B6', name: 'JetBlue Airways' },
  AS: { code: 'AS', name: 'Alaska Airlines' },
  BA: { code: 'BA', name: 'British Airways' },
  AF: { code: 'AF', name: 'Air France' },
  LH: { code: 'LH', name: 'Lufthansa' },
  EK: { code: 'EK', name: 'Emirates' },
}
