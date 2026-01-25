'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { mealLogService, MealLogService } from '@/services/mealLogService';
import { MealLog, MealLogType, MealLogTypeInfo } from '@/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  MapPin, 
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function LogMealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [step, setStep] = useState<'photo' | 'details' | 'nutrition'>('photo');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Meal details
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState<MealLogType>(
    (searchParams.get('type') as MealLogType) || MealLogService.suggestedMealType()
  );
  const [venueName, setVenueName] = useState('');
  const [notes, setNotes] = useState('');

  // Nutrition
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setStep('details');
    }
  };

  const handleSubmit = async () => {
    if (!user || !title) return;
    
    setIsUploading(true);
    try {
      let photoURL: string | undefined;
      let photoStoragePath: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        const timestamp = Date.now();
        const path = `media/${user.uid}/meals/${timestamp}_${selectedImage.name}`;
        const storageRef = ref(storage, path);
        
        await uploadBytes(storageRef, selectedImage);
        photoURL = await getDownloadURL(storageRef);
        photoStoragePath = path;
      }

      // Create meal log
      const mealLog: Omit<MealLog, 'id'> = {
        userId: user.uid,
        date: new Date(),
        mealType,
        time: MealLogService.formatTime(new Date()),
        title,
        venueName: venueName || 'Home',
        notes: notes || undefined,
        calories: calories ? parseInt(calories) : undefined,
        protein: protein ? parseInt(protein) : undefined,
        carbs: carbs ? parseInt(carbs) : undefined,
        fat: fat ? parseInt(fat) : undefined,
        photoURL,
        photoStoragePath,
      };

      await mealLogService.createMealLog(mealLog);
      toast.success('Meal logged successfully!');
      router.push('/feed');
    } catch (error) {
      console.error('Failed to log meal:', error);
      toast.error('Failed to log meal');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'photo') router.back();
              else if (step === 'details') setStep('photo');
              else setStep('details');
            }}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold">Log Meal</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex gap-2">
          {['photo', 'details', 'nutrition'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['photo', 'details', 'nutrition'].indexOf(step) >= i
                  ? 'bg-black'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Photo */}
          {step === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Add a photo</h2>
                <p className="text-gray-500 mt-1">Take or select a photo of your meal</p>
              </div>

              {/* Image Preview or Upload Area */}
              {imagePreview ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Meal preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Tap to add photo</p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Skip or Continue */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Skip photo
                </button>
                {imagePreview && (
                  <button
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                  >
                    Continue
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Meal details</h2>
                <p className="text-gray-500 mt-1">What did you eat?</p>
              </div>

              {/* Meal Type */}
              <div className="flex gap-2 justify-center">
                {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealLogType[]).map((type) => {
                  const info = MealLogTypeInfo[type];
                  const isSelected = mealType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{info.emoji}</span>
                      <span className="text-xs font-medium">{type}</span>
                    </button>
                  );
                })}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you eat? *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Chicken Burrito Bowl"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="Restaurant or location"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was it?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                />
              </div>

              <button
                onClick={() => setStep('nutrition')}
                disabled={!title}
                className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 3: Nutrition */}
          {step === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Nutrition (optional)</h2>
                <p className="text-gray-500 mt-1">Add nutritional information</p>
              </div>

              {/* Nutrition Grid */}
              <div className="grid grid-cols-2 gap-4">
                <NutritionInput
                  label="Calories"
                  value={calories}
                  onChange={setCalories}
                  unit="cal"
                  icon={<Flame className="w-5 h-5 text-gray-600" />}
                />
                <NutritionInput
                  label="Protein"
                  value={protein}
                  onChange={setProtein}
                  unit="g"
                  icon={<span className="text-lg">💪</span>}
                />
                <NutritionInput
                  label="Carbs"
                  value={carbs}
                  onChange={setCarbs}
                  unit="g"
                  icon={<span className="text-lg">🌾</span>}
                />
                <NutritionInput
                  label="Fat"
                  value={fat}
                  onChange={setFat}
                  unit="g"
                  icon={<span className="text-lg">🫒</span>}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !title}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Skip & Save
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !title}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Meal
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NutritionInput({
  label,
  value,
  onChange,
  unit,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="--"
          className="w-full bg-transparent text-2xl font-bold focus:outline-none"
        />
        <span className="text-gray-400">{unit}</span>
      </div>
    </div>
  );
}



