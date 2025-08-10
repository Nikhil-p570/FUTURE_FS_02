'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CubeTransparentIcon,
  XMarkIcon,
  CameraIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import toast from 'react-hot-toast'

export default function ARPreview() {
  const { state, dispatch } = useGlobalState()
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [arMode, setArMode] = useState('placement') // placement, try-on, scale
  const [cameraStream, setCameraStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Mock AR-enabled products
  const arProducts = [
    {
      id: 1,
      name: 'Modern Desk Lamp',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      price: 89.99,
      arType: 'placement',
      description: 'See how this lamp looks on your desk'
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      price: 199.99,
      arType: 'try-on',
      description: 'Virtual try-on experience'
    },
    {
      id: 3,
      name: 'Eco Water Bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      price: 29.99,
      arType: 'scale',
      description: 'See actual size comparison'
    },
    {
      id: 4,
      name: 'Smart Plant Monitor',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      price: 79.99,
      arType: 'placement',
      description: 'Visualize in your garden'
    }
  ]

  useEffect(() => {
    if (state.arEnabled && !showModal) {
      setShowModal(true)
      setSelectedProduct(arProducts[0])
    }
  }, [state.arEnabled])

  useEffect(() => {
    if (showModal && selectedProduct) {
      initializeCamera()
    }
    
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [showModal, selectedProduct])

  const initializeCamera = async () => {
    setIsLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: selectedProduct?.arType === 'try-on' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Simulate AR processing delay
      setTimeout(() => {
        setIsLoading(false)
        toast.success('AR Preview ready!', { icon: '📱' })
      }, 2000)
      
    } catch (error) {
      console.error('Camera access denied:', error)
      setIsLoading(false)
      toast.error('Camera access required for AR preview')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    dispatch({ type: 'TOGGLE_AR' })
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
  }

  const switchProduct = (product) => {
    setSelectedProduct(product)
    setArMode(product.arType)
    initializeCamera()
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      
      // Convert to blob and trigger download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ar-preview-${selectedProduct?.name}.jpg`
        a.click()
        URL.revokeObjectURL(url)
        
        toast.success('Photo captured!', { icon: '📸' })
      })
    }
  }

  const shareAR = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${selectedProduct?.name} in AR!`,
        text: 'I\'m trying this product using AR preview on NextGen Commerce',
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!', { icon: '🔗' })
    }
  }

  const AROverlay = () => {
    if (!selectedProduct) return null

    switch (arMode) {
      case 'placement':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* 3D Object Placeholder */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-32 h-32 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-lg border-2 border-primary-400 flex items-center justify-center backdrop-blur-sm"
              >
                <CubeTransparentIcon className="w-16 h-16 text-primary-600" />
              </motion.div>
            </div>
            
            {/* Placement Grid */}
            <div className="absolute inset-0 opacity-30">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'try-on':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Face Detection Overlay */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-48 h-32 border-2 border-accent-400 rounded-full opacity-60"
              />
              
              {/* Virtual Earbuds */}
              <div className="absolute top-8 left-4 w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-lg" />
              <div className="absolute top-8 right-4 w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-lg" />
            </div>
          </div>
        )
      
      case 'scale':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Size Reference */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-20 bg-gradient-to-b from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Actual Size</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedProduct.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Real-world dimensions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Camera View */}
          <div className="relative w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-900">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-white text-lg">Initializing AR Preview...</p>
                  <p className="text-gray-400 text-sm mt-2">Please allow camera access</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <AROverlay />
              </>
            )}

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <CubeTransparentIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AR Preview</h3>
                    <p className="text-gray-300 text-sm">{selectedProduct?.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={closeModal}
                  className="p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            {selectedProduct && (
              <div className="absolute top-20 left-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 backdrop-blur-sm max-w-xs">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-primary-600 font-bold">
                      ${selectedProduct.price}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              {/* Product Selector */}
              <div className="flex space-x-3 mb-6 overflow-x-auto">
                {arProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => switchProduct(product)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-primary-400 shadow-lg'
                        : 'border-white/30'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <CameraIcon className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => initializeCamera()}
                  className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
                >
                  <ArrowPathIcon className="w-8 h-8" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={shareAR}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ShareIcon className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Mode Indicator */}
              <div className="text-center mt-4">
                <div className="inline-flex items-center px-4 py-2 bg-black/30 rounded-full text-white text-sm">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                  {arMode === 'placement' && 'Placement Mode'}
                  {arMode === 'try-on' && 'Try-On Mode'}
                  {arMode === 'scale' && 'Scale Mode'}
                </div>
              </div>
            </div>

            {/* AR Instructions */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
              >
                <div className="bg-black/50 rounded-lg p-4 text-white text-sm max-w-xs">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  {arMode === 'placement' && (
                    <ul className="space-y-1 text-xs">
                      <li>• Point camera at flat surface</li>
                      <li>• Move slowly for better tracking</li>
                      <li>• Tap to place object</li>
                    </ul>
                  )}
                  {arMode === 'try-on' && (
                    <ul className="space-y-1 text-xs">
                      <li>• Face the front camera</li>
                      <li>• Keep head centered</li>
                      <li>• Good lighting recommended</li>
                    </ul>
                  )}
                  {arMode === 'scale' && (
                    <ul className="space-y-1 text-xs">
                      <li>• Use hand for size reference</li>
                      <li>• View from different angles</li>
                      <li>• Compare with real objects</li>
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}