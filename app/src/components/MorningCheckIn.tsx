'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Zap, Moon } from 'lucide-react';
import { usePersonalizationStore, useHankiStore } from '@/store';
import { ConditionLevel } from '@/types';

interface MorningCheckInProps {
    onComplete?: () => void;
}

const conditionOptions: {
    value: ConditionLevel;
    emoji: string;
    label: string;
    icon: React.ReactNode;
    response: string;
}[] = [
        {
            value: 'tired',
            emoji: '😴',
            label: '피곤해',
            icon: <Moon className="w-5 h-5" />,
            response: '그렇구나, 오늘은 가벼운 식사 위주로 추천할게! ☕',
        },
        {
            value: 'okay',
            emoji: '😊',
            label: '괜찮아',
            icon: <Sun className="w-5 h-5" />,
            response: '좋아! 오늘도 맛있게 건강해지자! 🍚',
        },
        {
            value: 'energetic',
            emoji: '💪',
            label: '활기차!',
            icon: <Zap className="w-5 h-5" />,
            response: '와! 오늘 컨디션 최고네! 단백질 많이 챙기자 💪',
        },
    ];

export default function MorningCheckIn({ onComplete }: MorningCheckInProps) {
    const { showMorningCheckIn, setCondition, completeMorningCheckIn, dismissMorningCheckIn } = usePersonalizationStore();
    const { setEmotion } = useHankiStore();
    const [selectedCondition, setSelectedCondition] = useState<ConditionLevel | null>(null);
    const [showResponse, setShowResponse] = useState(false);

    if (!showMorningCheckIn) return null;

    const handleConditionSelect = (condition: ConditionLevel) => {
        setSelectedCondition(condition);
        setCondition(condition);

        // Update Hanki emotion based on condition
        const option = conditionOptions.find(o => o.value === condition);
        if (option) {
            if (condition === 'energetic') {
                setEmotion('excited', option.response);
            } else if (condition === 'tired') {
                setEmotion('worried', option.response);
            } else {
                setEmotion('happy', option.response);
            }
        }

        setShowResponse(true);

        // Auto close after showing response
        setTimeout(() => {
            completeMorningCheckIn();
            onComplete?.();
        }, 2000);
    };

    const handleSkip = () => {
        dismissMorningCheckIn();
        onComplete?.();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white relative">
                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <motion.div
                            className="text-6xl text-center mb-3"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            🍚
                        </motion.div>

                        <h2 className="text-xl font-bold text-center">좋은 아침! ☀️</h2>
                        <p className="text-green-100 text-center text-sm mt-1">
                            오늘 컨디션 어때?
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {!showResponse ? (
                                <motion.div
                                    key="options"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    {conditionOptions.map((option, index) => (
                                        <motion.button
                                            key={option.value}
                                            onClick={() => handleConditionSelect(option.value)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                                                ${selectedCondition === option.value
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="text-3xl">{option.emoji}</span>
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold text-gray-800">
                                                    {option.label}
                                                </div>
                                            </div>
                                            <div className="text-gray-400">
                                                {option.icon}
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4"
                                >
                                    <motion.div
                                        className="text-5xl mb-4"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {conditionOptions.find(o => o.value === selectedCondition)?.emoji}
                                    </motion.div>
                                    <p className="text-gray-700 font-medium">
                                        {conditionOptions.find(o => o.value === selectedCondition)?.response}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Skip Button */}
                    {!showResponse && (
                        <div className="px-6 pb-6">
                            <button
                                onClick={handleSkip}
                                className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors py-2"
                            >
                                건너뛰기
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
