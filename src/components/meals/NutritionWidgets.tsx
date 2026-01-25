'use client';

import { motion } from 'framer-motion';
import { MealLog } from '@/types';
import { Flame, Beef, Droplet, Wheat, TrendingUp, Target } from 'lucide-react';

interface NutritionWidgetsProps {
  meals: MealLog[];
  dailyGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Apple-inspired colors for each nutrient
const nutrientColors = {
  calories: {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    bg: 'from-gray-500/10 to-gray-400/5',
    ring: '#6B7280',
  },
  protein: {
    primary: '#FF2D55',
    secondary: '#FF6482',
    bg: 'from-pink-500/10 to-rose-400/5',
    ring: '#FF2D55',
  },
  carbs: {
    primary: '#5856D6',
    secondary: '#7A79E0',
    bg: 'from-indigo-500/10 to-purple-400/5',
    ring: '#5856D6',
  },
  fat: {
    primary: '#30D158',
    secondary: '#5DD87D',
    bg: 'from-green-500/10 to-emerald-400/5',
    ring: '#30D158',
  },
};

// Circular progress ring component
function CircularProgress({ 
  progress, 
  size = 60, 
  strokeWidth = 5,
  color 
}: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function NutritionWidgets({ meals, dailyGoals }: NutritionWidgetsProps) {
  // Default daily goals (based on 2000 cal diet)
  const goals = dailyGoals || {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65,
  };

  // Calculate today's totals
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysMeals = meals.filter(meal => {
    const mealDate = new Date(meal.date as Date);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === today.getTime();
  });

  const totals = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const nutrients = [
    {
      key: 'calories',
      label: 'Calories',
      value: totals.calories,
      goal: goals.calories,
      unit: 'kcal',
      icon: Flame,
      colors: nutrientColors.calories,
    },
    {
      key: 'protein',
      label: 'Protein',
      value: totals.protein,
      goal: goals.protein,
      unit: 'g',
      icon: Beef,
      colors: nutrientColors.protein,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: totals.carbs,
      goal: goals.carbs,
      unit: 'g',
      icon: Wheat,
      colors: nutrientColors.carbs,
    },
    {
      key: 'fat',
      label: 'Fat',
      value: totals.fat,
      goal: goals.fat,
      unit: 'g',
      icon: Droplet,
      colors: nutrientColors.fat,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Today&apos;s Nutrition</h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1">
          <Target className="w-3.5 h-3.5" />
          Goals
        </button>
      </div>

      {/* Nutrition Grid - Apple Widget Style */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        {nutrients.map((nutrient) => {
          const progress = nutrient.goal > 0 ? (nutrient.value / nutrient.goal) * 100 : 0;
          const Icon = nutrient.icon;
          const isOverGoal = progress > 100;
          
          return (
            <motion.div
              key={nutrient.key}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${nutrient.colors.bg} p-4 cursor-pointer transition-shadow hover:shadow-lg`}
              style={{ 
                boxShadow: `0 0 0 1px ${nutrient.colors.ring}10`,
              }}
            >
              {/* Background decorative ring */}
              <div 
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.08]"
                style={{ backgroundColor: nutrient.colors.primary }}
              />
              
              {/* Content */}
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${nutrient.colors.primary}20` }}
                    >
                      <Icon 
                        className="w-3.5 h-3.5" 
                        style={{ color: nutrient.colors.primary }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {nutrient.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span 
                      className="text-2xl font-bold tabular-nums"
                      style={{ color: nutrient.colors.primary }}
                    >
                      {Math.round(nutrient.value)}
                    </span>
                    <span className="text-xs text-gray-400">
                      / {nutrient.goal}{nutrient.unit}
                    </span>
                  </div>

                  {/* Progress indicator text */}
                  <div className="flex items-center gap-1 mt-1">
                    {isOverGoal ? (
                      <span className="text-[10px] font-medium text-gray-700">
                        +{Math.round(nutrient.value - nutrient.goal)}{nutrient.unit} over
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400">
                        {Math.round(nutrient.goal - nutrient.value)}{nutrient.unit} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative flex items-center justify-center">
                  <CircularProgress 
                    progress={progress} 
                    size={48} 
                    strokeWidth={4}
                    color={nutrient.colors.primary}
                  />
                  <span 
                    className="absolute text-[10px] font-semibold"
                    style={{ color: nutrient.colors.primary }}
                  >
                    {Math.min(Math.round(progress), 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Card */}
      {todaysMeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Daily Summary</p>
                <p className="text-[11px] text-gray-500">
                  {Math.round((totals.calories / goals.calories) * 100)}% of calorie goal
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{totals.calories}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">kcal today</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {todaysMeals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 p-6 rounded-2xl bg-gray-50 text-center"
        >
          <div className="text-3xl mb-2">🍽️</div>
          <p className="text-sm font-medium text-gray-700">No meals logged today</p>
          <p className="text-xs text-gray-500 mt-1">Log your first meal to see nutrition stats</p>
        </motion.div>
      )}
    </div>
  );
}


