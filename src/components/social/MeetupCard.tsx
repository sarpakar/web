'use client';

import { RestaurantMeetup } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';

interface MeetupCardProps {
  meetup: RestaurantMeetup;
  onRSVP?: (meetupId: string, status: 'going' | 'maybe' | 'not_going') => void;
}

export default function MeetupCard({ meetup, onRSVP }: MeetupCardProps) {
  const dateTime = meetup.dateTime instanceof Date 
    ? meetup.dateTime 
    : meetup.dateTime?.toDate?.() || new Date();

  const isUpcoming = dateTime > new Date();
  const isPast = dateTime < new Date();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Venue Image */}
      <div className="relative h-32 bg-gradient-to-br from-orange-400 to-red-500">
        {meetup.venueImageURL && (
          <img
            src={meetup.venueImageURL}
            alt={meetup.venueName}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute right-2 top-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            meetup.status === 'confirmed' 
              ? 'bg-green-500 text-white'
              : meetup.status === 'cancelled'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-yellow-900'
          }`}>
            {meetup.status.charAt(0).toUpperCase() + meetup.status.slice(1)}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-3 py-1.5 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-900">{formatDate(dateTime)}</p>
          <p className="text-xs text-gray-600">{formatTime(dateTime)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{meetup.title}</h3>
        
        {/* Venue */}
        <div className="mt-2 flex items-start gap-2">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">{meetup.venueName}</p>
            {meetup.venueAddress && (
              <p className="text-xs text-gray-500">{meetup.venueAddress}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {meetup.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{meetup.description}</p>
        )}

        {/* Host */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-200">
            {meetup.hostAvatarURL ? (
              <img src={meetup.hostAvatarURL} alt={meetup.hostName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-medium text-white">
                {meetup.hostName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            Hosted by <span className="font-medium text-gray-700">{meetup.hostName}</span>
          </span>
        </div>

        {/* Attendees */}
        <div className="mt-3 flex items-center gap-4">
          {meetup.goingAvatars && meetup.goingAvatars.length > 0 && (
            <div className="flex -space-x-2">
              {meetup.goingAvatars.slice(0, 4).map((avatar, index) => (
                <div
                  key={index}
                  className="h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-200"
                >
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-600">✓ {meetup.goingCount} going</span>
            <span className="text-yellow-600">? {meetup.maybeCount} maybe</span>
          </div>
        </div>

        {/* RSVP Buttons */}
        {isUpcoming && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => meetup.id && onRSVP?.(meetup.id, 'going')}
              className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Going
            </button>
            <button
              onClick={() => meetup.id && onRSVP?.(meetup.id, 'maybe')}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Maybe
            </button>
          </div>
        )}

        {isPast && (
          <div className="mt-4 text-center text-sm text-gray-500">
            This meetup has ended
          </div>
        )}
      </div>
    </div>
  );
}



