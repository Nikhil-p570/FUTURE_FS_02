'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  StarIcon,
  LeafIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export default function FilterPanel({ filters, onFiltersChange, products }) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    brand: false,
    features: false,
    sustainability: false
  })

  // Extract unique values from products
  const categories = [...new Set(products.map(p => p.category))]
  const brands = [...new Set(products.map(p => p.brand))]
  const allFeatures = [...new Set(products.flatMap(p => p.features || []))]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category]
    
    onFiltersChange({ ...filters, category: newCategories })
  }

  const handleBrandChange = (brand) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand]
    
    onFiltersChange({ ...filters, brand: newBrands })
  }

  const handleFeatureChange = (feature) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    
    onFiltersChange({ ...filters, features: newFeatures })
  }

  const handlePriceChange = (value, index) => {
    const newPriceRange = [...filters.priceRange]
    newPriceRange[index] = parseFloat(value)
    onFiltersChange({ ...filters, priceRange: newPriceRange })
  }

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, rating: rating === filters.rating ? 0 : rating })
  }

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={() => onFiltersChange({
            category: [],
            priceRange: [0, 1000],
            rating: 0,
            brand: [],
            features: [],
            sustainability: false,
            inStock: true
          })}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-3">
          {categories.map(category => (
            <label
              key={category}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                  filters.category.includes(category)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                }`}>
                  {filters.category.includes(category) && (
                    <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-gray-700 dark:text-gray-300 capitalize group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {category}
              </span>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                ({products.filter(p => p.category === category).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Min
              </label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e.target.value, 0)}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                min="0"
                max="1000"
              />
            </div>
            <div className="text-gray-400">-</div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Max
              </label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e.target.value, 1)}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                min="0"
                max="1000"
              />
            </div>
          </div>
          
          {/* Price Range Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(e.target.value, 1)}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection
        title="Minimum Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 ${
                filters.rating === rating
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                & up
              </span>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                ({products.filter(p => p.rating >= rating).length})
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection
        title="Brand"
        isExpanded={expandedSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="space-y-3">
          {brands.map(brand => (
            <label
              key={brand}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                  filters.brand.includes(brand)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                }`}>
                  {filters.brand.includes(brand) && (
                    <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {brand}
              </span>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                ({products.filter(p => p.brand === brand).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Features Filter */}
      <FilterSection
        title="Features"
        isExpanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      >
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {allFeatures.slice(0, 10).map(feature => (
            <label
              key={feature}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                  filters.features.includes(feature)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
                }`}>
                  {filters.features.includes(feature) && (
                    <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sustainability Filter */}
      <FilterSection
        title="Sustainability"
        isExpanded={expandedSections.sustainability}
        onToggle={() => toggleSection('sustainability')}
      >
        <div className="space-y-4">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.sustainability}
                onChange={(e) => onFiltersChange({ ...filters, sustainability: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                filters.sustainability
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-green-400'
              }`}>
                {filters.sustainability && (
                  <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                )}
              </div>
            </div>
            <LeafIcon className="w-4 h-4 ml-3 mr-2 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              Eco-Friendly Only
            </span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                filters.inStock
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-400'
              }`}>
                {filters.inStock && (
                  <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                )}
              </div>
            </div>
            <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              In Stock Only
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Filter Summary */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>Showing products that match your criteria</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary py-3 rounded-lg"
        >
          Apply Filters
        </motion.button>
      </div>
    </div>
  )
}