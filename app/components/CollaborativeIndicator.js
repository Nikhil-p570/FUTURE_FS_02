'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'

export default function CollaborativeIndicator() {
  const { state } = useGlobalState()

  if (!state.collaborativeSession) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-4 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="collaborative-indicator w-3 h-3 bg-white rounded-full" />
            <UsersIcon className="w-5 h-5" />
            <span className="font-medium text-sm">
              Shopping with {state.collaborativeSession.participants.length - 1} friends
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {state.collaborativeSession.participants.slice(1, 4).map((participant, index) => (
                <img
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
              {state.collaborativeSession.participants.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold">
                  +{state.collaborativeSession.participants.length - 4}
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>Chat</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}