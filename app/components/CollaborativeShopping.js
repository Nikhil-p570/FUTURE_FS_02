'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  VideoCameraIcon,
  PhoneIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import toast from 'react-hot-toast'

export default function CollaborativeShopping() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [activeSession, setActiveSession] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [friends, setFriends] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // Mock friends data
  const mockFriends = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      status: 'online',
      lastSeen: 'now'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'shopping',
      lastSeen: '2 min ago'
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      status: 'offline',
      lastSeen: '1 hour ago'
    },
    {
      id: 4,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      status: 'online',
      lastSeen: 'now'
    }
  ]

  // Mock collaborative session
  const mockSession = {
    id: 'session-123',
    name: 'Weekend Shopping',
    participants: [
      { id: 1, name: 'You', avatar: '/api/placeholder/40/40', isHost: true },
      { id: 2, name: 'Sarah', avatar: mockFriends[0].avatar, isHost: false },
      { id: 3, name: 'Mike', avatar: mockFriends[1].avatar, isHost: false }
    ],
    sharedCart: [
      {
        id: 101,
        name: 'Wireless Earbuds',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
        addedBy: 'Sarah',
        votes: { up: 2, down: 0 },
        comments: ['Great sound quality!', 'Perfect for workouts']
      },
      {
        id: 102,
        name: 'Smart Water Bottle',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200',
        addedBy: 'You',
        votes: { up: 1, down: 1 },
        comments: ['Love the sustainability aspect']
      }
    ]
  }

  useEffect(() => {
    setFriends(mockFriends)
    
    // Mock real-time messages
    const mockMessages = [
      { id: 1, user: 'Sarah', message: 'Hey! Ready to shop together?', timestamp: '2 min ago' },
      { id: 2, user: 'You', message: 'Yes! Looking for some tech gadgets', timestamp: '1 min ago' },
      { id: 3, user: 'Mike', message: 'I found some great headphones!', timestamp: 'now' }
    ]
    setMessages(mockMessages)
  }, [])

  const startCollaborativeSession = () => {
    setActiveSession(mockSession)
    dispatch({
      type: 'SET_COLLABORATIVE_SESSION',
      payload: mockSession
    })
    toast.success('Collaborative shopping session started!', { icon: '👥' })
  }

  const inviteFriend = (friend) => {
    toast.success(`Invitation sent to ${friend.name}!`, { icon: '📧' })
    setShowInviteModal(false)
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        timestamp: 'now'
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const voteOnItem = (itemId, voteType) => {
    toast.success(`Voted ${voteType} on item!`, { icon: voteType === 'up' ? '👍' : '👎' })
  }

  const shareSession = () => {
    const sessionLink = `${window.location.origin}/collaborate/${activeSession?.id}`
    navigator.clipboard.writeText(sessionLink)
    toast.success('Session link copied to clipboard!', { icon: '🔗' })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
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
              className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mr-4"
            >
              <UsersIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Shop Together
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of social commerce. Shop with friends in real-time, 
            share opinions, and make decisions together from anywhere in the world.
          </p>
        </motion.div>

        {!activeSession ? (
          /* Getting Started */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: ChatBubbleLeftRightIcon,
                  title: 'Real-time Chat',
                  description: 'Discuss products instantly with voice and text messages'
                },
                {
                  icon: ShareIcon,
                  title: 'Shared Cart',
                  description: 'Build a cart together and split costs automatically'
                },
                {
                  icon: VideoCameraIcon,
                  title: 'Video Calls',
                  description: 'See reactions and get instant feedback on products'
                },
                {
                  icon: HeartIcon,
                  title: 'Vote & Rate',
                  description: 'Democratic decision making with voting on items'
                },
                {
                  icon: UserPlusIcon,
                  title: 'Invite Anyone',
                  description: 'Shop with friends, family, or style consultants'
                },
                {
                  icon: LinkIcon,
                  title: 'Share Sessions',
                  description: 'Send links to join shopping sessions instantly'
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="glass-effect rounded-2xl p-6 text-center card-hover"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Online Friends */}
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Friends Online
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {friends.filter(f => f.status === 'online').map((friend) => (
                  <motion.div
                    key={friend.id}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => inviteFriend(friend)}
                  >
                    <div className="relative mb-3">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {friend.name}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {friend.status}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Start Session Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCollaborativeSession}
                className="btn-primary text-lg px-8 py-4 rounded-full shadow-2xl"
              >
                <UsersIcon className="w-6 h-6 inline mr-2" />
                Start Shopping Together
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Active Session */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Session Header */}
            <div className="glass-effect rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {activeSession.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {activeSession.participants.length} participants
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareSession}
                    className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              
              {/* Participants */}
              <div className="flex items-center space-x-2 mt-4">
                {activeSession.participants.map((participant) => (
                  <div key={participant.id} className="relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {participant.isHost && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">👑</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shared Cart */}
              <div className="lg:col-span-2">
                <div className="glass-effect rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    Shared Cart
                  </h4>
                  
                  <div className="space-y-4">
                    {activeSession.sharedCart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </h5>
                            <p className="text-primary-600 font-bold">
                              ${item.price}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Added by {item.addedBy}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => voteOnItem(item.id, 'up')}
                              className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                            >
                              👍 {item.votes.up}
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => voteOnItem(item.id, 'down')}
                              className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                            >
                              👎 {item.votes.down}
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Comments */}
                        {item.comments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            {item.comments.map((comment, index) => (
                              <p key={index} className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                💬 {comment}
                              </p>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="glass-effect rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Chat
                </h4>
                
                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.user === 'You'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="font-medium text-xs opacity-75 mb-1">
                          {message.user}
                        </p>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}