'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

// Global State Context
const GlobalStateContext = createContext()

// Initial state
const initialState = {
  user: null,
  cart: [],
  wishlist: [],
  collaborativeSession: null,
  voiceEnabled: false,
  arEnabled: false,
  sustainabilityMode: false,
  notifications: [],
  recentlyViewed: [],
  searchHistory: [],
  personalizedRecommendations: [],
  socialActivity: [],
  gamificationData: {
    points: 0,
    level: 1,
    badges: [],
    streaks: 0,
  },
  analytics: {
    carbonFootprint: 0,
    sustainabilityScore: 0,
    totalSpent: 0,
    itemsPurchased: 0,
  },
}

// Reducer function
function globalReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      }
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      }
    
    case 'SET_COLLABORATIVE_SESSION':
      return { ...state, collaborativeSession: action.payload }
    
    case 'TOGGLE_VOICE':
      return { ...state, voiceEnabled: !state.voiceEnabled }
    
    case 'TOGGLE_AR':
      return { ...state, arEnabled: !state.arEnabled }
    
    case 'TOGGLE_SUSTAINABILITY':
      return { ...state, sustainabilityMode: !state.sustainabilityMode }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10)
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      }
    
    case 'ADD_TO_RECENTLY_VIEWED':
      const filtered = state.recentlyViewed.filter(item => item.id !== action.payload.id)
      return {
        ...state,
        recentlyViewed: [action.payload, ...filtered].slice(0, 20)
      }
    
    case 'ADD_TO_SEARCH_HISTORY':
      const filteredSearch = state.searchHistory.filter(term => term !== action.payload)
      return {
        ...state,
        searchHistory: [action.payload, ...filteredSearch].slice(0, 10)
      }
    
    case 'SET_RECOMMENDATIONS':
      return { ...state, personalizedRecommendations: action.payload }
    
    case 'UPDATE_GAMIFICATION':
      return {
        ...state,
        gamificationData: { ...state.gamificationData, ...action.payload }
      }
    
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      }
    
    default:
      return state
  }
}

// Provider component
export function Providers({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('nextgen-commerce-state')
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          Object.keys(parsedState).forEach(key => {
            if (key === 'cart') {
              parsedState[key].forEach(item => {
                dispatch({ type: 'ADD_TO_CART', payload: item })
              })
            } else if (key === 'wishlist') {
              parsedState[key].forEach(item => {
                dispatch({ type: 'ADD_TO_WISHLIST', payload: item })
              })
            }
          })
        } catch (error) {
          console.error('Error loading saved state:', error)
        }
      }
    }
  }, [])

  // Save state to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
        gamificationData: state.gamificationData,
        analytics: state.analytics,
      }
      localStorage.setItem('nextgen-commerce-state', JSON.stringify(stateToSave))
    }
  }, [state])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GlobalStateContext.Provider value={{ state, dispatch }}>
        {children}
      </GlobalStateContext.Provider>
    </ThemeProvider>
  )
}

// Custom hook to use global state
export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a Providers component')
  }
  return context
}