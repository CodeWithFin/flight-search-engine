import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingDown } from 'lucide-react'

export default function PriceGraph({ flights }) {
  const chartData = useMemo(() => {
    if (!flights || flights.length === 0) return []

    // Group flights into price buckets
    const prices = flights.map(f => f.price.amount)
    const minPrice = Math.floor(Math.min(...prices))
    const maxPrice = Math.ceil(Math.max(...prices))
    
    // Create $50 buckets
    const bucketSize = 50
    const buckets = []
    
    for (let i = minPrice; i <= maxPrice; i += bucketSize) {
      const bucketEnd = i + bucketSize
      const flightsInBucket = flights.filter(
        f => f.price.amount >= i && f.price.amount < bucketEnd
      )
      
      if (flightsInBucket.length > 0) {
        buckets.push({
          range: `$${i}-$${bucketEnd}`,
          price: i,
          count: flightsInBucket.length,
          avgPrice: Math.round(
            flightsInBucket.reduce((sum, f) => sum + f.price.amount, 0) / flightsInBucket.length
          ),
        })
      }
    }

    return buckets
  }, [flights])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-stone-900">{payload[0].payload.range}</p>
          <p className="text-sm text-stone-600">{payload[0].value} flights</p>
          <p className="text-sm text-stone-600">Avg: ${payload[0].payload.avgPrice}</p>
        </div>
      )
    }
    return null
  }

  const lowestPriceBucket = chartData.reduce((min, bucket) => 
    bucket.avgPrice < min.avgPrice ? bucket : min
  , chartData[0] || { avgPrice: Infinity })

  if (!flights || flights.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-1">Price Distribution</h3>
          <p className="text-sm text-stone-600">Flight counts across price ranges</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">Best: {lowestPriceBucket?.range}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#78716c', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e7e5e4' }}
          />
          <YAxis 
            tick={{ fill: '#78716c', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e7e5e4' }}
            label={{ value: 'Number of Flights', angle: -90, position: 'insideLeft', fill: '#78716c', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f4' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.price === lowestPriceBucket?.price ? '#15803d' : '#1c1917'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-stone-900 rounded"></div>
            <span className="text-stone-600">Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-stone-600">Best Value</span>
          </div>
        </div>
        <span className="text-stone-500">{flights.length} total flights</span>
      </div>
    </div>
  )
}
