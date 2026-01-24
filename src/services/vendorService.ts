// ============================================================================
// Vendor Service - Firestore CRUD for Venues
// Matches iOS VendorService - Collection name: 'venues'
// ============================================================================

import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc, where, orderBy, limit } from 'firebase/firestore';
import { Vendor } from '@/types';

// Collection name matches iOS app and Firestore rules
const VENUES_COLLECTION = 'venues';

export const vendorService = {
  /**
   * Get all venues from Firestore
   */
  async getAllVendors(): Promise<Vendor[]> {
    try {
      const q = query(collection(db, VENUES_COLLECTION), orderBy('rating', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Vendor));
    } catch (error) {
      console.error('Error fetching venues:', error);
      return [];
    }
  },

  /**
   * Get venues by category
   */
  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    try {
      const q = query(
        collection(db, VENUES_COLLECTION),
        where('category', '==', category),
        orderBy('rating', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Vendor));
    } catch (error) {
      console.error('Error fetching venues by category:', error);
      return [];
    }
  },

  /**
   * Get a single venue by ID
   */
  async getVendorById(vendorId: string): Promise<Vendor | null> {
    try {
      const docRef = doc(db, VENUES_COLLECTION, vendorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Vendor;
      }
      return null;
    } catch (error) {
      console.error('Error fetching venue:', error);
      return null;
    }
  },

  /**
   * Get vendors near a location
   * Note: For proper geo queries, consider using GeoFirestore or a cloud function
   */
  async getVendorsNearLocation(lat: number, lng: number, radiusKm: number = 5): Promise<Vendor[]> {
    try {
      // Simple bounding box approach (not precise but fast)
      // For production, use GeoFirestore or a proper geo-query solution
      const latDelta = radiusKm / 111; // ~111km per degree latitude
      const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

      const allVendors = await this.getAllVendors();
      
      return allVendors.filter(vendor => {
        if (!vendor.latitude || !vendor.longitude) return false;
        return (
          vendor.latitude >= lat - latDelta &&
          vendor.latitude <= lat + latDelta &&
          vendor.longitude >= lng - lngDelta &&
          vendor.longitude <= lng + lngDelta
        );
      });
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
      return [];
    }
  },

  /**
   * Search vendors by name or cuisine
   */
  async searchVendors(searchTerm: string): Promise<Vendor[]> {
    try {
      const allVendors = await this.getAllVendors();
      const term = searchTerm.toLowerCase();
      
      return allVendors.filter(vendor => 
        vendor.name.toLowerCase().includes(term) ||
        vendor.cuisine?.toLowerCase().includes(term) ||
        vendor.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching vendors:', error);
      return [];
    }
  },

  /**
   * Get featured/top-rated venues
   */
  async getFeaturedVendors(): Promise<Vendor[]> {
    try {
      const q = query(
        collection(db, VENUES_COLLECTION),
        where('rating', '>=', 4.5),
        orderBy('rating', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Vendor));
    } catch (error) {
      console.error('Error fetching featured venues:', error);
      return [];
    }
  },

  /**
   * Get venue menu items
   */
  async getVenueItems(venueId: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'venue_items'),
        where('venueId', '==', venueId),
        orderBy('reviewBoostScore', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching venue items:', error);
      return [];
    }
  }
};



