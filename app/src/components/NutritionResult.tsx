'use client';

import { motion } from 'framer-motion';
import { Edit2, ShoppingCart, Check, Package, UtensilsCrossed } from 'lucide-react';
import { FoodAnalysisResult } from '@/types/foodAnalysis';
import { ConfidenceBadge, CalorieRange } from './ConfidenceBadge';

interface NutritionResultProps {
    /** 분석 결과 */
    result: FoodAnalysisResult;
    /** 수정 버튼 클릭 */
    onEdit?: () => void;
    /** 기록 저장 버튼 클릭 */
    onSave?: () => void;
    /** 구매 링크 클릭 */
    onPurchase?: () => void;
    /** 저장 중 여부 */
    isSaving?: boolean;
}

/**
 * 영양 분석 결과 카드
 */
export default function NutritionResult({
    result,
    onEdit,
    onSave,
    onPurchase,
    isSaving = false,
}: NutritionResultProps) {
    const { foodName, nutrition, confidence, isPackaged, brand, servingSize } = result;

    // 영양소 비율 계산 (탄단지)
    const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat;
    const proteinRatio = totalMacros > 0 ? (nutrition.protein / totalMacros) * 100 : 0;
    const carbsRatio = totalMacros > 0 ? (nutrition.carbs / totalMacros) * 100 : 0;
    const fatRatio = totalMacros > 0 ? (nutrition.fat / totalMacros) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {isPackaged ? (
                                <Package className="w-4 h-4 text-blue-500" />
                            ) : (
                                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                            )}
                            <span className="text-xs text-gray-500">
                                {isPackaged ? '포장식품' : '조리음식'} · {servingSize}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{foodName}</h3>
                        {brand && (
                            <p className="text-sm text-gray-500">{brand}</p>
                        )}
                    </div>
                    <ConfidenceBadge confidence={confidence} size="sm" />
                </div>
            </div>

            {/* 칼로리 */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <CalorieRange
                        calories={nutrition.calories}
                        caloriesMin={nutrition.caloriesMin}
                        caloriesMax={nutrition.caloriesMax}
                        size="lg"
                    />
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            수정
                        </button>
                    )}
                </div>
            </div>

            {/* 영양소 */}
            <div className="p-4">
                {/* 영양소 바 */}
                <div className="mb-4">
                    <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${proteinRatio}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-green-400 h-full"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${carbsRatio}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-blue-400 h-full"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fatRatio}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-purple-400 h-full"
                        />
                    </div>
                </div>

                {/* 영양소 상세 */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs text-gray-500">단백질</span>
                        </div>
                        <p className="font-bold text-gray-900">{nutrition.protein}g</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-xs text-gray-500">탄수화물</span>
                        </div>
                        <p className="font-bold text-gray-900">{nutrition.carbs}g</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <span className="text-xs text-gray-500">지방</span>
                        </div>
                        <p className="font-bold text-gray-900">{nutrition.fat}g</p>
                    </div>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
                {onPurchase && isPackaged && (
                    <button
                        onClick={onPurchase}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        구매하기
                    </button>
                )}
                {onSave && (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                저장 중...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                기록 저장
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
