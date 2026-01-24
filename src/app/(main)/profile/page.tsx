'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { mealLogService } from '@/services/mealLogService';
import { MealLog } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  User, 
  Trophy, 
  Flame,
  Camera,
  Calendar,
  Award,
  Edit2
} from 'lucide-react';
import Link from 'next/link';
import MyMealsCarousel from '@/components/meals/MyMealsCarousel';
import NutritionWidgets from '@/components/meals/NutritionWidgets';

export default function ProfilePage() {
  const { user, userProfile } = useAuthStore();
  const [recentMeals, setRecentMeals] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'meals' | 'stats' | 'badges'>('meals');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const meals = await mealLogService.fetchRecentMeals(user.uid, 20);
      setRecentMeals(meals);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalMeals = recentMeals.length;
  const uniqueRestaurants = new Set(recentMeals.map(m => m.venueName).filter(Boolean)).size;
  const avgCalories = Math.round(
    recentMeals.reduce((sum, m) => sum + (m.calories || 0), 0) / (totalMeals || 1)
  );

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 px-4"
      >
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          {userProfile?.photoURL || user?.photoURL ? (
            <Image
              src={userProfile?.photoURL || user?.photoURL || ''}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Name & Level */}
        <h1 className="text-2xl font-bold">
          {userProfile?.name || user?.displayName || 'User'}
        </h1>
        <p className="text-gray-500 mt-1">{user?.email}</p>

        {/* XP Progress */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Level {userProfile?.level || 1}</span>
            <span className="text-gray-500">{userProfile?.totalXP || 0} / {(userProfile?.level || 1) * 1000} XP</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((userProfile?.totalXP || 0) % 1000) / 10}%` }}
              className="h-full bg-black rounded-full"
            />
          </div>
        </div>

        {/* Settings Button */}
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-3 mb-6 px-4"
      >
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{totalMeals}</div>
          <div className="text-xs text-gray-500">Meals</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{uniqueRestaurants}</div>
          <div className="text-xs text-gray-500">Places</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">7</span>
          </div>
          <div className="text-xs text-orange-600">Streak</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{avgCalories}</div>
          <div className="text-xs text-gray-500">Avg Cal</div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4 mx-4">
        {(['meals', 'stats', 'badges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'meals' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* My Meals Carousel */}
          <MyMealsCarousel meals={recentMeals} isLoading={isLoading} />
          
          {/* Nutrition Widgets */}
          <NutritionWidgets meals={recentMeals} />
        </motion.div>
      )}

      {activeTab === 'stats' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 px-4"
        >
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Member since"
            value={userProfile?.createdAt ? format(userProfile.createdAt, 'MMM yyyy') : 'Recently'}
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Challenges completed"
            value={userProfile?.completedMatches?.toString() || '0'}
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label="Badges earned"
            value={userProfile?.badges?.length?.toString() || '0'}
          />
        </motion.div>
      )}

      {activeTab === 'badges' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4"
        >
          {userProfile?.badges && userProfile.badges.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {userProfile.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className="text-center p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{badge.rarity}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No badges yet</p>
              <p className="text-sm text-gray-400 mt-1">Complete challenges to earn badges</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
      <div className="p-3 bg-white rounded-xl">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
