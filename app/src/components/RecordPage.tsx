'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Check, X, Sparkles, ChevronRight } from 'lucide-react';
import { FoodItem } from '@/types';

// Mock AI analysis result
const MOCK_ANALYSIS: { foods: FoodItem[]; confidence: number } = {
    foods: [
        { id: 'f1', name: 'Bibimbap', nameKr: '비빔밥', calories: 580, protein: 22, carbs: 85, fat: 15, servingSize: '1인분', category: 'korean' },
    ],
    confidence: 0.92,
};

interface RecordPageProps {
    onRecordComplete?: (food: FoodItem) => void;
}

export default function RecordPage({ onRecordComplete }: RecordPageProps) {
    const [step, setStep] = useState<'capture' | 'analyzing' | 'result' | 'saved'>('capture');
    const [analysisResult, setAnalysisResult] = useState<typeof MOCK_ANALYSIS | null>(null);

    const handleCapture = () => {
        // Simulate capture and AI analysis
        setStep('analyzing');

        // Simulate AI analysis
        setTimeout(() => {
            setAnalysisResult(MOCK_ANALYSIS);
            setStep('result');
        }, 2000);
    };

    const handleConfirm = () => {
        setStep('saved');
        if (analysisResult && onRecordComplete) {
            onRecordComplete(analysisResult.foods[0]);
        }
    };

    const handleReset = () => {
        setStep('capture');
        setAnalysisResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-coral-50/50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-2xl font-bold mb-1">📸 식단 기록</h1>
                <p className="text-coral-100">사진만 찍으면 자동으로 분석해줄게!</p>
            </div>

            <div className="px-4 -mt-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Capture */}
                    {step === 'capture' && (
                        <motion.div
                            key="capture"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Camera View */}
                            <div className="card p-0 overflow-hidden">
                                <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center relative">
                                    <div className="absolute inset-4 border-2 border-white/30 rounded-2xl" />
                                    <div className="text-center text-white">
                                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-white/70">음식이 잘 보이게 촬영해줘!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Capture Button */}
                            <div className="flex justify-center">
                                <motion.button
                                    onClick={handleCapture}
                                    className="w-20 h-20 bg-gradient-to-r from-coral-400 to-coral-600 
                             rounded-full flex items-center justify-center shadow-glow"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Camera className="w-10 h-10 text-white" />
                                </motion.button>
                            </div>

                            {/* Upload Option */}
                            <div className="text-center">
                                <button className="text-coral-500 font-medium flex items-center gap-2 mx-auto">
                                    <Upload className="w-4 h-4" />
                                    갤러리에서 선택
                                </button>
                            </div>

                            {/* Tips */}
                            <div className="card bg-surface-secondary">
                                <h3 className="font-bold text-text-primary mb-2">📝 촬영 팁</h3>
                                <ul className="text-sm text-text-secondary space-y-1">
                                    <li>• 음식이 전체적으로 잘 보이게 위에서 촬영해요</li>
                                    <li>• 밝은 곳에서 촬영하면 인식률이 높아요</li>
                                    <li>• 여러 음식이 있으면 한번에 촬영해도 OK!</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Analyzing */}
                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="card text-center py-12"
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 bg-coral-100 rounded-full flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-10 h-10 text-coral-500" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-text-primary mb-2">
                                AI가 분석 중...
                            </h2>
                            <p className="text-text-secondary">
                                잠시만 기다려줘! 곧 끝날거야 🍚
                            </p>
                            <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs mx-auto">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-coral-400 to-coral-600 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Result */}
                    {step === 'result' && analysisResult && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Image Preview */}
                            <div className="card p-0 overflow-hidden">
                                <div className="aspect-[4/3] bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                        🍱
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                                        ✓ 인식 완료
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Result */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-text-primary">📊 분석 결과</h3>
                                    <span className="text-sm text-sage-500 font-medium">
                                        정확도 {Math.round(analysisResult.confidence * 100)}%
                                    </span>
                                </div>

                                {analysisResult.foods.map((food) => (
                                    <div key={food.id} className="bg-surface-secondary rounded-xl p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-text-primary text-lg">{food.nameKr}</h4>
                                                <p className="text-sm text-text-secondary">{food.servingSize}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-coral-500">
                                                    {food.calories}
                                                </div>
                                                <div className="text-xs text-text-muted">kcal</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-lg font-bold text-sage-500">{food.protein}g</div>
                                                <div className="text-xs text-text-muted">단백질</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-blue-500">{food.carbs}g</div>
                                                <div className="text-xs text-text-muted">탄수화물</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-purple-500">{food.fat}g</div>
                                                <div className="text-xs text-text-muted">지방</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full text-center text-coral-500 text-sm font-medium mt-4 flex items-center justify-center gap-1">
                                    다르게 인식됐어? 수정하기
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button onClick={handleReset} className="btn-outline flex-1 flex items-center justify-center gap-2">
                                    <X className="w-5 h-5" />
                                    다시 찍기
                                </button>
                                <button onClick={handleConfirm} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                    기록 완료
                                    <span className="text-xs opacity-80">+10 XP</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Saved */}
                    {step === 'saved' && (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card text-center py-12"
                        >
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                기록 완료!
                            </h2>
                            <p className="text-text-secondary mb-4">
                                한끼가 너무 기뻐해! 💕
                            </p>
                            <div className="inline-flex items-center gap-2 bg-coral-50 text-coral-600 
                              px-4 py-2 rounded-full font-semibold mb-6">
                                <Sparkles className="w-5 h-5" />
                                +10 XP 획득!
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleReset} className="btn-primary w-full">
                                    다른 식사 기록하기
                                </button>
                                <button className="btn-outline w-full">
                                    오늘 기록 보기
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
