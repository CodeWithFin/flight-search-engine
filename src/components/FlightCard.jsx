import React from 'react'
import { Plane, Clock, MapPin } from 'lucide-react'

export default function FlightCard({ flight }) {
  return (
    <div className="group bg-white p-6 rounded-2xl border border-stone-200 hover:shadow-xl transition-all duration-300 hover:border-stone-300">
      {/* Airline Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
            <Plane className="w-5 h-5 text-stone-700" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">{flight.airline.name}</p>
            <p className="text-xs text-stone-500">{flight.airline.code}</p>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <p className="text-3xl font-bold text-stone-900">
            ${flight.price.amount.toFixed(0)}
          </p>
          <p className="text-xs text-stone-500">{flight.price.currency}</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-4">
        {/* Departure */}
        <div>
          <p className="text-2xl font-bold text-stone-900">{flight.departure.time}</p>
          <p className="text-sm font-medium text-stone-700">{flight.departure.airport}</p>
          <p className="text-xs text-stone-500">{flight.departure.date}</p>
        </div>

        {/* Arrow & Duration */}
        <div className="flex flex-col items-center px-4">
          <div className="flex items-center gap-1 text-stone-400 mb-1">
            <div className="w-12 h-px bg-stone-300"></div>
            <Plane className="w-4 h-4" />
            <div className="w-12 h-px bg-stone-300"></div>
          </div>
          <p className="text-xs text-stone-600 whitespace-nowrap">{flight.durationFormatted}</p>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <p className="text-2xl font-bold text-stone-900">{flight.arrival.time}</p>
          <p className="text-sm font-medium text-stone-700">{flight.arrival.airport}</p>
          <p className="text-xs text-stone-500">{flight.arrival.date}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-100">
        {/* Stops */}
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="w-4 h-4 text-stone-500" />
          <span className={`font-medium ${flight.stops === 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {flight.stops === 0 ? 'Nonstop' : `${flight.stops} ${flight.stops === 1 ? 'Stop' : 'Stops'}`}
          </span>
          {flight.stops > 0 && (
            <span className="text-stone-400 text-xs">
              ({flight.stopLocations.join(', ')})
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-sm text-stone-600">
          <Clock className="w-4 h-4 text-stone-500" />
          <span>{flight.durationFormatted}</span>
        </div>

        {/* Cabin Class */}
        <div className="ml-auto">
          <span className="inline-block bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
            {flight.cabinClass.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Best Deal Badge (Optional) */}
      {flight.isBestDeal && (
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Best Deal
          </span>
        </div>
      )}
    </div>
  )
}
