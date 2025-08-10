'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import { useGlobalState } from '../providers'

export default function ProductsPage() {
  const { state } = useGlobalState()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    brand: [],
    features: [],
    sustainability: false,
    inStock: true
  })

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Smart Wireless Earbuds Pro',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      category: 'electronics',
      brand: 'TechPro',
      rating: 4.8,
      reviews: 1247,
      isNew: true,
      isTrending: true,
      sustainabilityScore: 85,
      carbonFootprint: 2.1,
      features: ['Noise Cancellation', 'Wireless Charging', '30h Battery'],
      colors: ['Black', 'White', 'Blue'],
      arAvailable: true,
      discount: 20,
      inStock: true,
      stockCount: 45
    },
    {
      id: 2,
      name: 'Eco-Friendly Water Bottle',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      category: 'lifestyle',
      brand: 'EcoLife',
      rating: 4.6,
      reviews: 892,
      isEcoFriendly: true,
      sustainabilityScore: 95,
      carbonFootprint: 0.5,
      features: ['BPA Free', 'Insulated', 'Leak Proof'],
      colors: ['Green', 'Blue', 'Pink'],
      arAvailable: true,
      discount: 25,
      inStock: true,
      stockCount: 128
    },
    {
      id: 3,
      name: 'Gaming Mechanical Keyboard',
      price: 149.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      category: 'electronics',
      brand: 'GameMaster',
      rating: 4.9,
      reviews: 2156,
      isTrending: true,
      sustainabilityScore: 70,
      carbonFootprint: 3.2,
      features: ['RGB Backlight', 'Mechanical Switches', 'Programmable'],
      colors: ['Black', 'White'],
      arAvailable: false,
      discount: 17,
      inStock: true,
      stockCount: 23
    },
    {
      id: 4,
      name: 'Minimalist Desk Lamp',
      price: 89.99,
      originalPrice: 109.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      category: 'home',
      brand: 'MinimalCo',
      rating: 4.7,
      reviews: 634,
      isNew: true,
      sustainabilityScore: 80,
      carbonFootprint: 1.8,
      features: ['LED', 'Touch Control', 'USB Charging'],
      colors: ['White', 'Black', 'Wood'],
      arAvailable: true,
      discount: 18,
      inStock: true,
      stockCount: 67
    },
    {
      id: 5,
      name: 'Organic Cotton T-Shirt',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category: 'fashion',
      brand: 'EcoWear',
      rating: 4.5,
      reviews: 445,
      isEcoFriendly: true,
      sustainabilityScore: 90,
      carbonFootprint: 1.2,
      features: ['Organic Cotton', 'Fair Trade', 'Soft Feel'],
      colors: ['White', 'Black', 'Gray', 'Navy'],
      arAvailable: true,
      discount: 29,
      inStock: true,
      stockCount: 234
    },
    {
      id: 6,
      name: 'Smart Fitness Tracker',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      category: 'electronics',
      brand: 'FitTech',
      rating: 4.4,
      reviews: 1089,
      isTrending: true,
      sustainabilityScore: 75,
      carbonFootprint: 2.5,
      features: ['Heart Rate', 'Sleep Tracking', '7-day Battery'],
      colors: ['Black', 'Pink', 'Blue'],
      arAvailable: false,
      discount: 20,
      inStock: false,
      stockCount: 0
    }
  ]

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(product =>
        filters.category.includes(product.category)
      )
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(product =>
        filters.brand.includes(product.brand)
      )
    }

    // Apply sustainability filter
    if (filters.sustainability) {
      filtered = filtered.filter(product => product.sustainabilityScore >= 80)
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew)
        break
      case 'popularity':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, filters, sortBy])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      brand: [],
      features: [],
      sustainability: false,
      inStock: true
    })
    setSearchQuery('')
  }

  const activeFiltersCount = 
    filters.category.length +
    filters.brand.length +
    filters.features.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.sustainability ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Loading amazing products...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-display font-bold gradient-text mb-4">
              Discover Products
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore our curated collection of innovative products with AI-powered recommendations
            </p>
          </motion.div>

          {/* Search and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Filters ({activeFiltersCount})
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.category.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {category}
                    <button
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        category: prev.category.filter(c => c !== category)
                      }))}
                      className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Add other active filter chips here */}
              </div>
            </motion.div>
          )}

          <div className="flex gap-8">
            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="w-80 flex-shrink-0"
                >
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    products={products}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid/List */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                
                {searchQuery && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Products */}
              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary px-6 py-2 rounded-lg"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                        : 'space-y-6'
                    }
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard 
                          product={product} 
                          viewMode={viewMode}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load More */}
              {filteredProducts.length > 0 && filteredProducts.length >= 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-3 rounded-full"
                  >
                    Load More Products
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}