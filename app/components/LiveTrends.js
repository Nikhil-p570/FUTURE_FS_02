'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  TrendingUpIcon,
  FireIcon,
  ClockIcon,
  MapPinIcon,
  EyeIcon,
  ShoppingCartIcon,
  HeartIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import Image from 'next/image'

export default function LiveTrends() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [trendingData, setTrendingData] = useState([])

  // Mock trending data
  const mockTrendingData = {
    '24h': [
      {
        id: 1,
        name: 'Wireless Noise-Canceling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        category: 'electronics',
        price: 299.99,
        priceChange: -15,
        views: 15420,
        viewsChange: 234,
        purchases: 89,
        purchasesChange: 45,
        trendScore: 95,
        location: 'Global',
        reasons: ['Black Friday deals', 'Influencer mentions', 'New model release']
      },
      {
        id: 2,
        name: 'Sustainable Bamboo Phone Case',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300',
        category: 'accessories',
        price: 24.99,
        priceChange: 0,
        views: 8930,
        viewsChange: 156,
        purchases: 234,
        purchasesChange: 78,
        trendScore: 88,
        location: 'North America',
        reasons: ['Eco-friendly trend', 'Social media buzz', 'Celebrity endorsement']
      },
      {
        id: 3,
        name: 'Smart Fitness Tracker',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300',
        category: 'fitness',
        price: 149.99,
        priceChange: -10,
        views: 12340,
        viewsChange: 189,
        purchases: 156,
        purchasesChange: 67,
        trendScore: 82,
        location: 'Europe',
        reasons: ['New Year fitness goals', 'Health awareness', 'App integration']
      },
      {
        id: 4,
        name: 'Minimalist Desk Setup Kit',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
        category: 'home',
        price: 199.99,
        priceChange: 5,
        views: 9876,
        viewsChange: 123,
        purchases: 98,
        purchasesChange: 34,
        trendScore: 76,
        location: 'Asia',
        reasons: ['Work from home trend', 'Productivity focus', 'Aesthetic appeal']
      }
    ],
    '7d': [
      {
        id: 5,
        name: 'Electric Scooter',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
        category: 'transport',
        price: 599.99,
        priceChange: -8,
        views: 45230,
        viewsChange: 1234,
        purchases: 567,
        purchasesChange: 234,
        trendScore: 92,
        location: 'Global',
        reasons: ['Urban mobility', 'Environmental concerns', 'Government incentives']
      }
    ],
    '30d': [
      {
        id: 6,
        name: 'Smart Home Hub',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
        category: 'smart-home',
        price: 129.99,
        priceChange: -20,
        views: 89450,
        viewsChange: 2345,
        purchases: 1234,
        purchasesChange: 456,
        trendScore: 89,
        location: 'Global',
        reasons: ['Smart home adoption', 'Holiday season', 'Tech integration']
      }
    ]
  }

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'accessories', name: 'Accessories', icon: '👜' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'home', name: 'Home & Office', icon: '🏠' },
    { id: 'fashion', name: 'Fashion', icon: '👕' }
  ]

  const timeframes = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' }
  ]

  useEffect(() => {
    const data = mockTrendingData[selectedTimeframe] || []
    const filteredData = selectedCategory === 'all' 
      ? data 
      : data.filter(item => item.category === selectedCategory)
    
    setTrendingData(filteredData)
  }, [selectedCategory, selectedTimeframe])

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const handleToggleWishlist = (product) => {
    const isInWishlist = state.wishlist.some(item => item.id === product.id)
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
    }
  }

  const TrendIndicator = ({ score }) => {
    const getColor = (score) => {
      if (score >= 90) return 'text-red-500'
      if (score >= 80) return 'text-orange-500'
      if (score >= 70) return 'text-yellow-500'
      return 'text-green-500'
    }

    const getIntensity = (score) => {
      if (score >= 90) return 'Very Hot'
      if (score >= 80) return 'Hot'
      if (score >= 70) return 'Trending'
      return 'Rising'
    }

    return (
      <div className={`flex items-center ${getColor(score)}`}>
        <FireIcon className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{getIntensity(score)}</span>
      </div>
    )
  }

  const StatChange = ({ value, change, suffix = '' }) => (
    <div className="text-center">
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}{suffix}
      </p>
      <div className={`flex items-center justify-center text-sm ${
        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
      }`}>
        {change > 0 ? '↗' : change < 0 ? '↘' : '→'} {Math.abs(change)}
      </div>
    </div>
  )

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4"
            >
              <TrendingUpIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Live Trends
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover what's hot right now! Real-time insights into trending products, 
            viral items, and emerging shopping patterns from around the world.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-center mb-12 space-y-4 lg:space-y-0"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Timeframe Filter */}
          <div className="flex bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
            {timeframes.map((timeframe) => (
              <motion.button
                key={timeframe.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {timeframe.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Global Trending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <GlobeAltIcon className="w-6 h-6 text-orange-500 mr-2" />
            Global Trending Insights
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                2.4M
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Views Today
              </p>
              <div className="text-green-600 text-sm mt-1">↗ +12%</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                15.6K
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Purchases
              </p>
              <div className="text-green-600 text-sm mt-1">↗ +8%</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                847
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Viral Products
              </p>
              <div className="text-green-600 text-sm mt-1">↗ +23%</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                94%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accuracy Rate
              </p>
              <div className="text-green-600 text-sm mt-1">↗ +2%</div>
            </div>
          </div>
        </motion.div>

        {/* Trending Products */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedTimeframe}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {trendingData.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="rounded-xl object-cover"
                    />
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                      </h3>
                      <TrendIndicator score={product.trendScore} />
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                      {product.priceChange !== 0 && (
                        <span className={`text-sm font-medium ${
                          product.priceChange < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.priceChange < 0 ? '↓' : '↑'} {Math.abs(product.priceChange)}%
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <StatChange 
                        value={product.views} 
                        change={product.viewsChange}
                        suffix=""
                      />
                      <StatChange 
                        value={product.purchases} 
                        change={product.purchasesChange}
                        suffix=""
                      />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {product.trendScore}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Trend Score
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      Trending in {product.location}
                    </div>

                    {/* Trending Reasons */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Why it's trending:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 btn-primary py-2 rounded-lg text-sm"
                      >
                        <ShoppingCartIcon className="w-4 h-4 inline mr-1" />
                        Add to Cart
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleWishlist(product)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <HeartIcon className={`w-5 h-5 ${
                          state.wishlist.some(item => item.id === product.id)
                            ? 'text-red-500 fill-current'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Real-time Updates Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
              <BoltIcon className="w-6 h-6 text-orange-500 mr-2" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Live Updates
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Trends update every 5 minutes based on real-time shopping data, 
              social media mentions, and AI-powered pattern recognition.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}