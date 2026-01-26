'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { mealLogService } from '@/services/mealLogService';
import { MealLog } from '@/types';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  User,
  Trophy,
  Flame,
  Camera,
  Calendar,
  Award,
  Settings,
  MapPin,
  Utensils
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userProfile } = useAuthStore();
  const [recentMeals, setRecentMeals] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC]">
      {/* Profile Header Card */}
      <div className="px-4 pt-6 pb-4">
        <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
          {/* Top Row - Avatar & Settings */}
          <div className="flex items-start justify-between mb-4">
            {/* Avatar */}
            <div className="relative">
              {userProfile?.photoURL || user?.photoURL ? (
                <Image
                  src={userProfile?.photoURL || user?.photoURL || ''}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2.5 backdrop-blur-lg bg-white/60 hover:bg-white/80 rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </Link>
          </div>

          {/* Name & Bio */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {userProfile?.name || user?.displayName || 'User'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">@{user?.email?.split('@')[0] || 'username'}</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{totalMeals}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{userProfile?.friends?.length || 0}</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{uniqueRestaurants}</p>
              <p className="text-xs text-gray-500">Places</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-lg font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500 ml-1">day streak</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="p-3 bg-gray-50/80 rounded-2xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{userProfile?.level || 1}</span>
                </div>
                <span className="font-medium text-gray-900">Level {userProfile?.level || 1}</span>
              </div>
              <span className="text-gray-500 text-xs">{userProfile?.totalXP || 0} / {(userProfile?.level || 1) * 1000} XP</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${((userProfile?.totalXP || 0) % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4 text-center">
            <Utensils className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{totalMeals}</p>
            <p className="text-xs text-gray-500">Meals Logged</p>
          </div>
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4 text-center">
            <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{uniqueRestaurants}</p>
            <p className="text-xs text-gray-500">Places Visited</p>
          </div>
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4 text-center">
            <Trophy className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{userProfile?.badges?.length || 0}</p>
            <p className="text-xs text-gray-500">Badges</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex p-1 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'posts'
                ? 'bg-gray-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'saved'
                ? 'bg-gray-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="px-4 pb-24">
          {isLoading ? (
            <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
                </div>
                <p className="mt-3 text-sm text-gray-600">Loading posts...</p>
              </div>
            </div>
          ) : recentMeals.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer"
                >
                  {meal.primaryImageURL || meal.photoURL ? (
                    <img
                      src={meal.primaryImageURL || meal.photoURL}
                      alt={meal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Utensils className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No posts yet</h3>
              <p className="text-sm text-gray-500 mb-4">Share your first meal to get started</p>
              <Link
                href="/log-meal"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02]"
              >
                Log Meal
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="px-4 pb-24">
          <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved posts</h3>
            <p className="text-sm text-gray-500">Posts you save will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
