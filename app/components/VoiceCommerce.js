'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MicrophoneIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import toast from 'react-hot-toast'

export default function VoiceCommerce() {
  const { state, dispatch } = useGlobalState()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [voiceWaves, setVoiceWaves] = useState([])
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Voice commands and responses
  const voiceCommands = {
    'search for': (query) => {
      const searchTerm = query.replace('search for', '').trim()
      dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: searchTerm })
      return `Searching for ${searchTerm}. I found several great options for you.`
    },
    'add to cart': (query) => {
      // Mock product addition
      const mockProduct = {
        id: Date.now(),
        name: 'Voice-Selected Product',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
      }
      dispatch({ type: 'ADD_TO_CART', payload: mockProduct })
      return `I've added the item to your cart. Your total is now updated.`
    },
    'show my cart': () => {
      const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0)
      return `You have ${itemCount} items in your cart. Would you like me to read them out?`
    },
    'what\'s trending': () => {
      return `The top trending items today are wireless earbuds, smart home devices, and sustainable fashion. Would you like to see any of these?`
    },
    'recommend something': () => {
      return `Based on your preferences, I recommend checking out our new eco-friendly water bottles and smart fitness trackers. They're perfect for your active lifestyle.`
    },
    'help': () => {
      return `I can help you search for products, add items to your cart, check your orders, and provide recommendations. Just speak naturally and I'll understand.`
    }
  }

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        generateVoiceWaves()
      }

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcript)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setVoiceWaves([])
      }

      recognitionRef.current.onerror = (event) => {
        setIsListening(false)
        setVoiceWaves([])
        toast.error('Voice recognition error. Please try again.')
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const generateVoiceWaves = () => {
    const waves = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
      delay: i * 0.1
    }))
    setVoiceWaves(waves)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setResponse('')
      setShowModal(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const processVoiceCommand = async (command) => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerCommand = command.toLowerCase()
    let responseText = "I'm sorry, I didn't understand that command. Try saying 'help' to see what I can do."
    
    // Find matching command
    for (const [key, handler] of Object.entries(voiceCommands)) {
      if (lowerCommand.includes(key)) {
        responseText = handler(lowerCommand)
        break
      }
    }
    
    setResponse(responseText)
    setIsProcessing(false)
    
    // Speak the response
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(responseText)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      synthRef.current.speak(utterance)
    }
    
    toast.success('Voice command processed!', { icon: '🎤' })
  }

  const closeModal = () => {
    setShowModal(false)
    stopListening()
    setTranscript('')
    setResponse('')
  }

  if (!state.voiceEnabled) return null

  return (
    <>
      {/* Floating Voice Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={startListening}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
      >
        <MicrophoneIcon className="w-8 h-8" />
        
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-secondary-400"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Voice Commerce Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <MicrophoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Voice Commerce
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Speak naturally, I'll understand
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Voice Visualization */}
              <div className="mb-6">
                {isListening && (
                  <div className="flex items-center justify-center space-x-1 h-16">
                    {voiceWaves.map((wave) => (
                      <motion.div
                        key={wave.id}
                        className="w-2 bg-gradient-to-t from-secondary-500 to-secondary-300 rounded-full"
                        animate={{
                          height: [10, wave.height, 10],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: wave.delay,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {!isListening && !isProcessing && !response && (
                  <div className="text-center py-8">
                    <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Tap the microphone to start
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mb-6">
                {isListening && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                      Listening...
                    </div>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                      Processing...
                    </div>
                  </div>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CommandLineIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          You said:
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          "{transcript}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <SpeakerWaveIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          AI Assistant:
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {response}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!isListening && !isProcessing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startListening}
                    className="flex-1 btn-secondary py-3 rounded-xl"
                  >
                    <MicrophoneIcon className="w-5 h-5 inline mr-2" />
                    Start Listening
                  </motion.button>
                )}
                
                {isListening && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopListening}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Stop Listening
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </motion.button>
              </div>

              {/* Quick Commands */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Try saying:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-600 dark:text-gray-400">"Search for headphones"</div>
                  <div className="text-gray-600 dark:text-gray-400">"Show my cart"</div>
                  <div className="text-gray-600 dark:text-gray-400">"What's trending?"</div>
                  <div className="text-gray-600 dark:text-gray-400">"Recommend something"</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}