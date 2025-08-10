'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useGlobalState } from '../providers'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { state, dispatch } = useGlobalState()
  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const [shippingOption, setShippingOption] = useState('standard')

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 0,
      time: '5-7 business days',
      description: 'Free shipping on orders over $50'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 9.99,
      time: '2-3 business days',
      description: 'Faster delivery'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      time: '1 business day',
      description: 'Next day delivery'
    }
  ]

  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const selectedShipping = shippingOptions.find(option => option.id === shippingOption)
  const shippingCost = subtotal >= 50 && shippingOption === 'standard' ? 0 : selectedShipping?.price || 0
  const discount = isPromoApplied ? subtotal * 0.1 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal + shippingCost - discount + tax

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
      toast.success('Item removed from cart', { icon: '🗑️' })
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id: productId, quantity: newQuantity }
      })
    }
  }

  const removeFromCart = (productId, productName) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
    toast.success(`${productName} removed from cart`, { icon: '🗑️' })
  }

  const moveToWishlist = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product.id })
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
    toast.success('Moved to wishlist!', { icon: '❤️' })
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setIsPromoApplied(true)
      toast.success('Promo code applied! 10% off', { icon: '🎉' })
    } else {
      toast.error('Invalid promo code', { icon: '❌' })
    }
  }

  const proceedToCheckout = () => {
    if (state.cart.length === 0) {
      toast.error('Your cart is empty', { icon: '🛒' })
      return
    }
    
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
              </div>
              
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Discover amazing products and start building your perfect collection
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-4 rounded-full"
                  >
                    Start Shopping
                  </motion.button>
                </Link>
                
                <Link href="/wishlist">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary text-lg px-8 py-4 rounded-full"
                  >
                    <HeartIcon className="w-5 h-5 inline mr-2" />
                    View Wishlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {state.cart.length} {state.cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Cart Items
                </h2>
                
                <div className="space-y-6">
                  <AnimatePresence>
                    {state.cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            by {item.brand}
                          </p>
                          
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Color: {item.selectedColor}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <button
                              onClick={() => moveToWishlist(item)}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Move to Wishlist
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id, item.name)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <MinusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </motion.button>
                          
                          <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </motion.button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.price} each
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyPromoCode}
                      disabled={isPromoApplied}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isPromoApplied
                          ? 'bg-green-500 text-white'
                          : 'bg-primary-500 hover:bg-primary-600 text-white'
                      }`}
                    >
                      {isPromoApplied ? 'Applied' : 'Apply'}
                    </motion.button>
                  </div>
                  {isPromoApplied && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      ✓ SAVE10 applied - 10% off
                    </p>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Shipping Options
                  </label>
                  <div className="space-y-2">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          shippingOption === option.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingOption === option.id}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
                          shippingOption === option.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {shippingOption === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {option.name}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {option.price === 0 ? 'Free' : `$${option.price}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {option.time} • {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount (SAVE10)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mb-6">
                  <span>Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.1, color: '#10B981' }}
                    animate={{ scale: 1, color: 'inherit' }}
                    transition={{ duration: 0.3 }}
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>

                {/* Security Features */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-500" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1 text-blue-500" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <GiftIcon className="w-4 h-4 mr-1 text-purple-500" />
                      <span>Gift Wrap</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedToCheckout}
                  className="w-full btn-primary text-lg py-4 rounded-xl shadow-xl"
                >
                  <CreditCardIcon className="w-6 h-6 inline mr-2" />
                  Proceed to Checkout
                </motion.button>

                {/* Payment Methods */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    We accept
                  </p>
                  <div className="flex justify-center space-x-2">
                    {['💳', '🏦', '📱', '₿'].map((icon, index) => (
                      <span key={index} className="text-2xl">
                        {icon}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}