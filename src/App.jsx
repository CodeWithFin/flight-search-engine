import React, { useState } from 'react'
import SearchForm from './components/SearchForm'
import { Plane } from 'lucide-react'

function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (searchData) => {
    setIsLoading(true)
    console.log('Search data:', searchData)
    
    // Placeholder for API call
    setTimeout(() => {
      setIsLoading(false)
      setSearchResults([])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
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

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-stone-900 font-medium">Searching flights...</span>
            </div>
          </div>
        )}

        {/* Results Placeholder */}
        {searchResults && searchResults.length === 0 && !isLoading && (
          <div className="mt-12 text-center bg-white rounded-3xl p-12 shadow-lg">
            <p className="text-stone-500 text-lg">
              Ready to search for flights. Enter your travel details above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
