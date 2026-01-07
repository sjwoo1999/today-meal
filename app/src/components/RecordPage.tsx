'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Dumbbell, History, Utensils, TrendingUp } from 'lucide-react';
import { FoodRecordFlow } from '@/components/record';
import { WorkoutScreenshotUploader } from '@/components/workout/WorkoutScreenshotUploader';
import { WorkoutExtractionResult } from '@/components/workout/WorkoutExtractionResult';
import { useNutritionStore } from '@/store';
import { useWorkouts } from '@/hooks/workout/useWorkouts';
import type { Workout } from '@/types/workout';

type RecordTab = 'meal' | 'workout';
type WorkoutFlowState = 'idle' | 'uploading' | 'result';

export default function RecordPage() {
    const [showRecordFlow, setShowRecordFlow] = useState(false);
    const [activeTab, setActiveTab] = useState<RecordTab>('meal');
    const [workoutFlowState, setWorkoutFlowState] = useState<WorkoutFlowState>('idle');

    const { todayNutrition, mealRecords } = useNutritionStore();
    const {
        todayWorkouts,
        isLoading: workoutLoading,
        extractFromImage,
        addWorkout
    } = useWorkouts();

    const [extractionResult, setExtractionResult] = useState<{
        success: boolean;
        data?: Partial<Workout>;
        confidence: number;
        error?: { code: string; message: string };
    } | null>(null);

    const todayMeals = mealRecords.filter(record => {
        const recordDate = new Date(record.recordedAt);
        const today = new Date();
        return recordDate.toDateString() === today.toDateString();
    });

    const handleStartRecord = () => {
        if (activeTab === 'meal') {
            setShowRecordFlow(true);
        } else {
            setWorkoutFlowState('uploading');
        }
    };

    const handleCloseRecord = () => {
        setShowRecordFlow(false);
        setWorkoutFlowState('idle');
        setExtractionResult(null);
    };

    const handleRecordComplete = () => {
        setShowRecordFlow(false);
    };

    // 운동 이미지 분석
    const handleAnalyzeWorkout = async (imageBase64: string) => {
        const result = await extractFromImage(imageBase64);
        setExtractionResult(result);
        setWorkoutFlowState('result');
    };

    // 운동 저장
    const handleSaveWorkout = (workout: Workout) => {
        addWorkout(workout);
        setWorkoutFlowState('idle');
        setExtractionResult(null);
    };

    // 식사 기록 플로우
    if (showRecordFlow && activeTab === 'meal') {
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
                <h1 className="text-2xl font-bold mb-1">📸 기록하기</h1>
                <p className="text-green-100">사진만 찍으면 AI가 자동으로 분석해요!</p>
            </div>

            <div className="px-4 -mt-6 space-y-4">
                {/* Tab Selector */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex gap-2">
                    <button
                        onClick={() => setActiveTab('meal')}
                        className={
                            'flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ' +
                            (activeTab === 'meal'
                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                                : 'text-gray-500 hover:bg-gray-100')
                        }
                    >
                        <Utensils className="w-5 h-5" />
                        식단 기록
                    </button>
                    <button
                        onClick={() => setActiveTab('workout')}
                        className={
                            'flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ' +
                            (activeTab === 'workout'
                                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                                : 'text-gray-500 hover:bg-gray-100')
                        }
                    >
                        <Dumbbell className="w-5 h-5" />
                        운동 기록
                    </button>
                </div>

                {/* Record Card */}
                {workoutFlowState === 'idle' && (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <div className="text-center">
                            <motion.button
                                onClick={handleStartRecord}
                                data-testid={activeTab === 'meal' ? 'record-meal-button' : 'record-workout-button'}
                                className={
                                    'w-24 h-24 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 ' +
                                    (activeTab === 'meal'
                                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                                        : 'bg-gradient-to-r from-purple-400 to-blue-600')
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {activeTab === 'meal' ? (
                                    <Camera className="w-12 h-12 text-white" />
                                ) : (
                                    <Dumbbell className="w-12 h-12 text-white" />
                                )}
                            </motion.button>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">
                                {activeTab === 'meal' ? '식사 기록하기' : '운동 기록하기'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {activeTab === 'meal'
                                    ? '음식 사진을 찍으면 AI가 분석해요'
                                    : '운동 앱 스크린샷을 업로드하세요'}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* 운동 업로더 */}
                {workoutFlowState === 'uploading' && activeTab === 'workout' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">운동 스크린샷</h2>
                            <button
                                onClick={handleCloseRecord}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                취소
                            </button>
                        </div>
                        <WorkoutScreenshotUploader
                            onUpload={() => { }}
                            onAnalyze={handleAnalyzeWorkout}
                            isAnalyzing={workoutLoading}
                        />
                    </motion.div>
                )}

                {/* 운동 추출 결과 */}
                {workoutFlowState === 'result' && extractionResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <WorkoutExtractionResult
                            result={extractionResult}
                            onConfirm={handleSaveWorkout}
                            onEdit={() => { }}
                            onCancel={handleCloseRecord}
                        />
                    </motion.div>
                )}

                {/* Today's Summary */}
                {todayNutrition && activeTab === 'meal' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                    >
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            오늘의 섭취
                        </h3>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-orange-50 rounded-xl p-2">
                                <p className="font-bold text-lg text-orange-600">{todayNutrition.calories.current}</p>
                                <p className="text-xs text-gray-500">칼로리</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-2">
                                <p className="font-bold text-lg text-green-600">{todayNutrition.protein.current}g</p>
                                <p className="text-xs text-gray-500">단백질</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-2">
                                <p className="font-bold text-lg text-blue-600">{todayNutrition.carbs.current}g</p>
                                <p className="text-xs text-gray-500">탄수화물</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-2">
                                <p className="font-bold text-lg text-purple-600">{todayNutrition.fat.current}g</p>
                                <p className="text-xs text-gray-500">지방</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 운동 기록 히스토리 */}
                {activeTab === 'workout' && todayWorkouts.length > 0 && workoutFlowState === 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                    >
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <History className="w-5 h-5 text-purple-500" />
                            오늘의 운동
                        </h3>
                        <div className="space-y-2">
                            {todayWorkouts.map((workout) => (
                                <div
                                    key={workout.id}
                                    className="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {workout.activityType === 'running' ? '🏃' :
                                                workout.activityType === 'weight' ? '🏋️' :
                                                    workout.activityType === 'cycling' ? '🚴' : '💪'}
                                        </span>
                                        <div>
                                            <p className="font-medium">{workout.activityName || workout.activityType}</p>
                                            <p className="text-xs text-gray-500">{workout.durationMinutes}분</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-purple-600">
                                        {workout.caloriesBurned || 0}kcal
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Meal History */}
                {activeTab === 'meal' && todayMeals.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                    >
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <History className="w-5 h-5 text-green-500" />
                            오늘의 식사
                        </h3>
                        <div className="space-y-2">
                            {todayMeals.map((meal) => (
                                <div
                                    key={meal.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {meal.mealType === 'breakfast' ? '🌅' :
                                                meal.mealType === 'lunch' ? '☀️' :
                                                    meal.mealType === 'dinner' ? '🌙' : '🍪'}
                                        </span>
                                        <div>
                                            <p className="font-medium">
                                                {meal.foods.map(f => f.nameKr).join(', ') || '식사'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(meal.recordedAt).toLocaleTimeString('ko-KR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-600">{meal.totalCalories}kcal</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
