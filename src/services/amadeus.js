import { API_CONFIG } from '../constants'

class AmadeusService {
  constructor() {
    this.accessToken = null
    this.tokenExpiry = null
  }

  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/security/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: API_CONFIG.API_KEY,
          client_secret: API_CONFIG.API_SECRET,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate with Amadeus API')
      }

      const data = await response.json()
      this.accessToken = data.access_token
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

      return this.accessToken
    } catch (error) {
      console.error('Authentication error:', error)
      throw new Error('Unable to connect to flight search service. Please check your API credentials.')
    }
  }

  async searchFlights(searchParams) {
    try {
      const token = await this.getAccessToken()

      // Build query parameters
      const params = new URLSearchParams({
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate,
        adults: searchParams.passengers.toString(),
        travelClass: searchParams.cabinClass,
        max: '50', // Limit results
        currencyCode: 'USD',
      })

      // Add return date for round-trip
      if (searchParams.tripType === 'round-trip' && searchParams.returnDate) {
        params.append('returnDate', searchParams.returnDate)
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/v2/shopping/flight-offers?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(`Flight search failed: ${response.status}`)
      }

      const data = await response.json()
      return this.transformFlightData(data)
    } catch (error) {
      console.error('Flight search error:', error)
      throw error
    }
  }

  transformFlightData(apiResponse) {
    if (!apiResponse.data || apiResponse.data.length === 0) {
      return []
    }

    return apiResponse.data.map((offer, index) => {
      const itinerary = offer.itineraries[0]
      const segments = itinerary.segments
      const firstSegment = segments[0]
      const lastSegment = segments[segments.length - 1]

      // Calculate total duration in minutes
      const durationMatch = itinerary.duration.match(/PT(\d+H)?(\d+M)?/)
      const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0
      const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0
      const totalMinutes = hours * 60 + minutes

      // Get airline info
      const airlineCode = firstSegment.carrierCode
      
      // Get stops
      const stops = segments.length - 1
      const stopLocations = segments.slice(0, -1).map(s => s.arrival.iataCode)

      return {
        id: offer.id || `flight-${index}`,
        airline: {
          code: airlineCode,
          name: this.getAirlineName(airlineCode),
        },
        departure: {
          airport: firstSegment.departure.iataCode,
          time: this.formatTime(firstSegment.departure.at),
          date: this.formatDate(firstSegment.departure.at),
          dateTime: firstSegment.departure.at,
        },
        arrival: {
          airport: lastSegment.arrival.iataCode,
          time: this.formatTime(lastSegment.arrival.at),
          date: this.formatDate(lastSegment.arrival.at),
          dateTime: lastSegment.arrival.at,
        },
        duration: totalMinutes,
        durationFormatted: this.formatDuration(totalMinutes),
        stops,
        stopLocations,
        price: {
          amount: parseFloat(offer.price.total),
          currency: offer.price.currency,
        },
        cabinClass: offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY',
        aircraft: firstSegment.aircraft?.code || 'Unknown',
        segments: segments.map(seg => ({
          departure: {
            airport: seg.departure.iataCode,
            time: this.formatTime(seg.departure.at),
          },
          arrival: {
            airport: seg.arrival.iataCode,
            time: this.formatTime(seg.arrival.at),
          },
          carrier: seg.carrierCode,
          flightNumber: seg.number,
          aircraft: seg.aircraft?.code,
        })),
      }
    })
  }

  getAirlineName(code) {
    const airlines = {
      'AA': 'American Airlines',
      'DL': 'Delta Air Lines',
      'UA': 'United Airlines',
      'WN': 'Southwest Airlines',
      'B6': 'JetBlue Airways',
      'AS': 'Alaska Airlines',
      'BA': 'British Airways',
      'AF': 'Air France',
      'LH': 'Lufthansa',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'SQ': 'Singapore Airlines',
      'TK': 'Turkish Airlines',
    }
    return airlines[code] || code
  }

  formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  formatDate(dateTimeString) {
    const date = new Date(dateTimeString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  async searchLocations(query) {
    try {
      const token = await this.getAccessToken()

      // Search for airports and cities
      const params = new URLSearchParams({
        subType: 'AIRPORT,CITY',
        keyword: query,
        'page[limit]': '10',
      })

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/v1/reference-data/locations?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        console.error('Location search failed:', response.status)
        return []
      }

      const data = await response.json()
      return this.transformLocationData(data)
    } catch (error) {
      console.error('Location search error:', error)
      return []
    }
  }

  transformLocationData(apiResponse) {
    if (!apiResponse.data || apiResponse.data.length === 0) {
      return []
    }

    const transformed = apiResponse.data.map(location => {
      const cityName = location.address?.cityName || ''
      const iataCode = location.iataCode || '' // This can be airport code or city code
      const locationName = location.name || ''
      const countryCode = location.address?.countryCode || ''
      
      // Format display name
      let displayName = ''
      if (location.subType === 'CITY') {
        // For cities, show city name and code if available
        displayName = cityName || locationName
        if (iataCode && iataCode !== cityName) {
          displayName += ` (${iataCode})`
        }
        if (countryCode) displayName += `, ${countryCode}`
      } else {
        // For airports, show code and name
        displayName = iataCode ? `${iataCode} - ${locationName}` : locationName
        if (cityName && cityName !== locationName) {
          displayName += `, ${cityName}`
        }
      }

      return {
        id: location.id,
        type: location.subType, // 'AIRPORT' or 'CITY'
        code: iataCode || location.id,
        name: displayName,
        cityName: cityName,
        airportName: locationName,
        countryCode: countryCode,
        // Use iataCode for both airports and cities (cities have city codes like NYC, PAR)
        airportCode: iataCode || (location.subType === 'CITY' ? null : location.id),
      }
    })

    // Sort: airports first, then cities
    return transformed.sort((a, b) => {
      if (a.type === 'AIRPORT' && b.type === 'CITY') return -1
      if (a.type === 'CITY' && b.type === 'AIRPORT') return 1
      return 0
    })
  }
}

export const amadeusService = new AmadeusService()
