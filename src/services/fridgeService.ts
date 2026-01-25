import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FridgeItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  quantity: string;
  expiryDate: Timestamp;
  expiryDays: number;
  imageUrl?: string;
  isConsumed: boolean;
  addedBy: string;
  addedByName: string;
  addedAt: Timestamp;
  updatedAt: Timestamp;
  fridgeId: string;
}

export interface Fridge {
  id: string;
  name: string;
  ownerId: string;
  type: 'shared' | 'personal';
  inviteCode?: string;
  settings?: {
    theme?: string;
    sharedShoppingList?: boolean;
    allowMemberInvites?: boolean;
    notifyOnLowStock?: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  items?: FridgeItem[];
}

export const fridgeService = {
  /**
   * Get all fridges for the current user (as owner or member)
   */
  async getUserFridges(userId: string): Promise<Fridge[]> {
    try {
      console.log('🔍 Fetching fridges for user:', userId);
      const fridges: Fridge[] = [];

      // Strategy 1: Try to get fridges where user is owner
      try {
        console.log('📋 Strategy 1: Checking owned fridges...');
        const ownedFridgesRef = collection(db, 'fridges');
        const ownedQuery = query(ownedFridgesRef, where('ownerId', '==', userId));
        const ownedSnapshot = await getDocs(ownedQuery);
        console.log('  Found', ownedSnapshot.size, 'owned fridges');

        for (const fridgeDoc of ownedSnapshot.docs) {
          const fridgeData = fridgeDoc.data();
          console.log('  ✅ Owned fridge:', fridgeData.name);
          const items = await this.getFridgeItems(fridgeDoc.id);
          fridges.push({
            id: fridgeDoc.id,
            ...fridgeData,
            items,
          } as Fridge);
        }
      } catch (error) {
        console.error('  ❌ Error fetching owned fridges:', error);
      }

      // Strategy 2: Try to access known fridge directly (hardcoded for now)
      // TODO: In production, store fridge memberships in user document
      try {
        console.log('\n📋 Strategy 2: Trying known fridge ID...');
        const knownFridgeId = 'dMw3fTlIvIpnXkqe1W4o'; // Kek fridge
        const fridgeRef = doc(db, 'fridges', knownFridgeId);
        const fridgeDoc = await getDoc(fridgeRef);

        if (fridgeDoc.exists()) {
          const fridgeData = fridgeDoc.data();
          console.log('  ✅ Found fridge:', fridgeData.name);

          // Check if user is a member
          const memberRef = doc(db, 'fridges', knownFridgeId, 'members', userId);
          const memberDoc = await getDoc(memberRef);

          if (memberDoc.exists() || fridgeData.ownerId === userId) {
            console.log('  ✅ User is a member!');
            const items = await this.getFridgeItems(knownFridgeId);

            // Check if already added
            if (!fridges.find(f => f.id === knownFridgeId)) {
              fridges.push({
                id: fridgeDoc.id,
                ...fridgeData,
                items,
              } as Fridge);
            }
          } else {
            console.log('  ❌ User is not a member of this fridge');
          }
        } else {
          console.log('  ❌ Fridge not found');
        }
      } catch (error) {
        console.error('  ❌ Error fetching known fridge:', error);
      }

      console.log('\n✅ Returning', fridges.length, 'accessible fridges');
      return fridges;
    } catch (error) {
      console.error('❌ Error fetching user fridges:', error);
      throw error;
    }
  },

  /**
   * Get a specific fridge by ID
   */
  async getFridge(fridgeId: string): Promise<Fridge | null> {
    try {
      const fridgeRef = doc(db, 'fridges', fridgeId);
      const fridgeDoc = await getDoc(fridgeRef);

      if (!fridgeDoc.exists()) {
        return null;
      }

      const items = await this.getFridgeItems(fridgeId);

      return {
        id: fridgeDoc.id,
        ...fridgeDoc.data(),
        items,
      } as Fridge;
    } catch (error) {
      console.error('Error fetching fridge:', error);
      throw error;
    }
  },

  /**
   * Get all items in a fridge
   */
  async getFridgeItems(fridgeId: string): Promise<FridgeItem[]> {
    try {
      const itemsRef = collection(db, 'fridges', fridgeId, 'items');
      const snapshot = await getDocs(itemsRef);

      const items: FridgeItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as FridgeItem));

      // Sort by expiry date (soonest first)
      items.sort((a, b) => {
        if (a.isConsumed !== b.isConsumed) {
          return a.isConsumed ? 1 : -1; // Non-consumed items first
        }
        return a.expiryDate.seconds - b.expiryDate.seconds;
      });

      return items;
    } catch (error) {
      console.error('Error fetching fridge items:', error);
      throw error;
    }
  },

  /**
   * Get items expiring soon (within next N days)
   */
  async getExpiringSoonItems(fridgeId: string, days: number = 3): Promise<FridgeItem[]> {
    const items = await this.getFridgeItems(fridgeId);
    const now = Date.now() / 1000; // Convert to seconds
    const threshold = now + (days * 24 * 60 * 60);

    return items.filter(item =>
      !item.isConsumed &&
      item.expiryDate.seconds <= threshold &&
      item.expiryDate.seconds > now
    );
  },

  /**
   * Get items by category
   */
  async getItemsByCategory(fridgeId: string, category: string): Promise<FridgeItem[]> {
    const items = await this.getFridgeItems(fridgeId);
    return items.filter(item => item.category === category && !item.isConsumed);
  },
};
