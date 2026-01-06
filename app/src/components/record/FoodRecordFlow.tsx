'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import ImageCapture from './ImageCapture';
import AIAnalyzing from './AIAnalyzing';
import RecognitionResult from './RecognitionResult';
import NutritionEditor, { type NutritionData } from './NutritionEditor';
import MealTimeSelector, { type MealType } from './MealTimeSelector';
import { mockRecognizeFood, type FoodDBItem } from '@/data/foods_db';
import { useNutritionStore, useUserStore, useUIStore } from '@/store';
import type { MealRecord, FoodItem } from '@/types';

type FlowState = 'idle' | 'capture' | 'analyzing' | 'result' | 'edit' | 'save';

interface FoodRecordFlowProps {
    onClose: () => void;
    onComplete: () => void;
}

export default function FoodRecordFlow({ onClose, onComplete }: FoodRecordFlowProps) {
    const [flowState, setFlowState] = useState<FlowState>('capture');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [recognizedFood, setRecognizedFood] = useState<FoodDBItem | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [mealType, setMealType] = useState<MealType>(() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 10) return 'breakfast';
        if (hour >= 11 && hour < 14) return 'lunch';
        if (hour >= 17 && hour < 21) return 'dinner';
        return 'snack';
    });
    const [nutrition, setNutrition] = useState<NutritionData | null>(null);
    const [memo, setMemo] = useState('');

    const { addMealRecord } = useNutritionStore();
    const { addXP } = useUserStore();
    const { showXP } = useUIStore();

    const handleCapture = (imageData: string) => {
        setCapturedImage(imageData);
        setFlowState('analyzing');
    };

    const handleAnalysisComplete = useCallback(() => {
        // Simulate AI recognition with mock data
        const { food, confidence: conf } = mockRecognizeFood();
        setRecognizedFood(food);
        setConfidence(conf);
        setNutrition({
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            servingSize: food.servingSize,
            servingGrams: food.servingGrams,
        });
        setFlowState('result');
    }, []);

    const handleConfirmFood = (food: FoodDBItem) => {
        setRecognizedFood(food);
        setNutrition({
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            servingSize: food.servingSize,
            servingGrams: food.servingGrams,
        });
        setFlowState('edit');
    };

    const handleSave = () => {
        if (!recognizedFood || !nutrition) return;

        // Convert FoodDBItem to FoodItem
        const foodItem: FoodItem = {
            id: recognizedFood.id,
            name: recognizedFood.name,
            nameKr: recognizedFood.nameKr,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            servingSize: nutrition.servingSize,
            category: recognizedFood.category,
        };

        // Create proper MealRecord
        const mealRecord: MealRecord = {
            id: `meal_${Date.now()}`,
            userId: 'user_1',
            mealType,
            foods: [foodItem],
            totalCalories: nutrition.calories,
            totalProtein: nutrition.protein,
            totalCarbs: nutrition.carbs,
            totalFat: nutrition.fat,
            imageUrl: capturedImage || undefined,
            note: memo || undefined,
            recordedAt: new Date(),
            xpEarned: 10,
        };

        // Add to nutrition store
        addMealRecord(mealRecord);

        // Award XP
        addXP(10, '식사 기록');
        showXP(10, '식사 기록');

        setFlowState('save');

        // Show success and close
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    const handleBack = () => {
        switch (flowState) {
            case 'result':
                setFlowState('capture');
                break;
            case 'edit':
                setFlowState('result');
                break;
            default:
                onClose();
        }
    };

    return (
        <AnimatePresence mode="wait">
            {flowState === 'capture' && (
                <ImageCapture
                    key="capture"
                    onCapture={handleCapture}
                    onCancel={onClose}
                />
            )}

            {flowState === 'analyzing' && (
                <AIAnalyzing
                    key="analyzing"
                    onComplete={handleAnalysisComplete}
                />
            )}

            {flowState === 'result' && recognizedFood && (
                <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-gray-50"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                        <button onClick={handleBack} className="p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="font-semibold text-gray-900">인식 결과</h1>
                        <button onClick={onClose} className="p-2 -mr-2">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 pb-24 overflow-y-auto">
                        <RecognitionResult
                            recognizedFood={recognizedFood}
                            confidence={confidence}
                            onConfirm={handleConfirmFood}
                            onEdit={() => setFlowState('edit')}
                        />
                    </div>
                </motion.div>
            )}

            {flowState === 'edit' && recognizedFood && nutrition && (
                <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                        <button onClick={handleBack} className="p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="font-semibold text-gray-900">식사 기록</h1>
                        <button onClick={onClose} className="p-2 -mr-2">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Food Name */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">
                                    {recognizedFood.category === 'korean' && '🍚'}
                                    {recognizedFood.category === 'chinese' && '🥡'}
                                    {recognizedFood.category === 'japanese' && '🍱'}
                                    {recognizedFood.category === 'western' && '🍝'}
                                    {recognizedFood.category === 'snack' && '🍿'}
                                    {recognizedFood.category === 'drink' && '🥤'}
                                    {recognizedFood.category === 'dessert' && '🍰'}
                                </span>
                                <div>
                                    <h3 className="font-bold text-gray-900">{recognizedFood.nameKr}</h3>
                                    <p className="text-sm text-gray-500">{recognizedFood.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Meal Time */}
                        <MealTimeSelector
                            selected={mealType}
                            onChange={setMealType}
                        />

                        {/* Nutrition Editor */}
                        <NutritionEditor
                            nutrition={nutrition}
                            onChange={setNutrition}
                        />

                        {/* Memo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">메모 (선택)</label>
                            <textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="오늘의 식사는 어땠나요?"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                        <motion.button
                            onClick={handleSave}
                            whileTap={{ scale: 0.98 }}
                            data-testid="complete-record"
                            className="w-full py-3.5 rounded-xl bg-green-500 text-white font-semibold"
                        >
                            기록 저장하기
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {flowState === 'save' && (
                <motion.div
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    data-testid="record-success"
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
                    >
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </motion.svg>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-gray-900 mb-2"
                    >
                        기록 완료!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-500"
                    >
                        오늘도 건강한 한끼 기록 💪
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
