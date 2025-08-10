'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon,
  CubeTransparentIcon,
  LeafIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useGlobalState } from '../providers'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { state, dispatch } = useGlobalState()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')

  const isInWishlist = state.wishlist.some(item => item.id === product.id)
  const isInCart = state.cart.some(item => item.id === product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, selectedColor } })
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
      toast.success('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
      toast.success('Added to wishlist!', { icon: '❤️' })
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product })
    toast.success('Quick view opened!', { icon: '👀' })
  }

  const handleARPreview = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch({ type: 'TOGGLE_AR' })
    toast.success('AR Preview activated!', { icon: '🥽' })
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="flex p-6">
            {/* Product Image */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-xl"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <FireIcon className="w-3 h-3 mr-1" />
                    HOT
                  </span>
                )}
                {product.isEcoFriendly && (
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <LeafIcon className="w-3 h-3 mr-1" />
                    ECO
                  </span>
                )}
              </div>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 ml-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    by {product.brand}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleWishlist}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isInWishlist ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleQuickView}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  
                  {product.arAvailable && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleARPreview}
                      className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full hover:from-accent-600 hover:to-accent-700 transition-all"
                    >
                      <CubeTransparentIcon className="w-5 h-5 text-white" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Sustainability Info */}
              {state.sustainabilityMode && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 dark:text-green-400">
                      Sustainability: {product.sustainabilityScore}/100
                    </span>
                    <span className="text-green-600 dark:text-green-500">
                      {product.carbonFootprint}kg CO₂
                    </span>
                  </div>
                </div>
              )}

              {/* Price and Stock */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock 
                      ? `${product.stockCount} in stock` 
                      : 'Out of stock'
                    }
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    product.inStock
                      ? 'btn-primary'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                  {isInCart ? 'In Cart' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                NEW
              </motion.span>
            )}
            {product.isTrending && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center"
              >
                <FireIcon className="w-3 h-3 mr-1" />
                HOT
              </motion.span>
            )}
            {product.isEcoFriendly && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center"
              >
                <LeafIcon className="w-3 h-3 mr-1" />
                ECO
              </motion.span>
            )}
            {product.discount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                -{product.discount}%
              </motion.span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute top-4 right-4 flex flex-col gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isInWishlist ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            
            {product.arAvailable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleARPreview}
                className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                title="AR Preview"
              >
                <CubeTransparentIcon className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-6 py-3 rounded-full shadow-xl font-medium transition-all duration-200 ${
                product.inStock
                  ? 'btn-primary'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </motion.button>
          </motion.div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
            {product.name}
          </h3>

          {/* Brand */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by {product.brand}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Colors:</p>
              <div className="flex space-x-2">
                {product.colors.slice(0, 4).map((color, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedColor(color)
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-primary-500 scale-110'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'blue' ? '#3b82f6' :
                                     color.toLowerCase() === 'green' ? '#22c55e' :
                                     color.toLowerCase() === 'pink' ? '#ec4899' :
                                     color.toLowerCase() === 'gray' ? '#6b7280' :
                                     color.toLowerCase() === 'navy' ? '#1e40af' :
                                     color.toLowerCase() === 'wood' ? '#92400e' :
                                     '#6b7280'
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sustainability Info */}
          {state.sustainabilityMode && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700 dark:text-green-400">
                  Sustainability: {product.sustainabilityScore}/100
                </span>
                <span className="text-green-600 dark:text-green-500">
                  {product.carbonFootprint}kg CO₂
                </span>
              </div>
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {product.inStock && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {product.stockCount} left
                </p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-3 rounded-full transition-all duration-200 ${
                product.inStock
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}