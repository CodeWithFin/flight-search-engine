import React, { useState } from 'react'
import SearchForm from './components/SearchForm'
import FlightList from './components/FlightList'
import { Plane } from 'lucide-react'
import { amadeusService } from './services/amadeus'

function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (searchData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const flights = await amadeusService.searchFlights(searchData)
      setSearchResults(flights)
    } catch (err) {
      setError(err.message || 'Failed to search flights. Please try again.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-12">
      <div className="sm:p-4 lg:p-6 max-w-[1600px] mx-auto pt-2 px-2 pb-2">
        {/* Hero Header */}
        <header className="min-h-[500px] bg-stone-900 rounded-[2rem] relative shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 flex justify-between items-center p-6 sm:px-10">
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-white" />
              <span className="text-lg font-medium text-white tracking-tight">FlightSearch</span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative z-10 px-6 sm:px-10 pb-12">
            <div className="max-w-2xl mb-8">
              <span className="inline-block uppercase text-xs font-medium text-white tracking-wider bg-white/20 border-white/10 border rounded-full mb-4 pt-1 pr-3 pb-1 pl-3 backdrop-blur-md">
                Flight Search Engine
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-medium text-white tracking-tight mb-6">
                Find Your Perfect Flight
              </h1>
              <p className="text-lg font-light text-white/80 max-w-lg">
                Search, compare, and book flights with real-time pricing insights and powerful filtering.
              </p>
            </div>
          </div>
        </header>

        {/* Search Form */}
        <div className="mt-[-80px] relative z-20 px-4 sm:px-6">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-6 mx-4 sm:mx-6">
            <p className="text-red-800 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-2">Please check your search criteria and try again.</p>
          </div>
        )}

        {/* Flight Results */}
        {(searchResults !== null || isLoading) && (
          <div className="mt-12 px-4 sm:px-6">
            <FlightList flights={searchResults} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
