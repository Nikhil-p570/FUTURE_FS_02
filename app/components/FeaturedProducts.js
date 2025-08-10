'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon,
  CubeTransparentIcon,
  LeafIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useGlobalState } from '../providers'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function FeaturedProducts() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Mock product data with enhanced features
  const products = [
    {
      id: 1,
      name: 'Smart Wireless Earbuds Pro',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      category: 'electronics',
      rating: 4.8,
      reviews: 1247,
      isNew: true,
      isTrending: true,
      sustainabilityScore: 85,
      carbonFootprint: 2.1,
      features: ['Noise Cancellation', 'Wireless Charging', '30h Battery'],
      colors: ['Black', 'White', 'Blue'],
      arAvailable: true,
      discount: 20
    },
    {
      id: 2,
      name: 'Eco-Friendly Water Bottle',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      category: 'lifestyle',
      rating: 4.6,
      reviews: 892,
      isEcoFriendly: true,
      sustainabilityScore: 95,
      carbonFootprint: 0.5,
      features: ['BPA Free', 'Insulated', 'Leak Proof'],
      colors: ['Green', 'Blue', 'Pink'],
      arAvailable: true,
      discount: 25
    },
    {
      id: 3,
      name: 'Gaming Mechanical Keyboard',
      price: 149.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      category: 'electronics',
      rating: 4.9,
      reviews: 2156,
      isTrending: true,
      sustainabilityScore: 70,
      carbonFootprint: 3.2,
      features: ['RGB Backlight', 'Mechanical Switches', 'Programmable'],
      colors: ['Black', 'White'],
      arAvailable: false,
      discount: 17
    },
    {
      id: 4,
      name: 'Minimalist Desk Lamp',
      price: 89.99,
      originalPrice: 109.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      category: 'home',
      rating: 4.7,
      reviews: 634,
      isNew: true,
      sustainabilityScore: 80,
      carbonFootprint: 1.8,
      features: ['LED', 'Touch Control', 'USB Charging'],
      colors: ['White', 'Black', 'Wood'],
      arAvailable: true,
      discount: 18
    },
    {
      id: 5,
      name: 'Organic Cotton T-Shirt',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category: 'fashion',
      rating: 4.5,
      reviews: 445,
      isEcoFriendly: true,
      sustainabilityScore: 90,
      carbonFootprint: 1.2,
      features: ['Organic Cotton', 'Fair Trade', 'Soft Feel'],
      colors: ['White', 'Black', 'Gray', 'Navy'],
      arAvailable: true,
      discount: 29
    },
    {
      id: 6,
      name: 'Smart Fitness Tracker',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      category: 'electronics',
      rating: 4.4,
      reviews: 1089,
      isTrending: true,
      sustainabilityScore: 75,
      carbonFootprint: 2.5,
      features: ['Heart Rate', 'Sleep Tracking', '7-day Battery'],
      colors: ['Black', 'Pink', 'Blue'],
      arAvailable: false,
      discount: 20
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'fashion', name: 'Fashion', icon: '👕' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item.id === productId)
  }

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
      toast.success('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
      toast.success('Added to wishlist!', { icon: '❤️' })
    }
  }

  const handleQuickView = (product) => {
    dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product })
    // Open quick view modal (implementation would go here)
    toast.success('Quick view opened!', { icon: '👀' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <section id="featured-products" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Featured Products</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our handpicked selection of innovative products, 
            enhanced with AI recommendations and sustainability insights.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
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
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {product.isTrending && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <FireIcon className="w-3 h-3 mr-1" />
                        TRENDING
                      </span>
                    )}
                    {product.isEcoFriendly && (
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <LeafIcon className="w-3 h-3 mr-1" />
                        ECO
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleWishlist(product)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuickView(product)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    
                    {product.arAvailable && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                        title="AR Preview"
                      >
                        <CubeTransparentIcon className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  >
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: hoveredProduct === product.id ? 1 : 0 }}
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary px-6 py-3 rounded-full shadow-xl"
                    >
                      <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                      Add to Cart
                    </motion.button>
                  </motion.div>
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

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 2).map((feature, index) => (
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
                    <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-700 dark:text-green-400">
                          Sustainability: {product.sustainabilityScore}/100
                        </span>
                        <span className="text-green-600 dark:text-green-500">
                          {product.carbonFootprint}kg CO₂
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
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
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors duration-200"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3 rounded-full"
          >
            <BoltIcon className="w-5 h-5 inline mr-2" />
            Load More Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}