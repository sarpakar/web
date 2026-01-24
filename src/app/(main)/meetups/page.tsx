'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { RestaurantMeetup } from '@/types';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Plus,
  ChevronRight,
  Check,
  X,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function MeetupsPage() {
  const { user } = useAuthStore();
  const [meetups, setMeetups] = useState<RestaurantMeetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMeetups();
    }
  }, [user]);

  const loadMeetups = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await socialService.fetchMeetups(user.uid);
      setMeetups(data);
    } catch (error) {
      console.error('Failed to load meetups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMeetupDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const upcomingMeetups = meetups.filter(m => new Date(m.dateTime as Date) >= new Date());
  const pastMeetups = meetups.filter(m => new Date(m.dateTime as Date) < new Date());

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meetups</h1>
          <p className="text-gray-500 mt-1">Plan meals with friends</p>
        </div>
        <Link
          href="/meetups/create"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create
        </Link>
      </header>

      {/* Upcoming Meetups */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-36 bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : upcomingMeetups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming meetups</p>
            <p className="text-sm text-gray-400 mt-1">Create one to invite friends!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMeetups.map((meetup, index) => (
              <motion.div
                key={meetup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MeetupCard meetup={meetup} isHost={meetup.hostId === user?.uid} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Past Meetups */}
      {pastMeetups.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Past</h2>
          <div className="space-y-4">
            {pastMeetups.map((meetup, index) => (
              <motion.div
                key={meetup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MeetupCard meetup={meetup} isHost={meetup.hostId === user?.uid} isPast />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MeetupCard({ 
  meetup, 
  isHost,
  isPast = false 
}: { 
  meetup: RestaurantMeetup; 
  isHost: boolean;
  isPast?: boolean;
}) {
  const formatMeetupDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <article className={`bg-white border border-gray-200 rounded-2xl p-5 ${isPast ? 'opacity-60' : 'hover:shadow-soft'} transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{meetup.title}</h3>
            {isHost && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Host
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{meetup.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{formatMeetupDate(meetup.dateTime as Date)}</span>
          <span className="text-gray-400">•</span>
          <span>{format(meetup.dateTime as Date, 'h:mm a')}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{meetup.venueName}</span>
        </div>
        {meetup.venueAddress && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-4" />
            <span>{meetup.venueAddress}</span>
          </div>
        )}
      </div>

      {/* RSVP Stats */}
      <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100">
        <RSVPBadge icon={<Check className="w-4 h-4" />} count={meetup.goingCount} label="Going" color="green" />
        <RSVPBadge icon={<HelpCircle className="w-4 h-4" />} count={meetup.maybeCount} label="Maybe" color="yellow" />
        <RSVPBadge icon={<X className="w-4 h-4" />} count={meetup.notGoingCount} label="Can't go" color="red" />
      </div>

      {/* Actions */}
      {!isPast && !isHost && (
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors">
            Going
          </button>
          <button className="flex-1 py-2 px-4 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors">
            Maybe
          </button>
          <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Can't Go
          </button>
        </div>
      )}
    </article>
  );
}

function RSVPBadge({ 
  icon, 
  count, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  count: number; 
  label: string;
  color: 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  return (
    <div className={`flex items-center gap-2 ${colorClasses[color]}`}>
      {icon}
      <span className="font-medium">{count}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}



