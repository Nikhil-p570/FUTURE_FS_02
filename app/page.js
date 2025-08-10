'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import HeroSection from './components/HeroSection'
import FeaturedProducts from './components/FeaturedProducts'
import AIRecommendations from './components/AIRecommendations'
import CollaborativeShopping from './components/CollaborativeShopping'
import SustainabilityDashboard from './components/SustainabilityDashboard'
import VoiceCommerce from './components/VoiceCommerce'
import ARPreview from './components/ARPreview'
import GamificationHub from './components/GamificationHub'
import SocialProof from './components/SocialProof'
import LiveTrends from './components/LiveTrends'
import Header from './components/Header'
import Footer from './components/Footer'
import { useGlobalState } from './providers'

export default function HomePage() {
  const { state, dispatch } = useGlobalState()
  const { scrollY } = useScroll()
  const [mounted, setMounted] = useState(false)

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150])
  const featuresY = useTransform(scrollY, [0, 1000], [0, -100])

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [aiRef, aiInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    setMounted(true)
    
    // Initialize AI recommendations
    dispatch({
      type: 'SET_RECOMMENDATIONS',
      payload: [
        {
          id: 1,
          name: 'Smart Wireless Earbuds',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
          reason: 'Based on your recent tech purchases',
          confidence: 0.95
        },
        {
          id: 2,
          name: 'Eco-Friendly Water Bottle',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
          reason: 'Matches your sustainability preferences',
          confidence: 0.88
        },
        {
          id: 3,
          name: 'Minimalist Desk Lamp',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
          reason: 'Perfect for your home office setup',
          confidence: 0.92
        }
      ]
    })

    // Add welcome notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'welcome',
        title: 'Welcome to NextGen Commerce!',
        message: 'Experience the future of shopping with AI-powered recommendations.',
        timestamp: new Date().toISOString()
      }
    })
  }, [dispatch])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section with Parallax */}
      <motion.div
        ref={heroRef}
        style={{ y: heroY }}
        className="relative overflow-hidden"
      >
        <HeroSection inView={heroInView} />
      </motion.div>

      {/* Voice Commerce Floating Button */}
      <VoiceCommerce />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Featured Products */}
        <motion.section
          ref={featuresRef}
          style={{ y: featuresY }}
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20"
        >
          <FeaturedProducts />
        </motion.section>

        {/* AI Recommendations */}
        <motion.section
          ref={aiRef}
          initial={{ opacity: 0, y: 50 }}
          animate={aiInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
        >
          <AIRecommendations />
        </motion.section>

        {/* Collaborative Shopping */}
        <section className="py-20">
          <CollaborativeShopping />
        </section>

        {/* Live Trends */}
        <section className="py-20 bg-gradient-to-r from-accent-50 to-primary-50 dark:from-gray-800 dark:to-gray-700">
          <LiveTrends />
        </section>

        {/* Sustainability Dashboard */}
        <section className="py-20">
          <SustainabilityDashboard />
        </section>

        {/* Gamification Hub */}
        <section className="py-20 bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-gray-700 dark:to-gray-800">
          <GamificationHub />
        </section>

        {/* Social Proof */}
        <section className="py-20">
          <SocialProof />
        </section>
      </main>

      {/* AR Preview Modal */}
      <ARPreview />

      <Footer />
    </div>
  )
}