'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Edit2, Search, Sparkles, X } from 'lucide-react';
import type { FoodDBItem } from '@/data/foods_db';
import { searchFoods } from '@/data/foods_db';

interface RecognitionResultProps {
    recognizedFood: FoodDBItem;
    confidence: number;
    onConfirm: (food: FoodDBItem) => void;
    onEdit: () => void;
}

export default function RecognitionResult({
    recognizedFood,
    confidence,
    onConfirm,
    onEdit,
}: RecognitionResultProps) {
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FoodDBItem[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length >= 1) {
            const results = searchFoods(query);
            setSearchResults(results.slice(0, 5));
        } else {
            setSearchResults([]);
        }
    };

    const getConfidenceColor = (conf: number) => {
        if (conf >= 0.9) return 'text-green-600 bg-green-100';
        if (conf >= 0.7) return 'text-blue-600 bg-blue-100';
        return 'text-amber-600 bg-amber-100';
    };

    const getConfidenceText = (conf: number) => {
        if (conf >= 0.9) return '높음';
        if (conf >= 0.7) return '중간';
        return '낮음';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            data-testid="recognition-result"
        >
            {/* Recognition Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Food Image Preview */}
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <span className="text-6xl">
                        {recognizedFood.category === 'korean' && '🍚'}
                        {recognizedFood.category === 'chinese' && '🥡'}
                        {recognizedFood.category === 'japanese' && '🍱'}
                        {recognizedFood.category === 'western' && '🍝'}
                        {recognizedFood.category === 'snack' && '🍿'}
                        {recognizedFood.category === 'drink' && '🥤'}
                        {recognizedFood.category === 'dessert' && '🍰'}
                    </span>
                </div>

                {/* Recognition Info */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-500">AI 인식 결과</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900" data-testid="recognized-food-name">
                                {recognizedFood.nameKr}
                            </h3>
                            <p className="text-sm text-gray-500">{recognizedFood.name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(confidence)}`} data-testid="confidence-score">
                            정확도 {getConfidenceText(confidence)}
                        </span>
                    </div>

                    {/* Quick Nutrition Preview */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl mb-4">
                        <div className="text-center" data-testid="nutrition-calories">
                            <p className="text-lg font-bold text-gray-900">{recognizedFood.calories}</p>
                            <p className="text-xs text-gray-500">kcal</p>
                        </div>
                        <div className="text-center" data-testid="nutrition-protein">
                            <p className="text-lg font-bold text-blue-600">{recognizedFood.protein}g</p>
                            <p className="text-xs text-gray-500">단백질</p>
                        </div>
                        <div className="text-center" data-testid="nutrition-carbs">
                            <p className="text-lg font-bold text-amber-600">{recognizedFood.carbs}g</p>
                            <p className="text-xs text-gray-500">탄수화물</p>
                        </div>
                        <div className="text-center" data-testid="nutrition-fat">
                            <p className="text-lg font-bold text-red-500">{recognizedFood.fat}g</p>
                            <p className="text-xs text-gray-500">지방</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-4">
                        1인분 기준 ({recognizedFood.servingSize}, {recognizedFood.servingGrams}g)
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <motion.button
                            onClick={onEdit}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-2"
                            data-testid="edit-nutrition-button"
                        >
                            <Edit2 className="w-4 h-4" />
                            수정하기
                        </motion.button>
                        <motion.button
                            onClick={() => onConfirm(recognizedFood)}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-green-500 text-white font-medium flex items-center justify-center gap-2"
                            data-testid="save-record-button"
                        >
                            <Check className="w-4 h-4" />
                            확인
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Wrong Recognition? */}
            <motion.button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium flex items-center justify-center gap-2"
            >
                <Search className="w-4 h-4" />
                다른 음식인가요?
                <ChevronRight className={`w-4 h-4 transition-transform ${showAlternatives ? 'rotate-90' : ''}`} />
            </motion.button>

            {/* Search Alternatives */}
            {showAlternatives && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="음식 이름 검색..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {searchResults.length > 0 && (
                        <div className="space-y-1">
                            {searchResults.map((food) => (
                                <motion.button
                                    key={food.id}
                                    onClick={() => onConfirm(food)}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-3 rounded-xl hover:bg-gray-50 text-left flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{food.nameKr}</p>
                                        <p className="text-sm text-gray-500">
                                            {food.calories}kcal · {food.servingSize}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                            검색 결과가 없습니다
                        </p>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
