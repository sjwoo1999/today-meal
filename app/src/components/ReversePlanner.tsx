'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Check, Sparkles, ShoppingCart } from 'lucide-react';
import { FoodItem, MealRecommendation, ReversePlan } from '@/types';
import { handleOrderClick } from '@/utils/orderUtils';

// Popular menu data
const POPULAR_MENUS: FoodItem[] = [
    { id: '1', name: 'Samgyeopsal', nameKr: '삼겹살', calories: 580, protein: 28, carbs: 0, fat: 52, servingSize: '200g', category: 'meat' },
    { id: '2', name: 'Chicken', nameKr: '치킨', calories: 730, protein: 45, carbs: 25, fat: 48, servingSize: '반마리', category: 'meat' },
    { id: '3', name: 'Pizza', nameKr: '피자', calories: 850, protein: 35, carbs: 85, fat: 38, servingSize: '3조각', category: 'western' },
    { id: '4', name: 'Pasta', nameKr: '파스타', calories: 620, protein: 18, carbs: 75, fat: 26, servingSize: '1인분', category: 'western' },
    { id: '5', name: 'Jokbal', nameKr: '족발', calories: 680, protein: 42, carbs: 8, fat: 54, servingSize: '300g', category: 'meat' },
    { id: '6', name: 'Sushi', nameKr: '초밥', calories: 450, protein: 22, carbs: 58, fat: 12, servingSize: '10pcs', category: 'japanese' },
];

// Mock recommendation data
const MOCK_RECOMMENDATIONS: Record<string, { breakfast: MealRecommendation; lunch: MealRecommendation }> = {
    '삼겹살': {
        breakfast: {
            foods: [
                { id: 'b1', name: 'Greek Yogurt', nameKr: '그릭요거트', calories: 150, protein: 15, carbs: 12, fat: 5, servingSize: '200g', category: 'dairy' },
                { id: 'b2', name: 'Fruits', nameKr: '과일', calories: 130, protein: 2, carbs: 32, fat: 0, servingSize: '1컵', category: 'fruits' },
            ],
            totalCalories: 280,
            totalProtein: 17,
            locations: [
                { name: 'GS25 회사점', address: '강남구 테헤란로 123', distance: '50m', mapUrl: '#' },
                { name: 'CU 편의점', address: '강남구 테헤란로 125', distance: '80m', mapUrl: '#' },
            ],
        },
        lunch: {
            foods: [
                { id: 'l1', name: 'Chicken Salad', nameKr: '닭가슴살 샐러드', calories: 350, protein: 35, carbs: 18, fat: 12, servingSize: '1인분', category: 'salad' },
                { id: 'l2', name: 'Whole Wheat Bread', nameKr: '통밀빵', calories: 80, protein: 4, carbs: 15, fat: 1, servingSize: '1조각', category: 'bread' },
            ],
            totalCalories: 430,
            totalProtein: 39,
            locations: [
                { name: '샐러디 강남점', address: '강남구 역삼로 45', distance: '200m', mapUrl: '#' },
                { name: '써브웨이', address: '강남구 테헤란로 130', distance: '150m', mapUrl: '#' },
            ],
        },
    },
};

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
    const [selectedMenu, setSelectedMenu] = useState<FoodItem | null>(null);
    const [recommendations, setRecommendations] = useState<{
        breakfast: MealRecommendation;
        lunch: MealRecommendation;
        dinnerBudget: { calories: number; protein: number };
        isFeasible: boolean;
        message: string;
    } | null>(null);

    const handleMenuSelect = (menu: FoodItem) => {
        setSelectedMenu(menu);

        // Calculate reverse plan
        const dinnerCalories = menu.calories;
        const remainingCalories = dailyCalorieGoal - dinnerCalories;

        // Check if feasible
        const isFeasible = remainingCalories >= 400 && dinnerCalories < dailyCalorieGoal * 0.8;

        // Get recommendations (mock)
        const recs = MOCK_RECOMMENDATIONS[menu.nameKr] || MOCK_RECOMMENDATIONS['삼겹살'];

        setRecommendations({
            ...recs,
            dinnerBudget: { calories: dinnerCalories, protein: menu.protein },
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

    const filteredMenus = searchQuery
        ? POPULAR_MENUS.filter(m =>
            m.nameKr.includes(searchQuery) || m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : POPULAR_MENUS;

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-2xl font-bold mb-2">역추산 플래너</h1>
                <p className="text-primary-100">먹고 싶은 저녁을 선택하면, 아침·점심을 추천해줄게!</p>
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
                                <h3 className="text-sm font-semibold text-text-secondary mb-3">
                                    🔥 인기 메뉴
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredMenus.map((menu) => (
                                        <motion.button
                                            key={menu.id}
                                            onClick={() => handleMenuSelect(menu)}
                                            className="p-4 bg-surface-secondary rounded-2xl hover:bg-primary-50 
                                 transition-colors text-center group"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="text-2xl mb-1">
                                                {menu.category === 'meat' ? '🥩' :
                                                    menu.category === 'western' ? '🍝' :
                                                        menu.category === 'japanese' ? '🍣' : '🍴'}
                                            </div>
                                            <div className="text-sm font-medium text-text-primary group-hover:text-primary-600">
                                                {menu.nameKr}
                                            </div>
                                            <div className="text-xs text-text-muted mt-1">
                                                {menu.calories} kcal
                                            </div>
                                        </motion.button>
                                    ))}
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
                            <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
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
                                <p className="text-primary-100">{recommendations.message}</p>
                            </div>

                            {/* Timeline */}
                            <div className="card space-y-6">
                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary-500" />
                                    오늘의 플랜
                                </h3>

                                {/* Breakfast */}
                                <div className="relative pl-8 border-l-2 border-primary-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2" />
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
                                                <div className="text-primary-500 font-bold">
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
                                <div className="relative pl-8 border-l-2 border-primary-200">
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2" />
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
                                                <div className="text-primary-500 font-bold">
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
                                    <div className="absolute left-0 top-0 w-4 h-4 bg-secondary-500 rounded-full transform -translate-x-1/2 border-2 border-white" />
                                    <div className="text-sm text-text-secondary mb-1">⏰ 저녁</div>
                                    <div className="bg-secondary-50 rounded-xl p-4 border-2 border-secondary-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-secondary-700 text-lg">
                                                    {selectedMenu.nameKr} 🎉
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    원하는 곳 어디든!
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-secondary-600 font-bold">
                                                    {selectedMenu.calories} kcal
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    단백질 {selectedMenu.protein}g
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="card bg-gradient-to-r from-surface-secondary to-surface-tertiary">
                                <h4 className="text-sm font-semibold text-text-secondary mb-2">📊 하루 총합</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-primary-500">
                                            {recommendations.breakfast.totalCalories +
                                                recommendations.lunch.totalCalories +
                                                selectedMenu.calories}
                                        </div>
                                        <div className="text-sm text-text-secondary">
                                            / {dailyCalorieGoal} kcal
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-secondary-500">
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
                            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 
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
