import React from 'react'
import FlightCard from './FlightCard'

export default function FlightList({ flights, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                <div>
                  <div className="h-4 w-32 bg-stone-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-stone-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-24 bg-stone-200 rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="h-16 bg-stone-200 rounded"></div>
              <div className="h-16 bg-stone-200 rounded"></div>
              <div className="h-16 bg-stone-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
        <p className="text-stone-500 text-lg">No flights found. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-stone-600">
          Showing <span className="font-semibold text-stone-900">{flights.length}</span> flights
        </p>
      </div>

      {/* Flight Cards */}
      {flights.map(flight => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  )
}
