'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  MicrophoneIcon,
  XMarkIcon,
  ClockIcon,
  TrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'

export default function SearchBar() {
  const { state, dispatch } = useGlobalState()
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Mock suggestions data
  const trendingSuggestions = [
    'Wireless earbuds',
    'Smart home devices',
    'Sustainable fashion',
    'Gaming accessories',
    'Fitness trackers'
  ]

  const aiSuggestions = [
    'Products similar to your recent purchases',
    'Eco-friendly alternatives',
    'Items trending in your area',
    'Recommended for your style'
  ]

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        handleSearch(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true)
      // Simulate API call for suggestions
      const timer = setTimeout(() => {
        const filtered = trendingSuggestions.filter(item =>
          item.toLowerCase().includes(query.toLowerCase())
        )
        setSuggestions(filtered)
        setShowSuggestions(true)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
    }
  }, [query])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: searchQuery.trim() })
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const startVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          placeholder="Search for products, brands, or categories..."
          className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startVoiceSearch}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
            title="Voice Search"
          >
            <MicrophoneIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {/* Search History */}
                {state.searchHistory.length > 0 && query.length === 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h4>
                    {state.searchHistory.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {/* Query Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Suggestions
                    </h4>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 inline mr-2 text-gray-400" />
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                {query.length === 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <TrendingUpIcon className="h-4 w-4 mr-2" />
                      Trending Now
                    </h4>
                    {trendingSuggestions.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {/* AI Suggestions */}
                {query.length === 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      AI Suggestions
                    </h4>
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Search Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}