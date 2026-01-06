'use client';

import { motion } from 'framer-motion';
import { Sun, Coffee, Moon, Cookie } from 'lucide-react';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTimeSelectorProps {
    selected: MealType;
    onChange: (mealType: MealType) => void;
}

const mealOptions: { type: MealType; label: string; icon: React.ReactNode; time: string }[] = [
    { type: 'breakfast', label: '아침', icon: <Coffee className="w-4 h-4" />, time: '6-10시' },
    { type: 'lunch', label: '점심', icon: <Sun className="w-4 h-4" />, time: '11-14시' },
    { type: 'dinner', label: '저녁', icon: <Moon className="w-4 h-4" />, time: '17-21시' },
    { type: 'snack', label: '간식', icon: <Cookie className="w-4 h-4" />, time: '언제든' },
];

export default function MealTimeSelector({ selected, onChange }: MealTimeSelectorProps) {
    // Auto-suggest based on current time
    const getCurrentMealSuggestion = (): MealType => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 10) return 'breakfast';
        if (hour >= 11 && hour < 14) return 'lunch';
        if (hour >= 17 && hour < 21) return 'dinner';
        return 'snack';
    };

    const suggestedMeal = getCurrentMealSuggestion();

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">식사 시간</label>
                {suggestedMeal === selected && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        추천
                    </span>
                )}
            </div>
            <div className="grid grid-cols-4 gap-2">
                {mealOptions.map((option) => (
                    <motion.button
                        key={option.type}
                        type="button"
                        onClick={() => onChange(option.type)}
                        whileTap={{ scale: 0.95 }}
                        data-testid={`meal-type-${option.type}`}
                        className={`
                            flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors
                            ${selected === option.type
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }
                        `}
                    >
                        <span className={selected === option.type ? 'text-green-600' : 'text-gray-500'}>
                            {option.icon}
                        </span>
                        <span className="text-sm font-medium">{option.label}</span>
                        <span className="text-[10px] text-gray-400">{option.time}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
