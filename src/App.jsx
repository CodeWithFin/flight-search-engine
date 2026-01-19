import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="sm:p-4 lg:p-6 max-w-[1600px] mx-auto pt-2 px-2 pb-2">
        <header className="min-h-[400px] bg-stone-900 rounded-[2rem] relative shadow-2xl p-6 text-white">
          <div className="flex justify-between items-center mb-12">
            <span className="text-lg font-medium tracking-tight">FlightSearch</span>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-medium tracking-tight mb-6">
              Find Your Perfect Flight
            </h1>
            <p className="text-lg font-light text-white/80 max-w-lg">
              Search, compare, and book flights with real-time pricing and powerful filtering.
            </p>
          </div>
        </header>
      </div>
    </div>
  )
}

export default App
