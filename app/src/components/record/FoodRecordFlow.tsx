'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import ImageCapture from './ImageCapture';
import RecognitionResult from './RecognitionResult';
import NutritionEditor, { type NutritionData } from './NutritionEditor';
import MealTimeSelector, { type MealType } from './MealTimeSelector';
import { mockRecognizeFood, type FoodDBItem } from '@/data/foods_db';
import { useNutritionStore, useUserStore, useUIStore } from '@/store';
import type { MealRecord, FoodItem } from '@/types';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import AnalysisLoading from '@/components/AnalysisLoading';
import { FoodAnalysisResult } from '@/types/foodAnalysis';

type FlowState = 'idle' | 'capture' | 'analyzing' | 'result' | 'edit' | 'save';

interface FoodRecordFlowProps {
    onClose: () => void;
    onComplete: () => void;
}

export default function FoodRecordFlow({ onClose, onComplete }: FoodRecordFlowProps) {
    const [flowState, setFlowState] = useState<FlowState>('capture');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [recognizedFood, setRecognizedFood] = useState<FoodDBItem | null>(null);
    const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
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

    // AI 음식 분석 훅
    const { analyzeImage, result: aiResult, error: analysisError } = useFoodAnalysis();

    // AI 분석 완료 시 처리
    useEffect(() => {
        if (aiResult && flowState === 'analyzing') {
            setAnalysisResult(aiResult);
            setConfidence(aiResult.confidence);
            setNutrition({
                calories: aiResult.nutrition.calories,
                protein: aiResult.nutrition.protein,
                carbs: aiResult.nutrition.carbs,
                fat: aiResult.nutrition.fat,
                servingSize: aiResult.servingSize || '1인분',
                servingGrams: 0,
            });
            setFlowState('result');
        }
    }, [aiResult, flowState]);

    // 분석 에러 처리 - 폴백으로 Mock 데이터 사용
    useEffect(() => {
        if (analysisError && flowState === 'analyzing') {
            console.warn('AI 분석 실패, Mock 데이터 사용:', analysisError);
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
        }
    }, [analysisError, flowState]);

    const handleCapture = async (imageData: string) => {
        setCapturedImage(imageData);
        setFlowState('analyzing');

        // Base64 이미지에서 데이터 추출
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = imageData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

        // AI 분석 시작 - 빈 이미지나 변환 실패 시에도 Mock 모드로 처리됨
        try {
            // Base64 데이터가 비어있거나 유효하지 않으면 빈 File로 처리
            if (!base64Data || base64Data.length < 100) {
                // 빈 이미지 - Mock 모드에서 처리됨
                await analyzeImage(new File([], 'food.jpg', { type: mimeType }));
            } else {
                const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
                await analyzeImage(new File([binaryData], 'food.jpg', { type: mimeType }));
            }
        } catch (err) {
            console.warn('[FoodRecordFlow] Image processing failed, using mock:', err);
            // File 생성 실패 시에도 분석 시도 - Mock 모드에서 처리됨
            await analyzeImage(new File([], 'food.jpg', { type: mimeType }));
        }
    };

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

    // AI 분석 결과로 edit 화면으로 이동
    const handleConfirmAnalysis = () => {
        if (analysisResult) {
            // FoodDBItem 형태로 변환
            const fakeFood: FoodDBItem = {
                id: `ai_${Date.now()}`,
                name: analysisResult.foodName,
                nameKr: analysisResult.foodName,
                category: 'korean',
                calories: analysisResult.nutrition.calories,
                protein: analysisResult.nutrition.protein,
                carbs: analysisResult.nutrition.carbs,
                fat: analysisResult.nutrition.fat,
                servingSize: analysisResult.servingSize || '1인분',
                servingGrams: 0,
                popularityScore: 50,
                tags: ['AI분석'],
            };
            setRecognizedFood(fakeFood);
        }
        setFlowState('edit');
    };

    const handleSave = () => {
        if ((!recognizedFood && !analysisResult) || !nutrition) return;

        const foodName = recognizedFood?.nameKr || analysisResult?.foodName || '음식';
        const foodId = recognizedFood?.id || `ai_${Date.now()}`;
        const foodCategory = recognizedFood?.category || 'korean';

        // Convert to FoodItem
        const foodItem: FoodItem = {
            id: foodId,
            name: foodName,
            nameKr: foodName,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            servingSize: nutrition.servingSize,
            category: foodCategory,
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
                setAnalysisResult(null);
                setRecognizedFood(null);
                break;
            case 'edit':
                setFlowState('result');
                break;
            default:
                onClose();
        }
    };

    // 결과 화면에 표시할 음식 정보
    const displayFood = recognizedFood || (analysisResult ? {
        id: `ai_${Date.now()}`,
        name: analysisResult.foodName,
        nameKr: analysisResult.foodName,
        category: 'korean' as const,
        calories: analysisResult.nutrition.calories,
        protein: analysisResult.nutrition.protein,
        carbs: analysisResult.nutrition.carbs,
        fat: analysisResult.nutrition.fat,
        servingSize: analysisResult.servingSize || '1인분',
        servingGrams: 0,
        popularityScore: 50,
        tags: ['AI분석'],
    } : null);

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
                <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-white flex items-center justify-center"
                >
                    <AnalysisLoading message="음식을 분석하고 있어요..." />
                </motion.div>
            )}

            {flowState === 'result' && displayFood && (
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
                            recognizedFood={displayFood}
                            confidence={confidence}
                            onConfirm={analysisResult ? handleConfirmAnalysis : handleConfirmFood}
                            onEdit={() => setFlowState('edit')}
                        />
                    </div>
                </motion.div>
            )}

            {flowState === 'edit' && displayFood && nutrition && (
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
                                    {displayFood.category === 'korean' && '🍚'}
                                    {displayFood.category === 'chinese' && '🥡'}
                                    {displayFood.category === 'japanese' && '🍱'}
                                    {displayFood.category === 'western' && '🍝'}
                                    {displayFood.category === 'snack' && '🍿'}
                                    {displayFood.category === 'drink' && '🥤'}
                                    {displayFood.category === 'dessert' && '🍰'}
                                </span>
                                <div>
                                    <h3 className="font-bold text-gray-900">{displayFood.nameKr}</h3>
                                    <p className="text-sm text-gray-500">{displayFood.name}</p>
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
