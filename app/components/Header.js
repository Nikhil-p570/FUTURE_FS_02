'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  MicrophoneIcon,
  CubeTransparentIcon,
  BellIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import SearchBar from './SearchBar'
import NotificationCenter from './NotificationCenter'
import CollaborativeIndicator from './CollaborativeIndicator'

export default function Header() {
  const { state, dispatch } = useGlobalState()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0)
  const wishlistCount = state.wishlist.length
  const notificationCount = state.notifications.length

  const toggleVoice = () => {
    dispatch({ type: 'TOGGLE_VOICE' })
  }

  const toggleAR = () => {
    dispatch({ type: 'TOGGLE_AR' })
  }

  if (!mounted) return null

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center"
              >
                <GlobeAltIcon className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-xl gradient-text">
                NextGen Commerce
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
              >
                Deals
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                />
              </Link>
              <Link
                href="/sustainability"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Sustainability
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-lg mx-8">
              <SearchBar />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Voice Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleVoice}
                className={`p-2 rounded-full transition-colors ${
                  state.voiceEnabled
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                }`}
                title="Voice Commerce"
              >
                <MicrophoneIcon className="w-5 h-5" />
                {state.voiceEnabled && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.button>

              {/* AR Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleAR}
                className={`p-2 rounded-full transition-colors ${
                  state.arEnabled
                    ? 'bg-accent-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-accent-600'
                }`}
                title="AR Preview"
              >
                <CubeTransparentIcon className="w-5 h-5" />
              </motion.button>

              {/* Search Toggle (Mobile) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <NotificationCenter />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>

              {/* User Menu */}
              <Link
                href="/profile"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collaborative Shopping Indicator */}
        <CollaborativeIndicator />
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white dark:bg-gray-900 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <SearchBar />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-gray-600 dark:text-gray-400"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-xl gradient-text">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-400"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-6">
                  <Link
                    href="/products"
                    className="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/categories"
                    className="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/deals"
                    className="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Deals
                  </Link>
                  <Link
                    href="/sustainability"
                    className="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sustainability
                  </Link>
                  <Link
                    href="/profile"
                    className="block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}