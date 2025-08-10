'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  LeafIcon,
  GlobeAltIcon,
  RecycleIcon,
  SunIcon,
  WaterIcon,
  TreeIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'

export default function SustainabilityDashboard() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedMetric, setSelectedMetric] = useState('carbon')

  // Mock sustainability data
  const sustainabilityData = {
    carbon: {
      current: 12.5,
      target: 20,
      unit: 'kg CO₂',
      trend: -15,
      description: 'Carbon footprint this month'
    },
    water: {
      current: 850,
      target: 1000,
      unit: 'liters',
      trend: -8,
      description: 'Water saved through eco choices'
    },
    waste: {
      current: 3.2,
      target: 5,
      unit: 'kg',
      trend: -22,
      description: 'Waste diverted from landfills'
    },
    energy: {
      current: 45,
      target: 60,
      unit: 'kWh',
      trend: -12,
      description: 'Renewable energy equivalent'
    }
  }

  const ecoProducts = [
    {
      id: 1,
      name: 'Bamboo Phone Case',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200',
      sustainabilityScore: 95,
      carbonSaved: 2.1,
      features: ['Biodegradable', 'Plastic-free', 'Fair Trade']
    },
    {
      id: 2,
      name: 'Solar Power Bank',
      image: 'https://images.unsplash.com/photo-1609592806596-4d8b5b5e7e0a?w=200',
      sustainabilityScore: 88,
      carbonSaved: 5.3,
      features: ['Solar Powered', 'Recycled Materials', 'Long Lasting']
    },
    {
      id: 3,
      name: 'Organic Cotton Tote',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
      sustainabilityScore: 92,
      carbonSaved: 1.8,
      features: ['Organic Cotton', 'Reusable', 'Local Made']
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Eco Warrior',
      description: 'Saved 50kg CO₂ this year',
      icon: '🌱',
      progress: 85,
      unlocked: true
    },
    {
      id: 2,
      title: 'Water Guardian',
      description: 'Conserved 1000L of water',
      icon: '💧',
      progress: 75,
      unlocked: true
    },
    {
      id: 3,
      title: 'Zero Waste Hero',
      description: 'Diverted 10kg from landfills',
      icon: '♻️',
      progress: 60,
      unlocked: false
    },
    {
      id: 4,
      title: 'Solar Champion',
      description: 'Used 100kWh renewable energy',
      icon: '☀️',
      progress: 45,
      unlocked: false
    }
  ]

  const tips = [
    {
      id: 1,
      title: 'Choose Local Products',
      description: 'Reduce transportation emissions by 40%',
      impact: 'High',
      icon: TruckIcon
    },
    {
      id: 2,
      title: 'Buy in Bulk',
      description: 'Reduce packaging waste significantly',
      impact: 'Medium',
      icon: RecycleIcon
    },
    {
      id: 3,
      title: 'Opt for Refurbished',
      description: 'Extend product lifecycle and reduce waste',
      impact: 'High',
      icon: ShieldCheckIcon
    }
  ]

  useEffect(() => {
    // Update analytics with sustainability data
    dispatch({
      type: 'UPDATE_ANALYTICS',
      payload: {
        carbonFootprint: sustainabilityData.carbon.current,
        sustainabilityScore: 78
      }
    })
  }, [dispatch])

  const toggleSustainabilityMode = () => {
    dispatch({ type: 'TOGGLE_SUSTAINABILITY' })
  }

  const CircularProgress = ({ value, max, color = 'primary' }) => {
    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`text-${color}-500`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${color}-600`}>
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              of target
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4"
            >
              <LeafIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Sustainability Dashboard
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Track your environmental impact, discover eco-friendly products, 
            and make sustainable choices that matter for our planet.
          </p>
          
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSustainabilityMode}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              state.sustainabilityMode
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <LeafIcon className="w-5 h-5 inline mr-2" />
            {state.sustainabilityMode ? 'Sustainability Mode ON' : 'Enable Sustainability Mode'}
          </motion.button>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {Object.entries(sustainabilityData).map(([key, data], index) => {
            const icons = {
              carbon: GlobeAltIcon,
              water: WaterIcon,
              waste: RecycleIcon,
              energy: SunIcon
            }
            const Icon = icons[key]
            const colors = {
              carbon: 'green',
              water: 'blue',
              waste: 'purple',
              energy: 'yellow'
            }
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className={`glass-effect rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  selectedMetric === key ? 'ring-2 ring-green-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedMetric(key)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r from-${colors[key]}-500 to-${colors[key]}-600 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <CircularProgress 
                  value={data.current} 
                  max={data.target} 
                  color={colors[key]} 
                />
                
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.current} {data.unit}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {data.description}
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    data.trend < 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {data.trend < 0 ? '↓' : '↑'} {Math.abs(data.trend)}%
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eco Products */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <TreeIcon className="w-6 h-6 text-green-500 mr-2" />
                Eco-Friendly Products
              </h3>
              
              <div className="space-y-6">
                {ecoProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${product.sustainabilityScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              {product.sustainabilityScore}/100
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Saves {product.carbonSaved}kg CO₂
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="sustainability-badge"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Achievements & Tips */}
          <div className="space-y-8">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                🏆 Achievements
              </h3>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className={`font-semibold text-sm ${
                            achievement.unlocked 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sustainability Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                💡 Eco Tips
              </h3>
              
              <div className="space-y-4">
                {tips.map((tip) => {
                  const Icon = tip.icon
                  return (
                    <div key={tip.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {tip.description}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          tip.impact === 'High' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {tip.impact} Impact
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}