'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Check, Sparkles } from 'lucide-react';
import { FoodItem, MealRecommendation } from '@/types';

// Popular menus
const POPULAR_MENUS: FoodItem[] = [
    { id: '1', name: 'Samgyeopsal', nameKr: '삼겹살', calories: 580, protein: 28, carbs: 0, fat: 52, servingSize: '200g', category: 'meat' },
    { id: '2', name: 'Chicken', nameKr: '치킨', calories: 730, protein: 45, carbs: 25, fat: 48, servingSize: '반마리', category: 'meat' },
    { id: '3', name: 'Pizza', nameKr: '피자', calories: 850, protein: 35, carbs: 85, fat: 38, servingSize: '3조각', category: 'western' },
    { id: '4', name: 'Pasta', nameKr: '파스타', calories: 620, protein: 18, carbs: 75, fat: 26, servingSize: '1인분', category: 'western' },
    { id: '5', name: 'Jokbal', nameKr: '족발', calories: 680, protein: 42, carbs: 8, fat: 54, servingSize: '300g', category: 'meat' },
    { id: '6', name: 'Sushi', nameKr: '초밥', calories: 450, protein: 22, carbs: 58, fat: 12, servingSize: '10pcs', category: 'japanese' },
    { id: '7', name: 'Bibimbap', nameKr: '비빔밥', calories: 580, protein: 22, carbs: 85, fat: 15, servingSize: '1인분', category: 'korean' },
    { id: '8', name: 'Ramen', nameKr: '라멘', calories: 650, protein: 25, carbs: 70, fat: 28, servingSize: '1그릇', category: 'japanese' },
];

// Mock recommendations
const MOCK_BREAKFAST: MealRecommendation = {
    foods: [
        { id: 'b1', name: 'Greek Yogurt', nameKr: '그릭요거트', calories: 150, protein: 15, carbs: 12, fat: 5, servingSize: '200g', category: 'dairy' },
        { id: 'b2', name: 'Fruits', nameKr: '과일', calories: 130, protein: 2, carbs: 32, fat: 0, servingSize: '1컵', category: 'fruits' },
    ],
    totalCalories: 280,
    totalProtein: 17,
    locations: [
        { name: 'GS25 회사점', address: '강남구 테헤란로 123', distance: '50m', mapUrl: '#' },
    ],
};

const MOCK_LUNCH: MealRecommendation = {
    foods: [
        { id: 'l1', name: 'Chicken Salad', nameKr: '닭가슴살 샐러드', calories: 350, protein: 35, carbs: 18, fat: 12, servingSize: '1인분', category: 'salad' },
        { id: 'l2', name: 'Whole Wheat Bread', nameKr: '통밀빵', calories: 80, protein: 4, carbs: 15, fat: 1, servingSize: '1조각', category: 'bread' },
    ],
    totalCalories: 430,
    totalProtein: 39,
    locations: [
        { name: '샐러디 강남점', address: '강남구 역삼로 45', distance: '200m', mapUrl: '#' },
    ],
};

interface PCReversePlannerProps {
    dailyCalorieGoal?: number;
    dailyProteinGoal?: number;
}

