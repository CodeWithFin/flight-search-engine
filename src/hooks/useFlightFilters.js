import { useMemo } from 'react'

export function useFilteredFlights(flights, filters) {
  return useMemo(() => {
    if (!flights || flights.length === 0) return []

    return flights.filter(flight => {
      // Price filter
      if (flight.price.amount < filters.priceRange[0] || flight.price.amount > filters.priceRange[1]) {
        return false
      }

      // Stops filter
      if (filters.stops.length > 0) {
        const flightStops = flight.stops >= 2 ? 2 : flight.stops
        if (!filters.stops.includes(flightStops)) {
          return false
        }
      }

      // Airlines filter
      if (filters.airlines.length > 0) {
        if (!filters.airlines.includes(flight.airline.code)) {
          return false
        }
      }

      // Duration filter
      if (flight.duration > filters.maxDuration) {
        return false
      }

      return true
    })
  }, [flights, filters])
}

export function useSortedFlights(flights, sortBy) {
  return useMemo(() => {
    if (!flights || flights.length === 0) return []

    const sorted = [...flights]

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price.amount - b.price.amount)
      case 'price-desc':
        return sorted.sort((a, b) => b.price.amount - a.price.amount)
      case 'duration-asc':
        return sorted.sort((a, b) => a.duration - b.duration)
      case 'duration-desc':
        return sorted.sort((a, b) => b.duration - a.duration)
      case 'departure-asc':
        return sorted.sort((a, b) => new Date(a.departure.dateTime) - new Date(b.departure.dateTime))
      case 'departure-desc':
        return sorted.sort((a, b) => new Date(b.departure.dateTime) - new Date(a.departure.dateTime))
      default:
        return sorted
    }
  }, [flights, sortBy])
}
