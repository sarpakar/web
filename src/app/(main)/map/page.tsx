'use client';

import { MapPin, Navigation, Clock } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] flex items-center justify-center p-4">
      <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-gray-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Map Coming Soon
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We're working on an interactive map to help you discover restaurants, cafés, and food spots near your campus.
        </p>

        {/* Features Preview */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Find Nearby Places</p>
              <p className="text-xs text-gray-500">Discover food spots around you</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Real-time Info</p>
              <p className="text-xs text-gray-500">See wait times & open hours</p>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">In Development</span>
        </div>
      </div>
    </div>
  );
}