export default function PCReversePlanner({
    dailyCalorieGoal = 1800,
    dailyProteinGoal = 120
}: PCReversePlannerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMenu, setSelectedMenu] = useState<FoodItem | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [isPlanSaved, setIsPlanSaved] = useState(false);

    const filteredMenus = searchQuery
        ? POPULAR_MENUS.filter(m =>
            m.nameKr.includes(searchQuery) || m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : POPULAR_MENUS;

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.min(prev + 1, filteredMenus.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredMenus[highlightedIndex]) {
            e.preventDefault();
            setSelectedMenu(filteredMenus[highlightedIndex]);
        }
    }, [filteredMenus, highlightedIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Calculate remaining nutrition
    const dinnerCalories = selectedMenu?.calories || 0;
    const totalCalories = MOCK_BREAKFAST.totalCalories + MOCK_LUNCH.totalCalories + dinnerCalories;
    const caloriePercentage = (totalCalories / dailyCalorieGoal) * 100;

    const handleSavePlan = () => {
        setIsPlanSaved(true);
        setTimeout(() => setIsPlanSaved(false), 3000);
    };

    return (
        <div className="p-6 h-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">역추산 플래너</h1>
                <p className="text-gray-500">저녁에 먹고 싶은 메뉴를 선택하면, 아침·점심을 추천해줄게!</p>
            </div>

            {/* 3 Column Layout */}
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                {/* Column 1: Dinner Selection */}
                <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        🍽️ 오늘 저녁 뭐 먹고 싶어?
                    </h2>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="메뉴 검색... (Enter로 선택)"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setHighlightedIndex(0);
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredMenus.map((menu, index) => (
                            <motion.button
                                key={menu.id}
                                onClick={() => setSelectedMenu(menu)}
                                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${selectedMenu?.id === menu.id
                                    ? 'bg-primary-50 border-2 border-primary-500'
                                    : highlightedIndex === index
                                        ? 'bg-gray-100 border-2 border-gray-300'
                                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <span className="text-2xl">
                                    {menu.category === 'meat' ? '🥩' :
                                        menu.category === 'western' ? '🍝' :
                                            menu.category === 'japanese' ? '🍣' :
                                                menu.category === 'korean' ? '🍚' : '🍴'}
                                </span>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{menu.nameKr}</div>
                                    <div className="text-sm text-gray-500">{menu.servingSize}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-primary-600">{menu.calories}</div>
                                    <div className="text-xs text-gray-400">kcal</div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-400 text-center">
                        ↑↓ 방향키로 이동, Enter로 선택
                    </div>
                </div>

                {/* Column 2: AI Calculation */}
                <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        AI 계산
                    </h2>

                    {selectedMenu ? (
                        <div className="flex-1 flex flex-col">
                            {/* Status Message */}
                            <motion.div
                                className={`p-4 rounded-xl mb-4 ${caloriePercentage <= 100
                                    ? 'bg-secondary-50 text-secondary-700'
                                    : 'bg-yellow-50 text-yellow-700'
                                    }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {caloriePercentage <= 100
                                    ? `✨ ${selectedMenu.nameKr} 먹어도 돼! 완벽한 플랜이야!`
                                    : `😅 조금 빡빡해... 양을 줄이거나 다른 메뉴는 어때?`
                                }
                            </motion.div>

                            {/* Calorie Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">하루 칼로리</span>
                                    <span className="font-bold">{totalCalories} / {dailyCalorieGoal} kcal</span>
                                </div>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${caloriePercentage <= 100 ? 'bg-gradient-to-r from-primary-400 to-primary-600' : 'bg-red-500'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-3 flex-1">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">🌅 아침</span>
                                        <span className="font-bold">{MOCK_BREAKFAST.totalCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {MOCK_BREAKFAST.foods.map(f => f.nameKr).join(', ')}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">☀️ 점심</span>
                                        <span className="font-bold">{MOCK_LUNCH.totalCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {MOCK_LUNCH.foods.map(f => f.nameKr).join(', ')}
                                    </div>
                                </div>

                                <div className="p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary-700 font-medium">🌙 저녁</span>
                                        <span className="font-bold text-primary-700">{dinnerCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-primary-600 mt-1">
                                        {selectedMenu.nameKr} 🎉
                                    </div>
                                </div>
                            </div>

                            {/* Total Protein */}
                            <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary-700">총 단백질</span>
                                    <span className="font-bold text-secondary-700">
                                        {MOCK_BREAKFAST.totalProtein + MOCK_LUNCH.totalProtein + selectedMenu.protein}g
                                        / {dailyProteinGoal}g
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <span className="text-4xl mb-4 block">👈</span>
                                <p>왼쪽에서 저녁 메뉴를 선택해줘!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Column 3: Day Timeline */}
                <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        하루 타임라인
                    </h2>

                    {selectedMenu ? (
                        <div className="flex-1 flex flex-col">
                            {/* Timeline */}
                            <div className="flex-1 space-y-0">
                                {/* Breakfast */}
                                <div className="relative pl-8 pb-6 border-l-2 border-primary-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 08:00 - 아침</div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        {MOCK_BREAKFAST.foods.map((food, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-700">{food.nameKr}</span>
                                                <span className="text-gray-500">{food.calories} kcal</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            {MOCK_BREAKFAST.locations?.[0].name}
                                        </div>
                                    </div>
                                </div>

                                {/* Lunch */}
                                <div className="relative pl-8 pb-6 border-l-2 border-primary-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 12:30 - 점심</div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        {MOCK_LUNCH.foods.map((food, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-700">{food.nameKr}</span>
                                                <span className="text-gray-500">{food.calories} kcal</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            {MOCK_LUNCH.locations?.[0].name}
                                        </div>
                                    </div>
                                </div>

                                {/* Dinner */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-secondary-500 rounded-full transform -translate-x-1/2 border-2 border-white" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 19:00 - 저녁 🎉</div>
                                    <div className="bg-secondary-50 rounded-xl p-4 border-2 border-secondary-200">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-secondary-700">{selectedMenu.nameKr}</span>
                                            <span className="font-bold text-secondary-600">{selectedMenu.calories} kcal</span>
                                        </div>
                                        <div className="text-sm text-secondary-600 mt-1">
                                            단백질 {selectedMenu.protein}g
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                onClick={handleSavePlan}
                                className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isPlanSaved
                                    ? 'bg-secondary-500 text-white'
                                    : 'bg-primary-500 text-white hover:bg-primary-600'
                                    }`}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isPlanSaved ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        플랜 저장 완료! +10 XP
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        플랜 저장하기
                                        <span className="text-xs opacity-80 ml-1">Ctrl+Enter</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <span className="text-4xl mb-4 block">📋</span>
                                <p>메뉴를 선택하면 하루 플랜이 나타나요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
