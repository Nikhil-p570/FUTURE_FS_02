'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  GiftIcon,
  BoltIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useGlobalState } from '../providers'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

export default function GamificationHub() {
  const { state, dispatch } = useGlobalState()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState(null)

  // Gamification data
  const levels = [
    { level: 1, name: 'Newbie Shopper', minPoints: 0, maxPoints: 100, color: 'gray' },
    { level: 2, name: 'Smart Buyer', minPoints: 101, maxPoints: 300, color: 'blue' },
    { level: 3, name: 'Savvy Shopper', minPoints: 301, maxPoints: 600, color: 'green' },
    { level: 4, name: 'Shopping Expert', minPoints: 601, maxPoints: 1000, color: 'purple' },
    { level: 5, name: 'Shopping Master', minPoints: 1001, maxPoints: 1500, color: 'yellow' },
    { level: 6, name: 'Shopping Legend', minPoints: 1501, maxPoints: 9999, color: 'red' }
  ]

  const badges = [
    {
      id: 1,
      name: 'First Purchase',
      description: 'Made your first purchase',
      icon: '🛍️',
      earned: true,
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Eco Warrior',
      description: 'Bought 10 sustainable products',
      icon: '🌱',
      earned: true,
      rarity: 'rare'
    },
    {
      id: 3,
      name: 'Review Master',
      description: 'Left 25 helpful reviews',
      icon: '⭐',
      earned: false,
      rarity: 'epic'
    },
    {
      id: 4,
      name: 'Social Shopper',
      description: 'Shared 5 collaborative sessions',
      icon: '👥',
      earned: true,
      rarity: 'rare'
    },
    {
      id: 5,
      name: 'Early Adopter',
      description: 'Used AR preview 50 times',
      icon: '🥽',
      earned: false,
      rarity: 'legendary'
    },
    {
      id: 6,
      name: 'Voice Commander',
      description: 'Made 20 voice purchases',
      icon: '🎤',
      earned: false,
      rarity: 'epic'
    }
  ]

  const challenges = [
    {
      id: 1,
      title: 'Sustainable Week',
      description: 'Buy 3 eco-friendly products this week',
      progress: 2,
      target: 3,
      reward: '50 points + Eco Badge',
      timeLeft: '3 days',
      type: 'weekly'
    },
    {
      id: 2,
      title: 'Social Shopping',
      description: 'Complete 2 collaborative shopping sessions',
      progress: 1,
      target: 2,
      reward: '75 points + Social Badge',
      timeLeft: '5 days',
      type: 'weekly'
    },
    {
      id: 3,
      title: 'Review Champion',
      description: 'Leave 10 product reviews',
      progress: 7,
      target: 10,
      reward: '100 points + Review Master Badge',
      timeLeft: '12 days',
      type: 'monthly'
    }
  ]

  const spinWheelPrizes = [
    { id: 1, name: '10% Off', probability: 30, color: '#3B82F6' },
    { id: 2, name: '50 Points', probability: 25, color: '#10B981' },
    { id: 3, name: 'Free Shipping', probability: 20, color: '#8B5CF6' },
    { id: 4, name: '20% Off', probability: 15, color: '#F59E0B' },
    { id: 5, name: '100 Points', probability: 8, color: '#EF4444' },
    { id: 6, name: 'Mystery Gift', probability: 2, color: '#EC4899' }
  ]

  const currentLevel = levels.find(level => 
    state.gamificationData.points >= level.minPoints && 
    state.gamificationData.points <= level.maxPoints
  ) || levels[0]

  const nextLevel = levels.find(level => level.level === currentLevel.level + 1)
  const progressToNext = nextLevel 
    ? ((state.gamificationData.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  useEffect(() => {
    // Initialize gamification data if empty
    if (state.gamificationData.points === 0) {
      dispatch({
        type: 'UPDATE_GAMIFICATION',
        payload: {
          points: 250,
          level: 2,
          badges: ['first-purchase', 'eco-warrior', 'social-shopper'],
          streaks: 5
        }
      })
    }
  }, [dispatch, state.gamificationData.points])

  const spinWheel = async () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    
    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Determine prize based on probability
    const random = Math.random() * 100
    let cumulativeProbability = 0
    let selectedPrize = spinWheelPrizes[0]
    
    for (const prize of spinWheelPrizes) {
      cumulativeProbability += prize.probability
      if (random <= cumulativeProbability) {
        selectedPrize = prize
        break
      }
    }
    
    setSpinResult(selectedPrize)
    setIsSpinning(false)
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Award points if applicable
    if (selectedPrize.name.includes('Points')) {
      const points = parseInt(selectedPrize.name.match(/\d+/)[0])
      dispatch({
        type: 'UPDATE_GAMIFICATION',
        payload: {
          points: state.gamificationData.points + points
        }
      })
    }
    
    toast.success(`You won: ${selectedPrize.name}!`, { icon: '🎉' })
  }

  const claimDailyReward = () => {
    const points = 25
    dispatch({
      type: 'UPDATE_GAMIFICATION',
      payload: {
        points: state.gamificationData.points + points,
        streaks: state.gamificationData.streaks + 1
      }
    })
    
    toast.success(`Daily reward claimed! +${points} points`, { icon: '🎁' })
  }

  const SpinWheel = () => (
    <div className="relative w-64 h-64 mx-auto">
      <motion.div
        className="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden"
        animate={isSpinning ? { rotate: 1440 } : {}}
        transition={{ duration: 3, ease: 'easeOut' }}
      >
        {spinWheelPrizes.map((prize, index) => {
          const angle = (360 / spinWheelPrizes.length) * index
          const nextAngle = (360 / spinWheelPrizes.length) * (index + 1)
          
          return (
            <div
              key={prize.id}
              className="absolute w-full h-full"
              style={{
                background: `conic-gradient(from ${angle}deg, ${prize.color} ${angle}deg, ${prize.color} ${nextAngle}deg, transparent ${nextAngle}deg)`,
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
              }}
            >
              <div
                className="absolute text-white font-bold text-sm"
                style={{
                  top: '20%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle + (360 / spinWheelPrizes.length) / 2}deg)`,
                  transformOrigin: '50% 150%'
                }}
              >
                {prize.name}
              </div>
            </div>
          )
        })}
      </motion.div>
      
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500" />
      </div>
    </div>
  )

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
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
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4"
            >
              <TrophyIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Rewards & Achievements
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Level up your shopping experience! Earn points, unlock badges, 
            complete challenges, and win amazing rewards.
          </p>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Level Progress */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Level {currentLevel.level}
                  </h3>
                  <p className={`text-${currentLevel.color}-600 font-medium`}>
                    {currentLevel.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    {state.gamificationData.points}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Points
                  </p>
                </div>
              </div>
              
              {nextLevel && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress to {nextLevel.name}</span>
                    <span>{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className={`bg-gradient-to-r from-${currentLevel.color}-500 to-${currentLevel.color}-600 h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {nextLevel.minPoints - state.gamificationData.points} points to next level
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {state.gamificationData.streaks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Day Streak
                </p>
              </div>
              
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                <StarIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {badges.filter(b => b.earned).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Badges Earned
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-effect rounded-2xl p-6 mb-8"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
                Badges
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      badge.earned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className={`font-semibold text-sm mb-1 ${
                      badge.earned 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </p>
                    <div className={`mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                      badge.rarity === 'common' ? 'bg-gray-200 text-gray-800' :
                      badge.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                      badge.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {badge.rarity}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Daily Rewards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <GiftIcon className="w-6 h-6 text-pink-500 mr-2" />
                Daily Rewards
              </h3>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GiftIcon className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Daily Bonus Ready!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Claim your daily 25 points
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={claimDailyReward}
                  className="btn-primary px-6 py-2 rounded-full"
                >
                  Claim Reward
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Challenges */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <BoltIcon className="w-6 h-6 text-blue-500 mr-2" />
                Active Challenges
              </h3>
              
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {challenge.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        challenge.type === 'weekly' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {challenge.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        🎁 {challenge.reward}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ⏰ {challenge.timeLeft}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Spin Wheel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <SparklesIcon className="w-6 h-6 text-purple-500 mr-2" />
                Lucky Spin
              </h3>
              
              {!showSpinWheel ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Free Spin Available!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Spin the wheel for amazing prizes
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSpinWheel(true)}
                    className="btn-primary px-6 py-2 rounded-full"
                  >
                    Spin Now!
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <SpinWheel />
                  
                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={spinWheel}
                      disabled={isSpinning}
                      className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                        isSpinning
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN!'}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {spinResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                      >
                        <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                          🎉 You Won: {spinResult.name}!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-effect rounded-2xl p-8 mt-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <ChartBarIcon className="w-6 h-6 text-green-500 mr-2" />
            Weekly Leaderboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { rank: 1, name: 'You', points: 1250, avatar: '/api/placeholder/40/40', badge: '👑' },
              { rank: 2, name: 'Sarah Chen', points: 1180, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40', badge: '🥈' },
              { rank: 3, name: 'Mike Johnson', points: 1050, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40', badge: '🥉' }
            ].map((player) => (
              <motion.div
                key={player.rank}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                  player.rank === 1
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-4xl mb-2">{player.badge}</div>
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {player.name}
                </h4>
                <p className="text-2xl font-bold text-purple-600 mb-1">
                  {player.points}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  points
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}