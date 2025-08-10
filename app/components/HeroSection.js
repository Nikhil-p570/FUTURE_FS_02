'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { 
  SparklesIcon, 
  CubeTransparentIcon, 
  MicrophoneIcon,
  UsersIcon,
  LeafIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import Lottie from 'lottie-react'

export default function HeroSection({ inView }) {
  const { state, dispatch } = useGlobalState()
  const controls = useAnimation()
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Recommendations',
      description: 'Discover products tailored just for you',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: CubeTransparentIcon,
      title: 'AR Product Preview',
      description: 'See products in your space before buying',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: MicrophoneIcon,
      title: 'Voice Commerce',
      description: 'Shop hands-free with voice commands',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: UsersIcon,
      title: 'Collaborative Shopping',
      description: 'Shop together with friends in real-time',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: LeafIcon,
      title: 'Sustainability Tracking',
      description: 'Make eco-conscious purchasing decisions',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: TrophyIcon,
      title: 'Gamified Experience',
      description: 'Earn rewards and unlock achievements',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [inView, controls])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Floating Shapes */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute top-40 right-20 w-16 h-16 bg-accent-200 dark:bg-accent-800 rounded-full opacity-20"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-40 left-20 w-24 h-24 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-20"
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Main Headline */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-display font-bold mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="gradient-text">
              The Future of
            </span>
            <br />
            <motion.span
              className="text-gray-900 dark:text-white"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #d946ef, #22c55e, #3b82f6)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Shopping
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience revolutionary e-commerce with AI-powered recommendations, 
            AR previews, voice commerce, and collaborative shopping that transforms 
            how you discover and buy products.
          </motion.p>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.slice(0, 3).map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="glass-effect rounded-2xl p-6 card-hover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <motion.button
            className="btn-primary text-lg px-8 py-4 rounded-full shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('featured-products')?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
          >
            <SparklesIcon className="w-5 h-5 inline mr-2" />
            Start Shopping
          </motion.button>
          
          <motion.button
            className="ar-preview-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'TOGGLE_AR' })}
          >
            <CubeTransparentIcon className="w-5 h-5 inline mr-2" />
            Try AR Preview
          </motion.button>
        </motion.div>

        {/* Live Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: 'Happy Customers', value: '50K+', icon: '😊' },
            { label: 'Products', value: '10K+', icon: '📦' },
            { label: 'AI Recommendations', value: '1M+', icon: '🤖' },
            { label: 'Carbon Saved', value: '500T', icon: '🌱' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}