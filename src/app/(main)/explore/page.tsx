'use client';

import { useEffect, useState } from 'react';
import { vendorService } from '@/services/vendorService';
import { Vendor, VendorCategory } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import VendorCard from '@/components/vendors/VendorCard';
import Link from 'next/link';

const CATEGORIES: { label: string; value: VendorCategory | 'All'; emoji: string }[] = [
  { label: 'All', value: 'All', emoji: '🍽️' },
  { label: 'Restaurants', value: 'Restaurants', emoji: '🍽️' },
  { label: 'Cafés', value: 'Cafés', emoji: '☕' },
  { label: 'Groceries', value: 'Groceries', emoji: '🛒' },
  { label: 'Desserts', value: 'Desserts', emoji: '🍰' },
  { label: 'Convenience', value: 'Convenience', emoji: '🏪' },
];

export default function ExplorePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [allVendors, featured] = await Promise.all([
        vendorService.getAllVendors(),
        vendorService.getFeaturedVendors()
      ]);
      setVendors(allVendors);
      setFilteredVendors(allVendors);
      setFeaturedVendors(featured);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = vendors;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.cuisine?.toLowerCase().includes(query) ||
        v.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredVendors(filtered);
  }, [selectedCategory, searchQuery, vendors]);

  if (loading) {
    return <LoadingSpinner text="Loading places..." />;
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
        <p className="mt-1 text-gray-500">Discover restaurants, cafés, and more around you</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisine types..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === cat.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Section */}
      {featuredVendors.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">⭐ Top Rated</h2>
            <Link href="/map" className="text-sm text-blue-600 hover:underline">
              View on map →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVendors.slice(0, 3).map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      )}

      {/* All Vendors */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCategory === 'All' ? 'All Places' : selectedCategory}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredVendors.length} places)
            </span>
          </h2>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No places found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
