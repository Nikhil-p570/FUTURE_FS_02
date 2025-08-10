'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  UserIcon,
  ClockIcon,
  TrendingUpIcon,
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AIRecommendations() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [activeTab, setActiveTab] = useState('personalized')
  const [isLoading, setIsLoading] = useState(false)

  const tabs = [
    {
      id: 'personalized',
      name: 'For You',
      icon: UserIcon,
      description: 'AI-curated based on your preferences'
    },
    {
      id: 'trending',
      name: 'Trending',
      icon: TrendingUpIcon,
      description: 'Popular items in your area'
    },
    {
      id: 'similar',
      name: 'Similar Items',
      icon: LightBulbIcon,
      description: 'Based on your recent views'
    },
    {
      id: 'predictive',
      name: 'You Might Need',
      icon: ChartBarIcon,
      description: 'Predictive shopping suggestions'
    }
  ]

  // Enhanced recommendation data with AI insights
  const recommendations = {
    personalized: [
      {
        id: 101,
        name: 'Premium Noise-Canceling Headphones',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        confidence: 0.95,
        reason: 'Based on your recent tech purchases and music listening habits',
        aiInsights: ['Perfect for your daily commute', 'Matches your premium preferences'],
        rating: 4.8,
        reviews: 2341,
        discount: 15,
        tags: ['Premium', 'Tech', 'Audio']
      },
      {
        id: 102,
        name: 'Ergonomic Office Chair',
        price: 449.99,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        confidence: 0.88,
        reason: 'Your work-from-home setup could benefit from better ergonomics',
        aiInsights: ['Reduces back strain', 'Improves productivity'],
        rating: 4.6,
        reviews: 1876,
        discount: 20,
        tags: ['Ergonomic', 'Office', 'Health']
      },
      {
        id: 103,
        name: 'Smart Plant Monitoring System',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        confidence: 0.82,
        reason: 'Perfect for your interest in sustainable living',
        aiInsights: ['Automates plant care', 'Eco-friendly technology'],
        rating: 4.4,
        reviews: 892,
        discount: 10,
        tags: ['Smart Home', 'Plants', 'Eco']
      }
    ],
    trending: [
      {
        id: 201,
        name: 'Viral TikTok LED Strip Lights',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        confidence: 0.92,
        reason: 'Trending in your age group and location',
        aiInsights: ['#1 in home decor', '500% increase in searches'],
        rating: 4.3,
        reviews: 5432,
        discount: 30,
        tags: ['Trending', 'Decor', 'LED']
      },
      {
        id: 202,
        name: 'Minimalist Phone Stand',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400',
        confidence: 0.87,
        reason: 'Popular among remote workers this week',
        aiInsights: ['Perfect for video calls', 'Matches minimalist trend'],
        rating: 4.7,
        reviews: 3210,
        discount: 25,
        tags: ['Minimalist', 'Productivity', 'Phone']
      }
    ],
    similar: [
      {
        id: 301,
        name: 'Wireless Charging Pad',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1609592806596-4d8b5b5e7e0a?w=400',
        confidence: 0.91,
        reason: 'Complements your recent wireless earbuds purchase',
        aiInsights: ['Same brand ecosystem', 'Wireless convenience'],
        rating: 4.5,
        reviews: 1654,
        discount: 15,
        tags: ['Wireless', 'Charging', 'Tech']
      }
    ],
    predictive: [
      {
        id: 401,
        name: 'Coffee Subscription Box',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
        confidence: 0.78,
        reason: 'Your coffee consumption pattern suggests you\'ll run out soon',
        aiInsights: ['Reorder prediction: 3 days', 'Premium blend selection'],
        rating: 4.9,
        reviews: 987,
        discount: 0,
        tags: ['Subscription', 'Coffee', 'Premium']
      }
    ]
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
    const isInWishlist = state.wishlist.some(item => item.id === product.id)
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
      toast.success('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
      toast.success('Added to wishlist!', { icon: '❤️' })
    }
  }

  const refreshRecommendations = async () => {
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast.success('Recommendations updated!', { icon: '✨' })
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
    hidden: { y: 30, opacity: 0 },
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
    <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900">
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
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4"
            >
              <SparklesIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              AI Recommendations
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Our advanced AI analyzes your preferences, behavior, and trends to suggest 
            products you'll love before you even know you need them.
          </p>
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshRecommendations}
            disabled={isLoading}
            className="btn-primary px-6 py-3 rounded-full"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block" />
            ) : (
              <SparklesIcon className="w-5 h-5 inline mr-2" />
            )}
            {isLoading ? 'Updating...' : 'Refresh Recommendations'}
          </motion.button>
        </motion.div>

        {/* AI Insights Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-effect rounded-2xl p-6 text-center">
            <ChartBarIcon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Accuracy Rate
            </h3>
            <p className="text-3xl font-bold text-primary-600 mb-1">94.2%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Of our recommendations match your preferences
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-center">
            <ClockIcon className="w-8 h-8 text-secondary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Time Saved
            </h3>
            <p className="text-3xl font-bold text-secondary-600 mb-1">2.5hrs</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average browsing time saved per week
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-center">
            <TrendingUpIcon className="w-8 h-8 text-accent-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Satisfaction
            </h3>
            <p className="text-3xl font-bold text-accent-600 mb-1">4.8/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average rating for recommended products
            </p>
          </div>
        </motion.div>

        {/* Recommendation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-80">{tab.description}</div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Recommendations Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {recommendations[activeTab]?.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* AI Confidence Badge */}
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      {Math.round(product.confidence * 100)}% Match
                    </div>
                  </div>
                  
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* AI Reason */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <LightBulbIcon className="w-4 h-4 inline mr-1" />
                      {product.reason}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.aiInsights.map((insight, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                        >
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleWishlist(product)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HeartIcon className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary px-4 py-2 rounded-full"
                      >
                        <ShoppingCartIcon className="w-4 h-4 inline mr-1" />
                        Add
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* AI Learning Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
            <SparklesIcon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              AI Continuously Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI gets smarter with every interaction. The more you shop, browse, and engage, 
              the better our recommendations become. Your privacy is always protected.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}