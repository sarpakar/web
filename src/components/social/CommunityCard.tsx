'use client';

import { FoodCommunity } from '@/types';

interface CommunityCardProps {
  community: FoodCommunity;
  onJoin?: (communityId: string) => void;
}

export default function CommunityCard({ community, onJoin }: CommunityCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-br from-blue-500 to-indigo-600">
        {community.bannerURL && (
          <img
            src={community.bannerURL}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        {community.isVerified && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="-mt-10 h-16 w-16 overflow-hidden rounded-xl border-4 border-white bg-gray-200">
            {community.imageURL ? (
              <img
                src={community.imageURL}
                alt={community.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 text-xl">
                🍽️
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-1">
            <h3 className="font-semibold text-gray-900">{community.name}</h3>
            <p className="text-sm text-gray-500">{community.memberCount} members</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{community.description}</p>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {community.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Member Avatars */}
        {community.memberAvatars && community.memberAvatars.length > 0 && (
          <div className="mt-3 flex items-center">
            <div className="flex -space-x-2">
              {community.memberAvatars.slice(0, 5).map((avatar, index) => (
                <div
                  key={index}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-gray-200"
                >
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            {community.memberCount > 5 && (
              <span className="ml-2 text-xs text-gray-500">
                +{community.memberCount - 5} more
              </span>
            )}
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={() => community.id && onJoin?.(community.id)}
          className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Join Community
        </button>
      </div>
    </div>
  );
}



