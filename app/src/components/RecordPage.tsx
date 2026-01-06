'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, History, Utensils, TrendingUp } from 'lucide-react';
import { FoodRecordFlow } from '@/components/record';
import { useNutritionStore } from '@/store';

export default function RecordPage() {
    const [showRecordFlow, setShowRecordFlow] = useState(false);
    const { todayNutrition, mealRecords } = useNutritionStore();

    const todayMeals = mealRecords.filter(record => {
        const recordDate = new Date(record.recordedAt);
        const today = new Date();
        return recordDate.toDateString() === today.toDateString();
    });

    const handleStartRecord = () => {
        setShowRecordFlow(true);
    };

    const handleCloseRecord = () => {
        setShowRecordFlow(false);
    };

    const handleRecordComplete = () => {
        setShowRecordFlow(false);
    };

    if (showRecordFlow) {
        return (
            <FoodRecordFlow
                onClose={handleCloseRecord}
                onComplete={handleRecordComplete}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-2xl font-bold mb-1">📸 식단 기록</h1>
                <p className="text-green-100">사진만 찍으면 AI가 자동으로 분석해요!</p>
            </div>

            <div className="px-4 -mt-6 space-y-4">
                {/* Quick Record Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <div className="text-center">
                        <motion.button
                            onClick={handleStartRecord}
                            data-testid="record-meal-button"
                            className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600
                                rounded-full flex items-center justify-center shadow-lg mx-auto mb-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Camera className="w-12 h-12 text-white" />
                        </motion.button>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                            식사 기록하기
                        </h2>
                        <p className="text-sm text-gray-500">
                            음식 사진을 찍으면 AI가 분석해요
                        </p>
                    </div>
                </motion.div>

                {/* Today's Summary */}
                {todayNutrition && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-gray-900">오늘의 섭취량</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-lg font-bold text-gray-900">
                                    {todayNutrition.calories.current}
                                </p>
                                <p className="text-xs text-gray-500">칼로리</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-lg font-bold text-blue-600">
                                    {todayNutrition.protein.current}g
                                </p>
                                <p className="text-xs text-gray-500">단백질</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-3">
                                <p className="text-lg font-bold text-amber-600">
                                    {todayNutrition.carbs.current}g
                                </p>
                                <p className="text-xs text-gray-500">탄수화물</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-3">
                                <p className="text-lg font-bold text-red-500">
                                    {todayNutrition.fat.current}g
                                </p>
                                <p className="text-xs text-gray-500">지방</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Today's Meals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <History className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900">오늘의 식사</h3>
                        <span className="text-sm text-gray-500 ml-auto">{todayMeals.length}끼</span>
                    </div>

                    {todayMeals.length > 0 ? (
                        <div className="space-y-3" data-testid="recent-records">
                            {todayMeals.map((meal) => (
                                <div
                                    key={meal.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                        <Utensils className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {meal.foods[0]?.nameKr || '식사'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {meal.mealType === 'breakfast' && '아침'}
                                            {meal.mealType === 'lunch' && '점심'}
                                            {meal.mealType === 'dinner' && '저녁'}
                                            {meal.mealType === 'snack' && '간식'}
                                            {' · '}{meal.totalCalories} kcal
                                        </p>
                                    </div>
                                    <span className="text-xs text-green-500 font-medium">
                                        +{meal.xpEarned} XP
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-2">🍽️</p>
                            <p className="text-gray-500">아직 기록된 식사가 없어요</p>
                            <p className="text-sm text-gray-400">첫 번째 식사를 기록해보세요!</p>
                        </div>
                    )}
                </motion.div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4"
                >
                    <h3 className="font-bold text-gray-900 mb-2">📝 촬영 팁</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 음식이 전체적으로 잘 보이게 위에서 촬영해요</li>
                        <li>• 밝은 곳에서 촬영하면 인식률이 높아요</li>
                        <li>• 여러 음식이 있으면 한번에 촬영해도 OK!</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
