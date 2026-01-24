'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { FoodCommunity } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  CheckCircle, 
  Plus, 
  Search,
  TrendingUp,
  Loader2
} from 'lucide-react';

export default function CommunitiesPage() {
  const { user, userProfile } = useAuthStore();
  const [communities, setCommunities] = useState<FoodCommunity[]>([]);
  const [myCommunities, setMyCommunities] = useState<FoodCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    loadCommunities();
  }, [user]);

  const loadCommunities = async () => {
    setIsLoading(true);
    try {
      const [allCommunities, userCommunities] = await Promise.all([
        socialService.fetchCommunities(),
        user ? socialService.fetchMyCommunities(user.uid) : Promise.resolve([]),
      ]);
      setCommunities(allCommunities);
      setMyCommunities(userCommunities);
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (community: FoodCommunity) => {
    if (!user || !community.id) return;
    setJoiningId(community.id);
    try {
      await socialService.joinCommunity(
        community.id,
        user.uid,
        userProfile?.name || user.displayName || 'User',
        userProfile?.photoURL || user.photoURL || undefined
      );
      await loadCommunities();
    } catch (error) {
      console.error('Failed to join community:', error);
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeave = async (communityId: string) => {
    if (!user) return;
    setJoiningId(communityId);
    try {
      await socialService.leaveCommunity(communityId, user.uid);
      await loadCommunities();
    } catch (error) {
      console.error('Failed to leave community:', error);
    } finally {
      setJoiningId(null);
    }
  };

  const isJoined = (communityId: string) => {
    return myCommunities.some(c => c.id === communityId);
  };

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Communities</h1>
        <p className="text-gray-500 mt-1">Join food communities and connect with others</p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-colors"
        />
      </div>

      {/* My Communities */}
      {myCommunities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Communities</h2>
          <div className="space-y-3">
            {myCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                isJoined={true}
                isLoading={joiningId === community.id}
                onJoin={() => {}}
                onLeave={() => handleLeave(community.id!)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discover Communities */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Discover Communities</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No communities found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommunityCard
                  community={community}
                  isJoined={isJoined(community.id!)}
                  isLoading={joiningId === community.id}
                  onJoin={() => handleJoin(community)}
                  onLeave={() => handleLeave(community.id!)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Community Card Component
function CommunityCard({ 
  community, 
  isJoined,
  isLoading,
  onJoin,
  onLeave
}: { 
  community: FoodCommunity;
  isJoined: boolean;
  isLoading: boolean;
  onJoin: () => void;
  onLeave: () => void;
}) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-soft transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-20 h-20 flex-shrink-0">
          {community.imageURL ? (
            <Image
              src={community.imageURL}
              alt={community.name}
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{community.name}</h3>
                {community.isVerified && (
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{community.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{community.memberCount.toLocaleString()} members</span>
            </div>

            <button
              onClick={isJoined ? onLeave : onJoin}
              disabled={isLoading}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                isJoined
                  ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isJoined ? (
                'Leave'
              ) : (
                'Join'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {community.tags && community.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {community.tags.slice(0, 4).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}



