'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  UserGroupIcon,
  HeartIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  EyeIcon,
  ShoppingBagIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'

export default function SocialProof() {
  const { state } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [currentActivity, setCurrentActivity] = useState(0)
  const [liveStats, setLiveStats] = useState({
    activeUsers: 1247,
    recentPurchases: 89,
    reviewsToday: 156,
    socialShares: 234
  })

  // Mock social activities
  const socialActivities = [
    {
      id: 1,
      type: 'purchase',
      user: 'Sarah from New York',
      action: 'just bought',
      item: 'Wireless Earbuds Pro',
      time: '2 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40'
    },
    {
      id: 2,
      type: 'review',
      user: 'Mike from California',
      action: 'left a 5-star review for',
      item: 'Smart Water Bottle',
      time: '5 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40'
    },
    {
      id: 3,
      type: 'wishlist',
      user: 'Emma from Texas',
      action: 'added to wishlist',
      item: 'Eco-Friendly Yoga Mat',
      time: '8 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40'
    },
    {
      id: 4,
      type: 'share',
      user: 'Alex from Florida',
      action: 'shared',
      item: 'Gaming Mechanical Keyboard',
      time: '12 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'
    },
    {
      id: 5,
      type: 'collaborative',
      user: 'Lisa from Oregon',
      action: 'started a collaborative session for',
      item: 'Home Office Setup',
      time: '15 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40'
    }
  ]

  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      role: 'Fashion Blogger',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80',
      rating: 5,
      text: 'The AI recommendations are incredibly accurate! It\'s like having a personal shopping assistant that knows my style better than I do.',
      feature: 'AI Recommendations'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Tech Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
      rating: 5,
      text: 'AR preview changed how I shop online. Being able to see products in my space before buying has saved me from so many returns.',
      feature: 'AR Preview'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      role: 'Sustainability Advocate',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
      rating: 5,
      text: 'Love the sustainability tracking! It helps me make conscious choices and see the real impact of my purchases on the environment.',
      feature: 'Sustainability Dashboard'
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Busy Parent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
      rating: 5,
      text: 'Voice commerce is a game-changer when my hands are full with the kids. I can shop while cooking dinner or doing chores.',
      feature: 'Voice Commerce'
    }
  ]

  // Mock friend activities
  const friendActivities = [
    {
      id: 1,
      friend: 'Sarah',
      action: 'bought the same Smart Water Bottle you viewed',
      time: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40'
    },
    {
      id: 2,
      friend: 'Mike',
      action: 'left a review on Wireless Earbuds in your wishlist',
      time: '3 hours ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40'
    },
    {
      id: 3,
      friend: 'Emma',
      action: 'shared a collaborative shopping session',
      time: '5 hours ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40'
    }
  ]

  useEffect(() => {
    // Cycle through activities
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % socialActivities.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [socialActivities.length])

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        recentPurchases: prev.recentPurchases + Math.floor(Math.random() * 3),
        reviewsToday: prev.reviewsToday + Math.floor(Math.random() * 2),
        socialShares: prev.socialShares + Math.floor(Math.random() * 4)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase':
        return ShoppingBagIcon
      case 'review':
        return StarIcon
      case 'wishlist':
        return HeartIcon
      case 'share':
        return ShareIcon
      case 'collaborative':
        return UserGroupIcon
      default:
        return EyeIcon
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'purchase':
        return 'text-green-500'
      case 'review':
        return 'text-yellow-500'
      case 'wishlist':
        return 'text-red-500'
      case 'share':
        return 'text-blue-500'
      case 'collaborative':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4"
            >
              <UserGroupIcon className="w-8 h-8  text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Join Our Community
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See what others are discovering, sharing, and loving. 
            Be part of a community that's revolutionizing online shopping.
          </p>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            {
              icon: UserGroupIcon,
              label: 'Active Users',
              value: liveStats.activeUsers.toLocaleString(),
              color: 'blue',
              suffix: ' online now'
            },
            {
              icon: ShoppingBagIcon,
              label: 'Recent Purchases',
              value: liveStats.recentPurchases,
              color: 'green',
              suffix: ' in last hour'
            },
            {
              icon: StarIcon,
              label: 'Reviews Today',
              value: liveStats.reviewsToday,
              color: 'yellow',
              suffix: ' reviews'
            },
            {
              icon: ShareIcon,
              label: 'Social Shares',
              value: liveStats.socialShares,
              color: 'purple',
              suffix: ' shares today'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass-effect rounded-2xl p-6 text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 1.2, color: '#10B981' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.suffix}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                Live Activity
              </h3>
              
              <div className="space-y-4 h-80 overflow-hidden">
                <AnimatePresence mode="wait">
                  {socialActivities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type)
                    const colorClass = getActivityColor(activity.type)
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: index === currentActivity ? 1 : 0.3,
                          y: index === currentActivity ? 0 : 10,
                          scale: index === currentActivity ? 1 : 0.95
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={activity.avatar}
                          alt={activity.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className={`w-4 h-4 ${colorClass}`} />
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {activity.user}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.action} <span className="font-medium">{activity.item}</span>
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-1">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {activity.time}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Customer Testimonials */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                What Our Customers Say
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      {testimonial.feature}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Friend Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-effect rounded-2xl p-8 mt-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <UserGroupIcon className="w-6 h-6 text-blue-500 mr-2" />
            Your Friends' Activity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {friendActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={activity.avatar}
                    alt={activity.friend}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {activity.friend}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.action}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Join the Revolution?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of shopping with our community of smart shoppers, 
            sustainability advocates, and tech enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 rounded-full shadow-2xl"
            >
              <UserGroupIcon className="w-6 h-6 inline mr-2" />
              Join Community
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4 rounded-full shadow-2xl"
            >
              <ShareIcon className="w-6 h-6 inline mr-2" />
              Share with Friends
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}