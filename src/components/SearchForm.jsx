import React, { useState } from 'react'
import { Search, Calendar, Users } from 'lucide-react'
import LocationInput from './LocationInput'

export default function SearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'ECONOMY',
    tripType: 'round-trip'
  })

  // Store selected location objects with airport codes
  const [originLocation, setOriginLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.origin || !formData.destination || !formData.departureDate) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      alert('Please select a return date for round-trip flights')
      return
    }

    // Extract airport codes from selected locations, or use direct input if it's a 3-letter code
    let originCode = ''
    let destinationCode = ''

    if (originLocation) {
      originCode = originLocation.airportCode || originLocation.code
    } else {
      // Fallback: if input is exactly 3 uppercase letters, treat as airport code
      const originUpper = formData.origin.trim().toUpperCase()
      if (originUpper.length === 3 && /^[A-Z]{3}$/.test(originUpper)) {
        originCode = originUpper
      }
    }

    if (destinationLocation) {
      destinationCode = destinationLocation.airportCode || destinationLocation.code
    } else {
      // Fallback: if input is exactly 3 uppercase letters, treat as airport code
      const destUpper = formData.destination.trim().toUpperCase()
      if (destUpper.length === 3 && /^[A-Z]{3}$/.test(destUpper)) {
        destinationCode = destUpper
      }
    }

    if (!originCode || !destinationCode) {
      alert('Please select valid origin and destination locations from the suggestions, or enter valid 3-letter airport codes')
      return
    }

    // Submit with airport codes
    onSearch({
      ...formData,
      origin: originCode,
      destination: destinationCode,
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Toggle */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('tripType', 'round-trip')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              formData.tripType === 'round-trip'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('tripType', 'one-way')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              formData.tripType === 'one-way'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            One Way
          </button>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LocationInput
            label="From"
            value={formData.origin}
            onChange={(value) => {
              handleInputChange('origin', value)
              // Clear location if user manually types something different
              if (!value || (originLocation && originLocation.name !== value)) {
                setOriginLocation(null)
              }
            }}
            onLocationSelect={(location) => {
              setOriginLocation(location)
              handleInputChange('origin', location.name)
            }}
            placeholder="New York or JFK"
          />

          <LocationInput
            label="To"
            value={formData.destination}
            onChange={(value) => {
              handleInputChange('destination', value)
              // Clear location if user manually types something different
              if (!value || (destinationLocation && destinationLocation.name !== value)) {
                setDestinationLocation(null)
              }
            }}
            onLocationSelect={(location) => {
              setDestinationLocation(location)
              handleInputChange('destination', location.name)
            }}
            placeholder="Los Angeles or LAX"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-stone-50 border-0 rounded-xl pl-12 pr-4 py-3 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none transition-shadow"
              />
            </div>
          </div>

          {formData.tripType === 'round-trip' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Return Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  min={formData.departureDate || new Date().toISOString().split('T')[0]}
                  className="w-full bg-stone-50 border-0 rounded-xl pl-12 pr-4 py-3 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none transition-shadow"
                />
              </div>
            </div>
          )}
        </div>

        {/* Passengers and Cabin Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <select
                value={formData.passengers}
                onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                className="w-full bg-stone-50 border-0 rounded-xl pl-12 pr-4 py-3 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none transition-shadow appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Cabin Class
            </label>
            <select
              value={formData.cabinClass}
              onChange={(e) => handleInputChange('cabinClass', e.target.value)}
              className="w-full bg-stone-50 border-0 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:outline-none transition-shadow appearance-none cursor-pointer"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group shadow-lg"
        >
          <Search className="w-5 h-5" />
          Search Flights
        </button>
      </form>
    </div>
  )
}
