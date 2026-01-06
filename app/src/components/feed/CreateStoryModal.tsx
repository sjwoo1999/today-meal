'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { useStoryStore } from '@/store';

interface CreateStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (storyId: string) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const mealTypes: { id: MealType; label: string; emoji: string }[] = [
    { id: 'breakfast', label: '아침', emoji: '🌅' },
    { id: 'lunch', label: '점심', emoji: '☀️' },
    { id: 'dinner', label: '저녁', emoji: '🌙' },
    { id: 'snack', label: '간식', emoji: '🍪' },
];

// Mock food images for demo
const mockFoodImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
];

export default function CreateStoryModal({ isOpen, onClose, onSuccess }: CreateStoryModalProps) {
    const { addStory } = useStoryStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setSelectedImage(null);
        setCaption('');
        setSelectedMealType('lunch');
        onClose();
    };

    const handleSelectImage = () => {
        // Mock image selection - randomly pick one
        const randomImage = mockFoodImages[Math.floor(Math.random() * mockFoodImages.length)];
        setSelectedImage(randomImage);
    };

    const handleCreate = async () => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const newStory = addStory({
            imageUrl: selectedImage,
            caption: caption || undefined,
            mealType: selectedMealType,
        });

        setIsSubmitting(false);

        if (onSuccess) {
            onSuccess(newStory.id);
        }
        handleClose();
    };

    const canSubmit = selectedImage && !isSubmitting;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <h2 className="text-lg font-bold">스토리 올리기</h2>
                            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-6 space-y-6">
                            {/* Image Picker */}
                            <div>
                                <button
                                    onClick={handleSelectImage}
                                    className="w-full aspect-square max-h-[300px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                                >
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt="Selected food"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <Camera className="w-12 h-12 text-gray-400 mb-2" />
                                            <p className="text-gray-500 font-medium">사진 선택하기</p>
                                            <p className="text-gray-400 text-sm mt-1">탭하여 사진을 선택하세요</p>
                                        </>
                                    )}
                                </button>
                                {selectedImage && (
                                    <button
                                        onClick={handleSelectImage}
                                        className="w-full mt-2 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                                    >
                                        다른 사진 선택
                                    </button>
                                )}
                            </div>

                            {/* Meal Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    식사 종류
                                </label>
                                <div className="flex gap-2">
                                    {mealTypes.map((meal) => (
                                        <button
                                            key={meal.id}
                                            onClick={() => setSelectedMealType(meal.id)}
                                            className={`flex-1 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                                                selectedMealType === meal.id
                                                    ? 'border-green-500 bg-green-50 text-green-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="mr-1">{meal.emoji}</span>
                                            {meal.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Caption Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    한 줄 메모 (선택)
                                </label>
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="오늘의 건강한 한끼!"
                                    maxLength={100}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">{caption.length}/100</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-4 border-t">
                            <button
                                onClick={handleCreate}
                                disabled={!canSubmit}
                                className={`w-full py-3.5 rounded-xl font-bold transition-colors ${
                                    canSubmit
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                {isSubmitting ? '올리는 중...' : '스토리 올리기'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
