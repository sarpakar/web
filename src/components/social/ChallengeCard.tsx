'use client';

import { FoodChallenge } from '@/types';
import { formatDate } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: FoodChallenge;
  onJoin?: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onJoin }: ChallengeCardProps) {
  const endDate = challenge.endDate instanceof Date 
    ? challenge.endDate 
    : challenge.endDate?.toDate?.() || new Date();
  
  const startDate = challenge.startDate instanceof Date 
    ? challenge.startDate 
    : challenge.startDate?.toDate?.() || new Date();

  const now = new Date();
  const isActive = startDate <= now && endDate >= now;
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const progress = challenge.currentValue 
    ? Math.min(100, (challenge.currentValue / challenge.goalValue) * 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Banner */}
      <div 
        className="relative h-28"
        style={{ 
          backgroundColor: challenge.bannerColor || '#3B82F6'
        }}
      >
        {challenge.imageURL && (
          <img
            src={challenge.imageURL}
            alt={challenge.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badge */}
        {challenge.isOfficial && (
          <div className="absolute right-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-yellow-900">
            ⭐ Official
          </div>
        )}

        {/* Status */}
        <div className="absolute bottom-2 left-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {isActive ? `${daysRemaining}d left` : 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

        {/* Goal */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Goal: {challenge.goalValue} {challenge.goalUnit}</span>
            {challenge.currentValue !== undefined && (
              <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
            )}
          </div>
          {challenge.currentValue !== undefined && (
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {challenge.participantAvatars && challenge.participantAvatars.length > 0 ? (
              <div className="flex -space-x-2">
                {challenge.participantAvatars.slice(0, 4).map((avatar, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-200"
                  >
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <span className="text-xs text-gray-500">
              {challenge.participantCount} participating
            </span>
          </div>

          {challenge.xpReward && (
            <span className="text-xs font-medium text-purple-600">
              +{challenge.xpReward} XP
            </span>
          )}
        </div>

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={() => challenge.id && onJoin?.(challenge.id)}
          className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Join Challenge
        </button>
      </div>
    </div>
  );
}



