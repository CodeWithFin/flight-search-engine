import React, { useState } from 'react'
import SearchForm from './components/SearchForm'
import FlightList from './components/FlightList'
import FilterPanel from './components/FilterPanel'
import PriceGraph from './components/PriceGraph'
import { Plane } from 'lucide-react'
import { amadeusService } from './services/amadeus'
import { useFilteredFlights, useSortedFlights } from './hooks/useFlightFilters'

function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    stops: [],
    airlines: [],
    maxDuration: 1440,
  })
  const [sortBy, setSortBy] = useState('price-asc')

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

  const filteredFlights = useFilteredFlights(searchResults, filters)
  const sortedFlights = useSortedFlights(filteredFlights, sortBy)

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

        {/* Flight Results with Filters */}
        {(searchResults !== null || isLoading) && (
          <div className="mt-12 px-4 sm:px-6">
            {/* Price Graph */}
            {searchResults && searchResults.length > 0 && !isLoading && (
              <div className="mb-8">
                <PriceGraph flights={filteredFlights} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              {/* Filter Sidebar */}
              {searchResults && searchResults.length > 0 && (
                <FilterPanel flights={searchResults} onFilterChange={setFilters} />
              )}

              {/* Flight List */}
              <div className="lg:col-start-2">
                {/* Sort Options */}
                {sortedFlights && sortedFlights.length > 0 && (
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-stone-600">
                      Showing <span className="font-semibold text-stone-900">{sortedFlights.length}</span> of {searchResults?.length || 0} flights
                    </p>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-700 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="duration-asc">Duration: Shortest</option>
                      <option value="duration-desc">Duration: Longest</option>
                      <option value="departure-asc">Departure: Earliest</option>
                      <option value="departure-desc">Departure: Latest</option>
                    </select>
                  </div>
                )}
                
                <FlightList flights={sortedFlights} isLoading={isLoading} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
