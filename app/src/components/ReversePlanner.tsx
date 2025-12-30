'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Check, Sparkles, ShoppingCart, Navigation } from 'lucide-react';
import { FoodItem, MealRecommendation, ReversePlan } from '@/types';
import { handleOrderClick } from '@/utils/orderUtils';
import {
    getBreakfastLocations,
    getLunchLocations,
    getRestaurantsForMenu,
    getPopularMenusFromRestaurants,
    DEFAULT_LOCATION,
    type MockRestaurant,
    type PopularMenuItem
} from '@/data';
import StaticMap from '@/components/common/StaticMap';

// Menu categories - aligned with FoodCategory
type MenuCategory = 'all' | 'snack' | 'korean' | 'western' | 'japanese' | 'chinese' | 'cafe';

const MENU_CATEGORIES: { id: MenuCategory; label: string; emoji: string }[] = [
    { id: 'all', label: '전체', emoji: '🍽️' },
    { id: 'snack', label: '분식', emoji: '🍙' },
    { id: 'korean', label: '한식', emoji: '🍚' },
    { id: 'western', label: '양식', emoji: '🍝' },
    { id: 'japanese', label: '일식', emoji: '🍣' },
    { id: 'chinese', label: '중식', emoji: '🥟' },
    { id: 'cafe', label: '카페', emoji: '☕' },
];

