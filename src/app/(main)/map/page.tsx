'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { vendorService } from '@/services/vendorService';
import { Vendor, VendorCategory } from '@/types';

// Default center: NYU Washington Square
const DEFAULT_CENTER = { lat: 40.7295, lng: -73.9965 };
const DEFAULT_ZOOM = 15;

// Category filter options
const CATEGORIES: { label: string; value: VendorCategory | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: '🍽️ Restaurants', value: 'Restaurants' },
  { label: '☕ Cafés', value: 'Cafés' },
  { label: '🛒 Groceries', value: 'Groceries' },
  { label: '🍰 Desserts', value: 'Desserts' },
  { label: '🏪 Convenience', value: 'Convenience' },
];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'All'>('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load vendors from Firestore
  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      const allVendors = await vendorService.getAllVendors();
      setVendors(allVendors);
      setFilteredVendors(allVendors);
      setIsLoading(false);
    };
    loadVendors();
  }, []);

  // Filter vendors by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredVendors(vendors);
    } else {
      setFilteredVendors(vendors.filter(v => v.category === selectedCategory));
    }
  }, [selectedCategory, vendors]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        setMapLoaded(true);
        return;
      }

      // Check if script already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkLoaded = setInterval(() => {
          if (window.google?.maps) {
            setMapLoaded(true);
            clearInterval(checkLoaded);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      // Google Maps API Key from iOS APIKeys-Info.plist
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAiWBvb_37j2MmHLN-aUh-DWM70Sktv_AA';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps || mapInstanceRef.current) return;

    const center = userLocation || DEFAULT_CENTER;
    
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: DEFAULT_ZOOM,
      mapId: 'campus_meals_map',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
  }, [userLocation]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      initMap();
    }
  }, [mapLoaded, initMap]);

  // Update markers when vendors change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !window.google?.maps?.marker) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    // Add new markers
    filteredVendors.forEach(vendor => {
      if (!vendor.latitude || !vendor.longitude) return;

      // Create marker content
      const markerContent = document.createElement('div');
      markerContent.className = 'vendor-marker';
      markerContent.innerHTML = `
        <div style="
          background: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid ${selectedVendor?.id === vendor.id ? '#3B82F6' : 'white'};
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <span style="font-size: 18px;">${getCategoryEmoji(vendor.category)}</span>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: { lat: vendor.latitude, lng: vendor.longitude },
        content: markerContent,
        title: vendor.name
      });

      marker.addListener('click', () => {
        setSelectedVendor(vendor);
        mapInstanceRef.current?.panTo({ lat: vendor.latitude, lng: vendor.longitude });
      });

      markersRef.current.push(marker);
    });
  }, [filteredVendors, mapLoaded, selectedVendor?.id]);

  const getCategoryEmoji = (category: VendorCategory): string => {
    const emojiMap: Record<string, string> = {
      'Restaurants': '🍽️',
      'Cafés': '☕',
      'Groceries': '🛒',
      'Desserts': '🍰',
      'Convenience': '🏪',
      'Alcohol': '🍷',
      'All': '📍'
    };
    return emojiMap[category] || '📍';
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(userLocation);
      mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Map not loaded fallback */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="absolute left-4 right-4 top-4 z-10">
        <div className="flex gap-2 overflow-x-auto rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Location Button */}
      {userLocation && (
        <button
          onClick={centerOnUserLocation}
          className="absolute bottom-36 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-gray-50"
        >
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}

      {/* Vendor count badge */}
      <div className="absolute bottom-36 left-4 z-10 rounded-full bg-white px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? 'Loading...' : `${filteredVendors.length} places`}
        </span>
      </div>

      {/* Selected Vendor Card */}
      {selectedVendor && (
        <div className="absolute bottom-4 left-4 right-4 z-10 animate-in slide-in-from-bottom duration-300">
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-start gap-4">
              {/* Vendor Image */}
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200">
                {selectedVendor.imageURL ? (
                  <img
                    src={selectedVendor.imageURL}
                    alt={selectedVendor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    {getCategoryEmoji(selectedVendor.category)}
                  </div>
                )}
              </div>

              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedVendor.name}</h3>
                    <p className="text-sm text-gray-500">{selectedVendor.cuisine || selectedVendor.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{selectedVendor.rating.toFixed(1)}</span>
                    {selectedVendor.reviewCount > 0 && (
                      <span className="text-gray-400">({selectedVendor.reviewCount})</span>
                    )}
                  </div>

                  {/* Price */}
                  <span className="text-green-600 font-medium">{selectedVendor.priceRange}</span>

                  {/* Open status */}
                  {selectedVendor.isOpen !== undefined && (
                    <span className={selectedVendor.isOpen ? 'text-green-600' : 'text-red-500'}>
                      {selectedVendor.isOpen ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>

                {/* Address */}
                {selectedVendor.address && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">{selectedVendor.address}</p>
                )}

                {/* Action Buttons */}
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    View Details
                  </button>
                  {selectedVendor.googleMapsUri && (
                    <a
                      href={selectedVendor.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add type declaration for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

