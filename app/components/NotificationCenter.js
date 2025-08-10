'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  GiftIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'

export default function NotificationCenter() {
  const { state, dispatch } = useGlobalState()
  const [showNotifications, setShowNotifications] = useState(false)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckIcon
      case 'warning':
        return ExclamationTriangleIcon
      case 'info':
        return InformationCircleIcon
      case 'gift':
        return GiftIcon
      case 'cart':
        return ShoppingCartIcon
      case 'wishlist':
        return HeartIcon
      case 'social':
        return UserGroupIcon
      case 'ai':
        return SparklesIcon
      default:
        return BellIcon
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      case 'gift':
        return 'text-purple-500'
      case 'cart':
        return 'text-primary-500'
      case 'wishlist':
        return 'text-red-500'
      case 'social':
        return 'text-indigo-500'
      case 'ai':
        return 'text-accent-500'
      default:
        return 'text-gray-500'
    }
  }

  const markAsRead = (notificationId) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId })
  }

  const clearAllNotifications = () => {
    state.notifications.forEach(notification => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })
    })
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
      >
        <BellIcon className="w-5 h-5" />
        {state.notifications.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {state.notifications.length > 9 ? '9+' : state.notifications.length}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <div className="flex items-center space-x-2">
                    {state.notifications.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearAllNotifications}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Clear All
                      </motion.button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {state.notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <BellIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      We'll notify you about important updates
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {state.notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type)
                      const colorClass = getNotificationColor(notification.type)
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                              notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                              notification.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/20' :
                              notification.type === 'gift' ? 'bg-purple-100 dark:bg-purple-900/20' :
                              notification.type === 'cart' ? 'bg-primary-100 dark:bg-primary-900/20' :
                              notification.type === 'wishlist' ? 'bg-red-100 dark:bg-red-900/20' :
                              notification.type === 'social' ? 'bg-indigo-100 dark:bg-indigo-900/20' :
                              notification.type === 'ai' ? 'bg-accent-100 dark:bg-accent-900/20' :
                              'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon className={`w-4 h-4 ${colorClass}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}