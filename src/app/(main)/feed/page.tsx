'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { fridgeService, FridgeItem } from '@/services/fridgeService';
import { Post, FridgeItemEmbed } from '@/types';
import Link from 'next/link';
import PostComposer from '@/components/feed/PostComposer';
import FeedPost from '@/components/feed/FeedPost';
import MacroCircles from '@/components/feed/MacroCircles';

// Helper to normalize Firebase Storage URLs
function normalizeURL(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

// Helper to format relative time
function formatRelativeTime(date: Date | undefined): string {
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

// Helper to generate Microlink screenshot URL for thumbnails
const getMicrolinkImage = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

// Sample video post
const sampleVideoPosts = [
  {
    id: 'video-1',
    author: {
      id: 'user-chef',
      name: 'Campus Chef',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop',
      university: 'NYU',
      major: 'Culinary Arts',
    },
    content: 'Just made this amazing dish! 🔥 What do you think?',
    timestamp: '10m',
    likes: 127,
    comments: 24,
    videoURL: '/video.mp4',
  },
];

// Sample link embed posts with real articles and proper thumbnails
const sampleLinkPosts = [
  {
    id: 'sample-1',
    author: {
      id: 'user-emma',
      name: 'Emma Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      university: 'NYU',
      major: 'Food Studies',
    },
    content: 'OMG just got a reservation here!! 3 Michelin stars, here I come 🌟🌟🌟',
    timestamp: '2h',
    likes: 47,
    comments: 12,
    linkEmbed: {
      url: 'https://www.le-bernardin.com/menus/dining-room/dinner',
      title: 'Le Bernardin by Eric Ripert | NYC Fine Dining',
      description: 'Experience the finest seafood in New York City. Chef Eric Ripert\'s 3-Michelin star restaurant offers an unforgettable culinary journey with a four-course prix fixe dinner.',
      imageURL: 'https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/44213a8288e14e44bc156d1e48af086e.jpeg',
      siteName: 'le-bernardin.com',
    },
  },
  {
    id: 'sample-2',
    author: {
      id: 'user-marcus',
      name: 'Marcus Williams',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      university: 'Columbia',
      major: 'Culinary Arts',
    },
    content: 'This viral TikTok recipe is actually insane 🔥 Made it last night and my roommates went crazy',
    timestamp: '4h',
    likes: 156,
    comments: 34,
    linkEmbed: {
      url: 'https://www.tasteofhome.com/collection/tiktok-recipes/',
      title: '75 Viral TikTok Recipes and Food Hacks You Need to Try',
      description: 'From the famous baked feta pasta to crispy garlic parm accordion potatoes - discover the most mouth-watering viral recipes taking over TikTok in 2026.',
      imageURL: 'https://www.tasteofhome.com/wp-content/uploads/2021/12/TOH-square-FT-tiktok-trends-getty-images-3.jpg',
      siteName: 'tasteofhome.com',
    },
  },
  {
    id: 'sample-3',
    author: {
      id: 'user-sofia',
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      university: 'NYU',
      major: 'Nutrition',
    },
    content: 'NYC Restaurant Week is here!! These Michelin spots have amazing deals 🍽️ Who wants to go??',
    timestamp: '1h',
    likes: 89,
    comments: 23,
    linkEmbed: {
      url: 'https://www.timeout.com/newyork/restaurants/9-michelin-guide-rated-restaurants-to-book-for-nyc-restaurant-week',
      title: '10 Michelin-Rated Restaurants to Book for NYC Restaurant Week Winter 2026',
      description: 'Score prix-fixe meals at $30, $45 or $60 at over 500 restaurants from January 20 to February 12, including Bib Gourmands and starred restaurants.',
      imageURL: 'https://media.timeout.com/images/105441417/image.jpg',
      siteName: 'timeout.com',
    },
  },
  {
    id: 'sample-4',
    author: {
      id: 'user-james',
      name: 'James Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      university: 'Parsons',
      major: 'Design',
    },
    content: 'Following this account for healthy meal prep ideas. The salmon rice bowl recipe changed my life 🍣',
    timestamp: '3h',
    likes: 234,
    comments: 45,
    linkEmbed: {
      url: 'https://www.instagram.com/healthygirlkitchen/',
      title: '@healthygirlkitchen • 5.2M followers',
      description: '2x NYT best-selling cookbook author helping you live your healthiest plant-based life. Simple recipes that actually taste amazing.',
      imageURL: getMicrolinkImage('https://www.instagram.com/healthygirlkitchen/'),
      siteName: 'Instagram',
    },
  },
  {
    id: 'sample-5',
    author: {
      id: 'user-olivia',
      name: 'Olivia Martinez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      university: 'Fordham',
      major: 'Business',
    },
    content: 'Trying this Filipino adobo recipe this weekend! Looks so hearty and perfect for winter ❄️',
    timestamp: '5h',
    likes: 67,
    comments: 18,
    linkEmbed: {
      url: 'https://www.thekitchn.com/filipino-beef-short-ribs-adobo-recipe-23690655',
      title: 'Filipino Beef Short Ribs Adobo Recipe',
      description: 'This hearty winter stew features tender short ribs braised in a bold, tangy sauce with soy sauce, vinegar, and garlic.',
      imageURL: getMicrolinkImage('https://www.thekitchn.com/filipino-beef-short-ribs-adobo-recipe-23690655'),
      siteName: 'thekitchn.com',
    },
  },
  {
    id: 'sample-6',
    author: {
      id: 'user-alex',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      university: 'NYU Stern',
      major: 'Finance',
    },
    content: 'Sushi Sho just got 3 Michelin stars!! 🍣⭐⭐⭐ Definitely adding this to my bucket list',
    timestamp: '6h',
    likes: 312,
    comments: 56,
    linkEmbed: {
      url: 'https://guide.michelin.com/us/en/article/michelin-guide-ceremony/all-the-stars-in-the-michelin-guide-to-new-york-city-2025',
      title: 'All the Stars in The MICHELIN Guide to New York City 2025',
      description: 'Sushi Sho earns the highest 3-star rating. Plus discover all newly starred restaurants including Bridges, Huso, Muku, and Yamada.',
      imageURL: 'https://static.prod.r53.tablethotels.com/media/ecs/global/michelin-articles/NortheastMGC-2025/nyc/huso-lead.jpg',
      siteName: 'guide.michelin.com',
    },
  },
  {
    id: 'sample-7',
    author: {
      id: 'user-maya',
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      university: 'Columbia',
      major: 'Pre-Med',
    },
    content: 'Need to try this dumpling bake hack!! Looks so easy for busy weeknights 🥟',
    timestamp: '30m',
    likes: 145,
    comments: 28,
    linkEmbed: {
      url: 'https://www.tiktok.com/@recipes',
      title: 'Viral Recipes | TikTok',
      description: 'Discover the Trader Joe\'s Dumpling Bake, Pickle Fries, Butter Boards and more trending food hacks taking over your FYP.',
      imageURL: getMicrolinkImage('https://www.tiktok.com/@recipes'),
      siteName: 'TikTok',
    },
  },
  {
    id: 'sample-8',
    author: {
      id: 'user-daniel',
      name: 'Daniel Kim',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      university: 'NYU Tisch',
      major: 'Film',
    },
    content: 'Ottolenghi never misses 🙌 His Instagram is pure food art',
    timestamp: '7h',
    likes: 198,
    comments: 41,
    linkEmbed: {
      url: 'https://www.instagram.com/ottolenghi/',
      title: '@ottolenghi • 2.9M followers',
      description: 'Yotam Ottolenghi - Writer, cook, and restaurant owner. Sharing vibrant, flavor-forward Middle Eastern and Mediterranean recipes.',
      imageURL: getMicrolinkImage('https://www.instagram.com/ottolenghi/'),
      siteName: 'Instagram',
    },
  },
];

// Sample users for fridge item posts
const sampleFridgeUsers = [
  { id: 'user-sarah', name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', university: 'NYU', major: 'Environmental Science' },
  { id: 'user-kevin', name: 'Kevin Nguyen', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', university: 'Columbia', major: 'Computer Science' },
  { id: 'user-lisa', name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop', university: 'Parsons', major: 'Fashion Design' },
];

// Sample captions for fridge item shares
const sampleCaptions = [
  { message: 'available', captions: ['Anyone want some? 🙌', 'Up for grabs!', 'Free to a good home 😊', 'Taking up space in my fridge - who wants it?'] },
  { message: 'expiring', captions: ['About to expire - please take! ⏰', 'Use it or lose it! 😅', 'Expiring soon - any takers?', 'Need this gone before it goes bad!'] },
  { message: 'trade', captions: ['Anyone want to trade? 🔄', 'Looking to swap for something else!', 'Trade me for some veggies?', 'Willing to trade! What do you have?'] },
  { message: 'recipe_idea', captions: ['What can I make with this? 💡', 'Need recipe ideas please!', 'Help! What should I cook?', 'Running out of ideas - suggestions?'] },
];

function getRandomCaption(message: string): string {
  const messageGroup = sampleCaptions.find(c => c.message === message);
  if (!messageGroup) return 'Check out my fridge item!';
  return messageGroup.captions[Math.floor(Math.random() * messageGroup.captions.length)];
}

function getMessageForItem(item: FridgeItem): 'available' | 'expiring' | 'trade' | 'recipe_idea' {
  if (item.expiryDays !== undefined && item.expiryDays <= 3) return 'expiring';
  const messages: ('available' | 'trade' | 'recipe_idea')[] = ['available', 'trade', 'recipe_idea'];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function FeedPage() {
  const { user, userProfile } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [fridgeItemPosts, setFridgeItemPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
    loadFridgeItems();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const feedPosts = await socialService.fetchFeed(30);
      setPosts(feedPosts);
      console.log('Loaded', feedPosts.length, 'posts from Firestore');
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFridgeItems = async () => {
    try {
      // Load items from the shared fridge
      const fridgeId = 'dMw3fTlIvIpnXkqe1W4o';
      const items = await fridgeService.getFridgeItems(fridgeId);
      const nonConsumedItems = items.filter(item => !item.isConsumed);

      const fridgePosts: any[] = [];

      // Create "What can I cook" grid posts (groups of 3 items)
      if (nonConsumedItems.length >= 3) {
        // First grid post
        fridgePosts.push({
          id: 'fridge-grid-1',
          type: 'fridge-grid',
          author: sampleFridgeUsers[0],
          content: 'What can I cook with these? 🤔💭',
          timestamp: '20m',
          likes: Math.floor(Math.random() * 80) + 30,
          comments: Math.floor(Math.random() * 25) + 10,
          fridgeItemsGrid: nonConsumedItems.slice(0, 3).map(item => ({
            itemId: item.id,
            fridgeId: fridgeId,
            name: item.name,
            emoji: item.emoji || '📦',
            category: item.category,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            expiryDays: item.expiryDays,
          } as FridgeItemEmbed)),
        });
      }

      // Second grid post if we have enough items
      if (nonConsumedItems.length >= 6) {
        fridgePosts.push({
          id: 'fridge-grid-2',
          type: 'fridge-grid',
          author: sampleFridgeUsers[1],
          content: 'Help me use these up! Any ideas? 🙏',
          timestamp: '45m',
          likes: Math.floor(Math.random() * 60) + 20,
          comments: Math.floor(Math.random() * 20) + 8,
          fridgeItemsGrid: nonConsumedItems.slice(3, 6).map(item => ({
            itemId: item.id,
            fridgeId: fridgeId,
            name: item.name,
            emoji: item.emoji || '📦',
            category: item.category,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            expiryDays: item.expiryDays,
          } as FridgeItemEmbed)),
        });
      }

      // Third grid post
      if (nonConsumedItems.length >= 9) {
        fridgePosts.push({
          id: 'fridge-grid-3',
          type: 'fridge-grid',
          author: sampleFridgeUsers[2],
          content: 'Running out of recipe ideas... suggestions? 👨‍🍳',
          timestamp: '1h',
          likes: Math.floor(Math.random() * 45) + 15,
          comments: Math.floor(Math.random() * 18) + 5,
          fridgeItemsGrid: nonConsumedItems.slice(6, 9).map(item => ({
            itemId: item.id,
            fridgeId: fridgeId,
            name: item.name,
            emoji: item.emoji || '📦',
            category: item.category,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            expiryDays: item.expiryDays,
          } as FridgeItemEmbed)),
        });
      }

      setFridgeItemPosts(fridgePosts);
      console.log('Loaded', fridgePosts.length, 'fridge grid posts');
    } catch (error) {
      console.error('Failed to load fridge items:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user || !userProfile) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likedBy?.includes(user.uid);

    try {
      if (isLiked) {
        await socialService.unlikePost(postId, user.uid);
      } else {
        await socialService.likePost(
          postId,
          user.uid,
          userProfile.name || 'Anonymous',
          userProfile.photoURL || undefined,
          post.userId
        );
      }

      // Optimistically update UI
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newLikedBy = isLiked
            ? (p.likedBy || []).filter(id => id !== user.uid)
            : [...(p.likedBy || []), user.uid];
          return {
            ...p,
            likedBy: newLikedBy,
            likeCount: (p.likeCount || 0) + (isLiked ? -1 : 1),
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Combine all sample posts (video + fridge items from Firebase + link embeds)
  const allSamplePosts = [...sampleVideoPosts, ...fridgeItemPosts, ...sampleLinkPosts];

  // Interleave sample posts with real posts
  const interleavedPosts = () => {
    const result: any[] = [];
    let sampleIndex = 0;

    // Add sample posts at intervals
    posts.forEach((post, index) => {
      result.push({ ...post, type: 'real' });

      // Insert a sample post every 2-3 real posts
      if ((index + 1) % 2 === 0 && sampleIndex < allSamplePosts.length) {
        result.push({ ...allSamplePosts[sampleIndex], type: 'sample' });
        sampleIndex++;
      }
    });

    // If no real posts, show sample posts
    if (posts.length === 0) {
      return allSamplePosts.map(p => ({ ...p, type: 'sample' }));
    }

    // Add remaining sample posts at the end
    while (sampleIndex < allSamplePosts.length) {
      result.push({ ...allSamplePosts[sampleIndex], type: 'sample' });
      sampleIndex++;
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC]">
      {/* Macro Nutrient Circles */}
      <MacroCircles />

      {/* Post Composer */}
      <PostComposer />

      {/* Feed Posts */}
      <div className="px-4 space-y-4 pb-4">
        {interleavedPosts().map((post: any) => (
          post.type === 'sample' ? (
            <FeedPost
              key={post.id}
              author={post.author}
              content={post.content}
              images={[]}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
              isLiked={false}
              linkEmbed={post.linkEmbed}
              fridgeItemEmbed={post.fridgeItemEmbed}
              fridgeItemsGrid={post.fridgeItemsGrid}
              videoURL={post.videoURL}
            />
          ) : (
            <FeedPost
              key={post.id}
              author={{
                id: post.userId,
                name: post.userName,
                avatar: normalizeURL(post.userPhotoURL) || null,
                university: post.mealType || '',
                major: post.calories ? `${post.calories} cal` : '',
              }}
              content={post.caption || post.title}
              images={post.thumbnailURL ? [normalizeURL(post.thumbnailURL) || ''] : []}
              timestamp={formatRelativeTime(post.timestamp as Date)}
              likes={post.likeCount || 0}
              comments={post.engagement?.comments || 0}
              isLiked={user ? post.likedBy?.includes(user.uid) : false}
              onLike={() => post.id && handleLike(post.id)}
              restaurantName={post.restaurantName || post.location}
              videoURL={normalizeURL(post.videoURL)}
              linkEmbed={post.linkEmbed}
            />
          )
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mx-4 mb-4 loading-container">
          <div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center justify-center py-12 animate-loading-fade-in">
              <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800" />
              <p className="mt-3 text-sm text-gray-500 animate-content-fade-in">Loading posts...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
