import React, { useState, useMemo } from 'react'
import { Filter, X, DollarSign, MapPin, Plane as PlaneIcon, Clock } from 'lucide-react'

export default function FilterPanel({ flights, onFilterChange }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    stops: [],
    airlines: [],
    maxDuration: 1440, // 24 hours in minutes
  })

  const [isOpen, setIsOpen] = useState(false)

  // Calculate filter options from flights
  const filterOptions = useMemo(() => {
    if (!flights || flights.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 10000,
        airlines: [],
        maxDuration: 1440,
      }
    }

    const prices = flights.map(f => f.price.amount)
    const airlines = [...new Set(flights.map(f => f.airline.code))].map(code => {
      const flight = flights.find(f => f.airline.code === code)
      return {
        code,
        name: flight.airline.name,
        count: flights.filter(f => f.airline.code === code).length,
      }
    })
    const durations = flights.map(f => f.duration)

    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
      airlines: airlines.sort((a, b) => b.count - a.count),
      maxDuration: Math.max(...durations),
    }
  }, [flights])

  // Initialize price range when flights change
  React.useEffect(() => {
    if (flights && flights.length > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
        maxDuration: filterOptions.maxDuration,
      }))
    }
  }, [filterOptions.minPrice, filterOptions.maxPrice, filterOptions.maxDuration, flights])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStopToggle = (stopCount) => {
    const newStops = filters.stops.includes(stopCount)
      ? filters.stops.filter(s => s !== stopCount)
      : [...filters.stops, stopCount]
    handleFilterChange('stops', newStops)
  }

  const handleAirlineToggle = (airlineCode) => {
    const newAirlines = filters.airlines.includes(airlineCode)
      ? filters.airlines.filter(a => a !== airlineCode)
      : [...filters.airlines, airlineCode]
    handleFilterChange('airlines', newAirlines)
  }

  const clearFilters = () => {
    const resetFilters = {
      priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
      stops: [],
      airlines: [],
      maxDuration: filterOptions.maxDuration,
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const activeFilterCount = 
    (filters.stops.length > 0 ? 1 : 0) +
    (filters.airlines.length > 0 ? 1 : 0) +
    (filters.priceRange[0] !== filterOptions.minPrice || filters.priceRange[1] !== filterOptions.maxPrice ? 1 : 0) +
    (filters.maxDuration !== filterOptions.maxDuration ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-stone-700" />
          <h3 className="font-semibold text-stone-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-stone-900 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-stone-500" />
          <label className="text-sm font-semibold text-stone-700">Price Range</label>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={filterOptions.minPrice}
            max={filterOptions.maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filterOptions.minPrice, parseInt(e.target.value)])}
            className="w-full accent-stone-900"
          />
          <div className="flex justify-between text-sm text-stone-600">
            <span>${filterOptions.minPrice}</span>
            <span className="font-semibold text-stone-900">${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-500" />
          <label className="text-sm font-semibold text-stone-700">Number of Stops</label>
        </div>
        <div className="space-y-2">
          {[0, 1, 2].map(stopCount => {
            const count = flights?.filter(f => 
              stopCount === 2 ? f.stops >= 2 : f.stops === stopCount
            ).length || 0
            
            return (
              <label key={stopCount} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stops.includes(stopCount)}
                  onChange={() => handleStopToggle(stopCount)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  disabled={count === 0}
                />
                <span className={`text-sm ${count === 0 ? 'text-stone-400' : 'text-stone-700'}`}>
                  {stopCount === 0 ? 'Nonstop' : stopCount === 1 ? '1 Stop' : '2+ Stops'}
                  <span className="text-stone-400 ml-1">({count})</span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Airlines */}
      {filterOptions.airlines.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PlaneIcon className="w-4 h-4 text-stone-500" />
            <label className="text-sm font-semibold text-stone-700">Airlines</label>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.airlines.map(airline => (
              <label key={airline.code} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline.code)}
                  onChange={() => handleAirlineToggle(airline.code)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span className="text-sm text-stone-700">
                  {airline.name}
                  <span className="text-stone-400 ml-1">({airline.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Duration */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" />
          <label className="text-sm font-semibold text-stone-700">Max Duration</label>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={filterOptions.maxDuration}
            value={filters.maxDuration}
            onChange={(e) => handleFilterChange('maxDuration', parseInt(e.target.value))}
            className="w-full accent-stone-900"
          />
          <div className="flex justify-between text-sm text-stone-600">
            <span>0h</span>
            <span className="font-semibold text-stone-900">
              {Math.floor(filters.maxDuration / 60)}h {filters.maxDuration % 60}m
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-4 bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-stone-700" />
          <span className="font-semibold text-stone-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-stone-900 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-stone-900">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200 sticky top-6">
        <FilterContent />
      </div>
    </>
  )
}
