'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { FoodChallenge } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { 
  Trophy, 
  Users, 
  Clock, 
  Target,
  Flame,
  Plus,
  Loader2,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export default function ChallengesPage() {
  const { user, userProfile } = useAuthStore();
  const [challenges, setChallenges] = useState<FoodChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'my'>('discover');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      const data = await socialService.fetchChallenges();
      setChallenges(data);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (challenge: FoodChallenge) => {
    if (!user || !challenge.id) return;
    setJoiningId(challenge.id);
    try {
      await socialService.joinChallenge(
        challenge,
        user.uid,
        userProfile?.name || user.displayName || 'User',
        userProfile?.photoURL || user.photoURL || undefined
      );
      await loadChallenges();
    } catch (error) {
      console.error('Failed to join challenge:', error);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Challenges</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Complete challenges and earn rewards</p>
      </header>

      {/* Stats Banner - Responsive: stack on mobile, row on tablet+ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 mb-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <p className="text-white/80 text-sm">Current Streak</p>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-6 sm:w-8 h-6 sm:h-8" />
              <span className="text-3xl sm:text-4xl font-bold">7</span>
              <span className="text-white/80 text-sm sm:text-base">days</span>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-white/80 text-sm">Total XP</p>
            <p className="text-2xl sm:text-3xl font-bold">{userProfile?.totalXP || 0}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'discover'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'my'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Challenges
        </button>
      </div>

      {/* Challenge List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-100 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No active challenges</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for new challenges!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChallengeCard
                challenge={challenge}
                isLoading={joiningId === challenge.id}
                onJoin={() => handleJoin(challenge)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({
  challenge,
  isLoading,
  onJoin,
}: {
  challenge: FoodChallenge;
  isLoading: boolean;
  onJoin: () => void;
}) {
  const daysLeft = differenceInDays(challenge.endDate as Date, new Date());
  const progress = challenge.currentValue 
    ? Math.min(100, (challenge.currentValue / challenge.goalValue) * 100)
    : 0;

  return (
    <article 
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-soft transition-shadow"
      style={{ 
        borderTopColor: challenge.bannerColor || '#000',
        borderTopWidth: '3px'
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              {challenge.isOfficial && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Official
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
          </div>
          {challenge.xpReward && (
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-gray-900">+{challenge.xpReward}</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          )}
        </div>

        {/* Progress */}
        {challenge.currentValue !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">
                {challenge.currentValue} / {challenge.goalValue} {challenge.goalUnit}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: challenge.bannerColor || '#000' }}
              />
            </div>
          </div>
        )}

        {/* Stats - Responsive: wrap on mobile */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participantCount.toLocaleString()} joined</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{challenge.goalValue} {challenge.goalUnit}</span>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={onJoin}
          disabled={isLoading || daysLeft <= 0}
          className="w-full mt-4 py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Join Challenge
            </>
          )}
        </button>
      </div>
    </article>
  );
}



