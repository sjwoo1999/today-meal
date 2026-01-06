'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Check, Sparkles } from 'lucide-react';
import { FoodItem, MealRecommendation } from '@/types';
import {
    getPopularMenusFromRestaurants,
    getBreakfastLocations,
    getLunchLocations,
    type MockRestaurant,
    type PopularMenuItem
} from '@/data';

// Helper: Create FoodItem from restaurant menu
const createMealFromRestaurant = (restaurant: MockRestaurant, calories: number, protein: number): FoodItem[] => {
    if (!restaurant.menuItems || restaurant.menuItems.length === 0) return [];
    const menuName = restaurant.menuItems[0].split(' ')[0];
    return [{
        id: `auto_${restaurant.id}`,
        name: restaurant.name,
        nameKr: `${restaurant.name} ${menuName}`,
        calories,
        protein,
        carbs: 0,
        fat: 0,
        servingSize: '1인분',
        category: restaurant.category[0] || 'korean',
    }];
};

// Helper to convert MockRestaurant to RestaurantLocation format
const toLocations = (restaurants: MockRestaurant[]) =>
    restaurants.map(r => ({
        name: r.name,
        address: r.address,
        distance: r.distance,
        mapUrl: r.mapUrl,
    }));

// Get popular menus from restaurants
const POPULAR_MENUS = getPopularMenusFromRestaurants();

interface PCReversePlannerProps {
    dailyCalorieGoal?: number;
    dailyProteinGoal?: number;
}

export default function PCReversePlanner({
    dailyCalorieGoal = 1800,
    dailyProteinGoal = 120
}: PCReversePlannerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMenu, setSelectedMenu] = useState<PopularMenuItem | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [isPlanSaved, setIsPlanSaved] = useState(false);

    // Generate breakfast and lunch recommendations dynamically
    const breakfast = useMemo(() => {
        const spots = getBreakfastLocations(2);
        const foods = spots.length > 0
            ? createMealFromRestaurant(spots[0], 280, 12)
            : [{ id: 'b1', name: 'Light Breakfast', nameKr: '가벼운 아침', calories: 280, protein: 12, carbs: 35, fat: 8, servingSize: '1인분', category: 'cafe' as const }];
        return {
            foods,
            totalCalories: 280,
            totalProtein: 12,
            locations: toLocations(spots),
        } as MealRecommendation;
    }, []);

    const lunch = useMemo(() => {
        const spots = getLunchLocations(2);
        const foods = spots.length > 0
            ? createMealFromRestaurant(spots[0], 450, 25)
            : [{ id: 'l1', name: 'Light Lunch', nameKr: '가벼운 점심', calories: 450, protein: 25, carbs: 50, fat: 15, servingSize: '1인분', category: 'korean' as const }];
        return {
            foods,
            totalCalories: 450,
            totalProtein: 25,
            locations: toLocations(spots),
        } as MealRecommendation;
    }, []);

    const filteredMenus = searchQuery
        ? POPULAR_MENUS.filter((m: PopularMenuItem) =>
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
    const dinnerCalories = selectedMenu?.estimatedCalories || 0;
    const totalCalories = breakfast.totalCalories + lunch.totalCalories + dinnerCalories;
    const caloriePercentage = (totalCalories / dailyCalorieGoal) * 100;

    const handleSavePlan = () => {
        setIsPlanSaved(true);
        setTimeout(() => setIsPlanSaved(false), 3000);
    };

    // Category emoji helper
    const getCategoryEmoji = (category: string) => {
        switch (category) {
            case 'snack': return '🍙';
            case 'korean': return '🍚';
            case 'western': return '🍝';
            case 'japanese': return '🍣';
            case 'chinese': return '🥟';
            case 'cafe': return '☕';
            default: return '🍴';
        }
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
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredMenus.map((menu: PopularMenuItem, index: number) => (
                            <motion.button
                                key={menu.id}
                                onClick={() => setSelectedMenu(menu)}
                                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${selectedMenu?.id === menu.id
                                    ? 'bg-green-50 border-2 border-green-500'
                                    : highlightedIndex === index
                                        ? 'bg-gray-100 border-2 border-gray-300'
                                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <span className="text-2xl">{getCategoryEmoji(menu.category)}</span>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{menu.nameKr}</div>
                                    <div className="text-sm text-gray-500">{menu.restaurants.length}개 식당</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-600">{menu.estimatedCalories}</div>
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
                        <Sparkles className="w-5 h-5 text-green-500" />
                        AI 계산
                    </h2>

                    {selectedMenu ? (
                        <div className="flex-1 flex flex-col">
                            {/* Status Message */}
                            <motion.div
                                className={`p-4 rounded-xl mb-4 ${caloriePercentage <= 100
                                    ? 'bg-blue-50 text-blue-700'
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
                                        className={`h-full rounded-full ${caloriePercentage <= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-red-500'
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
                                        <span className="font-bold">{breakfast.totalCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {breakfast.foods.map((f: FoodItem) => f.nameKr).join(', ')}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">☀️ 점심</span>
                                        <span className="font-bold">{lunch.totalCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {lunch.foods.map((f: FoodItem) => f.nameKr).join(', ')}
                                    </div>
                                </div>

                                <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-700 font-medium">🌙 저녁</span>
                                        <span className="font-bold text-green-700">{dinnerCalories} kcal</span>
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                        {selectedMenu.nameKr} 🎉
                                    </div>
                                </div>
                            </div>

                            {/* Total Protein */}
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-700">총 단백질</span>
                                    <span className="font-bold text-blue-700">
                                        {breakfast.totalProtein + lunch.totalProtein + selectedMenu.estimatedProtein}g
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
                                <div className="relative pl-8 pb-6 border-l-2 border-green-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 08:00 - 아침</div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        {breakfast.foods.map((food: FoodItem, i: number) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-700">{food.nameKr}</span>
                                                <span className="text-gray-500">{food.calories} kcal</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            {breakfast.locations?.[0]?.name || '근처 편의점'}
                                        </div>
                                    </div>
                                </div>

                                {/* Lunch */}
                                <div className="relative pl-8 pb-6 border-l-2 border-green-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 12:30 - 점심</div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        {lunch.foods.map((food: FoodItem, i: number) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-700">{food.nameKr}</span>
                                                <span className="text-gray-500">{food.calories} kcal</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            {lunch.locations?.[0]?.name || '근처 식당'}
                                        </div>
                                    </div>
                                </div>

                                {/* Dinner */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 border-2 border-white" />
                                    <div className="text-sm text-gray-500 mb-1">⏰ 19:00 - 저녁 🎉</div>
                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-blue-700">{selectedMenu.nameKr}</span>
                                            <span className="font-bold text-blue-600">{selectedMenu.estimatedCalories} kcal</span>
                                        </div>
                                        <div className="text-sm text-blue-600 mt-1">
                                            단백질 {selectedMenu.estimatedProtein}g
                                        </div>
                                        {selectedMenu.restaurants.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-blue-200 flex items-center gap-2 text-sm text-blue-600">
                                                <MapPin className="w-4 h-4" />
                                                {selectedMenu.restaurants[0].name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                onClick={handleSavePlan}
                                className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isPlanSaved
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-500 text-white hover:bg-green-600'
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
