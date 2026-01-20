import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { amadeusService } from '../services/amadeus'

export default function LocationInput({ 
  label, 
  value, 
  onChange, 
  placeholder,
  onLocationSelect 
}) {
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    // Debounce search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (inputValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await amadeusService.searchLocations(inputValue)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    setShowSuggestions(true)
  }

  const handleSelect = (location) => {
    setInputValue(location.name)
    onChange(location.name)
    if (onLocationSelect) {
      onLocationSelect(location)
    }
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex])
        } else if (suggestions.length === 1) {
          handleSelect(suggestions[0])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleBlur = (e) => {
    // Delay to allow click events on suggestions
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false)
      }
    }, 200)
  }

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="space-y-1 relative">
      {label && (
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 animate-spin" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-stone-50 border-0 rounded-xl pl-12 pr-4 py-3 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-stone-900 focus:outline-none transition-shadow"
          autoComplete="off"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, index) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelect(location)}
                className={`w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors ${
                  index === selectedIndex ? 'bg-stone-100' : ''
                } ${index !== suggestions.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${
                    location.type === 'AIRPORT' ? 'text-stone-600' : 'text-stone-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-900 truncate">
                      {location.name}
                    </div>
                    {location.type === 'AIRPORT' && location.cityName && (
                      <div className="text-xs text-stone-500 truncate">
                        {location.cityName}
                      </div>
                    )}
                    {location.type === 'CITY' && (
                      <div className="text-xs text-stone-500 truncate">
                        City
                      </div>
                    )}
                  </div>
                  {location.code && (
                    <span className={`text-xs font-mono px-2 py-1 rounded flex-shrink-0 ${
                      location.type === 'AIRPORT' 
                        ? 'text-stone-700 bg-stone-100 font-semibold' 
                        : 'text-stone-500 bg-stone-50'
                    }`}>
                      {location.code}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