// Helper: Create FoodItem from restaurant menu
const createMealFromRestaurant = (restaurant: MockRestaurant, calories: number, protein: number): FoodItem[] => {
    if (!restaurant.menuItems || restaurant.menuItems.length === 0) return [];
    const menuName = restaurant.menuItems[0].split(' ')[0]; // Get menu name without price
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

// Get popular menus dynamically from restaurants
const POPULAR_MENUS = getPopularMenusFromRestaurants();

interface ReversePlannerProps {
    dailyCalorieGoal: number;
    dailyProteinGoal: number;
    onPlanCreated?: (plan: ReversePlan) => void;
}

export default function ReversePlanner({
    dailyCalorieGoal = 1800,
    dailyProteinGoal = 120,
    onPlanCreated
}: ReversePlannerProps) {
    const [step, setStep] = useState<'search' | 'result' | 'saved'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
    const [selectedMenu, setSelectedMenu] = useState<FoodItem | null>(null);
    const [dinnerRestaurants, setDinnerRestaurants] = useState<MockRestaurant[]>([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | undefined>(undefined);
    const showMap = true; // Always show map for now
    const [recommendations, setRecommendations] = useState<{
        breakfast: MealRecommendation;
        lunch: MealRecommendation;
        dinnerBudget: { calories: number; protein: number };
        isFeasible: boolean;
        message: string;
    } | null>(null);

    const handleMenuSelect = (menu: PopularMenuItem) => {
        // Convert PopularMenuItem to FoodItem for compatibility
        const foodItem: FoodItem = {
            id: menu.id,
            name: menu.name,
            nameKr: menu.nameKr,
            calories: menu.estimatedCalories,
            protein: menu.estimatedProtein,
            carbs: 0,
            fat: 0,
            servingSize: '1인분',
            category: menu.category,
        };
        setSelectedMenu(foodItem);

        // Calculate reverse plan
        const dinnerCalories = menu.estimatedCalories;
        const remainingCalories = dailyCalorieGoal - dinnerCalories;

        // Check if feasible
        const isFeasible = remainingCalories >= 400 && dinnerCalories < dailyCalorieGoal * 0.8;

        // Get restaurants that serve this menu (from PopularMenuItem or search)
        const nearbyDinnerSpots = menu.restaurants.length > 0
            ? menu.restaurants.slice(0, 3)
            : getRestaurantsForMenu(menu.nameKr, 3);
        setDinnerRestaurants(nearbyDinnerSpots);

        // Get breakfast and lunch locations
        const breakfastSpots = getBreakfastLocations(2);
        const lunchSpots = getLunchLocations(2);

        // Create meal items from actual restaurant menus
        const breakfastFoods = breakfastSpots.length > 0
            ? createMealFromRestaurant(breakfastSpots[0], 280, 12)
            : [{ id: 'b1', name: 'Light Breakfast', nameKr: '가벼운 아침', calories: 280, protein: 12, carbs: 35, fat: 8, servingSize: '1인분', category: 'cafe' }];

        const lunchFoods = lunchSpots.length > 0
            ? createMealFromRestaurant(lunchSpots[0], 450, 25)
            : [{ id: 'l1', name: 'Light Lunch', nameKr: '가벼운 점심', calories: 450, protein: 25, carbs: 50, fat: 15, servingSize: '1인분', category: 'korean' }];

        // Build recommendations with real location and menu data
        setRecommendations({
            breakfast: {
                foods: breakfastFoods,
                totalCalories: 280,
                totalProtein: 12,
                locations: toLocations(breakfastSpots),
            },
            lunch: {
                foods: lunchFoods,
                totalCalories: 450,
                totalProtein: 25,
                locations: toLocations(lunchSpots),
            },
            dinnerBudget: { calories: dinnerCalories, protein: menu.estimatedProtein },
            isFeasible,
            message: isFeasible
                ? `${menu.nameKr} 먹어도 돼! 대신 이렇게 해보자 👇`
                : `${menu.nameKr} 2인분은 조금 빡빡해 😅 1인분이면 완벽!`,
        });

        setStep('result');
    };

    const handleSavePlan = () => {
        setStep('saved');
        // Here you would save the plan and award XP
        if (onPlanCreated && selectedMenu && recommendations) {
            // Create plan object
        }
    };

    const filteredMenus = POPULAR_MENUS.filter((menu: PopularMenuItem) => {
        const matchesSearch = searchQuery
            ? menu.nameKr.includes(searchQuery) || menu.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-coral-50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-2xl font-bold mb-2">역추산 플래너</h1>
                <p className="text-coral-100">먹고 싶은 저녁을 선택하면, 아침·점심을 추천해줄게!</p>
                {/* Location Banner */}
                <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
                    <Navigation className="w-4 h-4" />
                    <span className="truncate">{DEFAULT_LOCATION.name}</span>
                </div>
            </div>

            <div className="px-4 -mt-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Search */}
                    {step === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Search Box */}
                            <div className="card">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">🍽️</span>
                                    <h2 className="text-lg font-bold text-text-primary">
                                        오늘 저녁 뭐 먹고 싶어?
                                    </h2>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="메뉴명 또는 음식점명 검색"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>

                            {/* Popular Menus */}
                            <div className="card">
                                {/* Category Tabs */}
                                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
                                    {MENU_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                                ${selectedCategory === cat.id
                                                    ? 'bg-coral-500 text-white'
                                                    : 'bg-surface-secondary text-text-secondary hover:bg-coral-50'}`}
                                        >
                                            <span>{cat.emoji}</span>
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-sm font-semibold text-text-secondary mb-3">
                                    {selectedCategory === 'all' ? '🔥 인기 메뉴' : `${MENU_CATEGORIES.find(c => c.id === selectedCategory)?.emoji} ${MENU_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredMenus.length > 0 ? filteredMenus.map((menu) => (
                                        <motion.button
                                            key={menu.id}
                                            onClick={() => handleMenuSelect(menu)}
                                            className="p-4 bg-surface-secondary rounded-2xl hover:bg-coral-50 
                                 transition-colors text-center group"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="text-2xl mb-1">
                                                {menu.category === 'meat' ? '🥩' :
                                                    menu.category === 'western' ? '🍝' :
                                                        menu.category === 'japanese' ? '🍣' :
                                                            menu.category === 'korean' ? '🍚' :
                                                                menu.category === 'chinese' ? '🥟' : '🍴'}
                                            </div>
                                            <div className="text-sm font-medium text-text-primary group-hover:text-coral-600">
                                                {menu.nameKr}
                                            </div>
                                            <div className="text-xs text-text-muted mt-1">
                                                {menu.estimatedCalories} kcal
                                            </div>
                                        </motion.button>
                                    )) : (
                                        <div className="col-span-3 text-center py-8 text-text-muted">
                                            검색 결과가 없어요
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Result */}
                    {step === 'result' && selectedMenu && recommendations && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Result Header */}
                            <div className="card bg-gradient-to-r from-coral-500 to-coral-600 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    {recommendations.isFeasible ? (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <Sparkles className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <span className="text-2xl">😅</span>
                                    )}
                                    <h2 className="text-xl font-bold">{selectedMenu.nameKr} OK! 🔥</h2>
                                </div>
                                <p className="text-coral-100">{recommendations.message}</p>
                            </div>

                            {/* Static Map */}
                            {showMap && dinnerRestaurants.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="card p-0 overflow-hidden"
                                >
                                    <StaticMap
                                        restaurants={dinnerRestaurants}
                                        selectedRestaurantId={selectedRestaurantId}
                                        onRestaurantClick={(r) => setSelectedRestaurantId(r.id)}
                                        className="h-48"
                                    />
                                </motion.div>
                            )}

                            {/* Timeline */}
                            <div className="card space-y-6">
                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-coral-500" />
                                    오늘의 플랜
                                </h3>

                                {/* Breakfast */}
                                <div className="relative pl-8 border-l-2 border-coral-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-coral-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-text-secondary mb-1">⏰ 아침</div>
                                    <div className="bg-surface-secondary rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                {recommendations.breakfast.foods.map((food, i) => (
                                                    <div key={i} className="font-medium text-text-primary">
                                                        {food.nameKr}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-coral-500 font-bold">
                                                    {recommendations.breakfast.totalCalories} kcal
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    단백질 {recommendations.breakfast.totalProtein}g
                                                </div>
                                            </div>
                                        </div>
                                        {recommendations.breakfast.locations && (
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{recommendations.breakfast.locations[0].name}</span>
                                                    <span className="text-text-muted">
                                                        {recommendations.breakfast.locations[0].distance}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleOrderClick('baemin', undefined, recommendations.breakfast.foods[0]?.nameKr)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#2AC1BC] text-white text-xs font-medium rounded-full hover:bg-[#25a8a4] transition-colors"
                                                >
                                                    <ShoppingCart className="w-3 h-3" />
                                                    바로 주문
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Lunch */}
                                <div className="relative pl-8 border-l-2 border-coral-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-coral-500 rounded-full transform -translate-x-1/2" />
                                    <div className="text-sm text-text-secondary mb-1">⏰ 점심</div>
                                    <div className="bg-surface-secondary rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                {recommendations.lunch.foods.map((food, i) => (
                                                    <div key={i} className="font-medium text-text-primary">
                                                        {food.nameKr}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-coral-500 font-bold">
                                                    {recommendations.lunch.totalCalories} kcal
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    단백질 {recommendations.lunch.totalProtein}g
                                                </div>
                                            </div>
                                        </div>
                                        {recommendations.lunch.locations && (
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{recommendations.lunch.locations[0].name}</span>
                                                    <span className="text-text-muted">
                                                        {recommendations.lunch.locations[0].distance}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleOrderClick('baemin', undefined, recommendations.lunch.foods[0]?.nameKr)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#2AC1BC] text-white text-xs font-medium rounded-full hover:bg-[#25a8a4] transition-colors"
                                                >
                                                    <ShoppingCart className="w-3 h-3" />
                                                    배민으로 주문
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dinner */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-sage-500 rounded-full transform -translate-x-1/2 border-2 border-white" />
                                    <div className="text-sm text-text-secondary mb-1">⏰ 저녁</div>
                                    <div className="bg-sage-50 rounded-xl p-4 border-2 border-sage-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-bold text-sage-700 text-lg">
                                                    {selectedMenu.nameKr} 🎉
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    근처 추천 맛집
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sage-600 font-bold">
                                                    {selectedMenu.calories} kcal
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    단백질 {selectedMenu.protein}g
                                                </div>
                                            </div>
                                        </div>
                                        {/* Nearby Restaurant Recommendations */}
                                        {dinnerRestaurants.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-sage-200">
                                                <div className="text-xs font-medium text-sage-600 mb-2">📍 주변 {selectedMenu.nameKr} 맛집</div>
                                                {dinnerRestaurants.map((restaurant) => (
                                                    <a
                                                        key={restaurant.id}
                                                        href={restaurant.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-sage-100 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-sage-500" />
                                                            <div>
                                                                <div className="text-sm font-medium text-text-primary">{restaurant.name}</div>
                                                                <div className="text-xs text-text-muted">{restaurant.address}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-sage-600 font-medium">{restaurant.distance}</span>
                                                            {restaurant.rating && (
                                                                <span className="text-xs text-amber-500">⭐ {restaurant.rating}</span>
                                                            )}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="card bg-gradient-to-r from-surface-secondary to-surface-tertiary">
                                <h4 className="text-sm font-semibold text-text-secondary mb-2">📊 하루 총합</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-coral-500">
                                            {recommendations.breakfast.totalCalories +
                                                recommendations.lunch.totalCalories +
                                                selectedMenu.calories}
                                        </div>
                                        <div className="text-sm text-text-secondary">
                                            / {dailyCalorieGoal} kcal
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-sage-500">
                                            {recommendations.breakfast.totalProtein +
                                                recommendations.lunch.totalProtein +
                                                selectedMenu.protein}g
                                        </div>
                                        <div className="text-sm text-text-secondary">
                                            / {dailyProteinGoal}g 단백질
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('search')}
                                    className="btn-outline flex-1"
                                >
                                    다시 선택
                                </button>
                                <button
                                    onClick={handleSavePlan}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    플랜 저장하기
                                    <span className="text-xs opacity-80">+10 XP</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Saved */}
                    {step === 'saved' && (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card text-center py-8"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="text-6xl mb-4"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                플랜 저장 완료!
                            </h2>
                            <p className="text-text-secondary mb-4">
                                점심시간에 알림으로 알려줄게 📱
                            </p>
                            <div className="inline-flex items-center gap-2 bg-coral-50 text-coral-600 
                              px-4 py-2 rounded-full font-semibold">
                                <Sparkles className="w-5 h-5" />
                                +10 XP 획득!
                            </div>
                            <button
                                onClick={() => setStep('search')}
                                className="btn-secondary mt-6 w-full"
                            >
                                새 플랜 만들기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
