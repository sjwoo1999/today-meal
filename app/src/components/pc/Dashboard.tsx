'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Calendar } from 'lucide-react';
import { CircularProgress } from '@/components/NutritionProgress';

// Mock data
const weeklyData = [
    { day: '월', calories: 1720, goal: 1800 },
    { day: '화', calories: 1850, goal: 1800 },
    { day: '수', calories: 1680, goal: 1800 },
    { day: '목', calories: 1920, goal: 1800 },
    { day: '금', calories: 1780, goal: 1800 },
    { day: '토', calories: 1650, goal: 1800 },
    { day: '일', calories: 1250, goal: 1800, isToday: true },
];

const meals = [
    { type: '아침', time: '08:30', calories: 280, items: ['그릭요거트', '과일'] },
    { type: '점심', time: '12:30', calories: 430, items: ['닭가슴살 샐러드', '통밀빵'] },
    { type: '저녁', time: '—', calories: 0, items: [], isPending: true },
];

const quests = [
    { id: 1, title: '아침 기록하기', xp: 10, completed: true },
    { id: 2, title: '물 8잔 마시기', xp: 10, completed: false, progress: 5, max: 8 },
    { id: 3, title: '역추산 플랜 성공', xp: 30, completed: false, type: 'challenge' },
];

export default function PCDashboard() {
    const todayNutrition = {
        calories: { current: 1250, goal: 1800 },
        protein: { current: 85, goal: 120 },
        carbs: { current: 140, goal: 200 },
        fat: { current: 42, goal: 60 },
    };

    const completedQuests = quests.filter(q => q.completed).length;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
                    <p className="text-gray-500">오늘의 영양 현황을 한눈에 확인하세요</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Today's Nutrition - Large */}
                <motion.div
                    className="col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">📊 오늘의 영양</h2>

                    <div className="flex items-center justify-center mb-6">
                        <CircularProgress
                            value={todayNutrition.calories.current}
                            max={todayNutrition.calories.goal}
                            size={200}
                            strokeWidth={16}
                            color="#FF9500"
                            unit="kcal"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Protein */}
                        <div className="text-center">
                            <CircularProgress
                                value={todayNutrition.protein.current}
                                max={todayNutrition.protein.goal}
                                size={80}
                                strokeWidth={8}
                                color="#22C55E"
                                showValue={false}
                            />
                            <p className="mt-2 text-sm font-medium text-gray-900">단백질</p>
                            <p className="text-xs text-gray-500">{todayNutrition.protein.current}g / {todayNutrition.protein.goal}g</p>
                        </div>

                        {/* Carbs */}
                        <div className="text-center">
                            <CircularProgress
                                value={todayNutrition.carbs.current}
                                max={todayNutrition.carbs.goal}
                                size={80}
                                strokeWidth={8}
                                color="#3B82F6"
                                showValue={false}
                            />
                            <p className="mt-2 text-sm font-medium text-gray-900">탄수화물</p>
                            <p className="text-xs text-gray-500">{todayNutrition.carbs.current}g / {todayNutrition.carbs.goal}g</p>
                        </div>

                        {/* Fat */}
                        <div className="text-center">
                            <CircularProgress
                                value={todayNutrition.fat.current}
                                max={todayNutrition.fat.goal}
                                size={80}
                                strokeWidth={8}
                                color="#A855F7"
                                showValue={false}
                            />
                            <p className="mt-2 text-sm font-medium text-gray-900">지방</p>
                            <p className="text-xs text-gray-500">{todayNutrition.fat.current}g / {todayNutrition.fat.goal}g</p>
                        </div>
                    </div>

                    {/* Remaining for dinner */}
                    <div className="mt-6 p-4 bg-secondary-50 rounded-2xl text-center">
                        <p className="text-sm text-secondary-600">
                            🍽️ 저녁까지 <span className="font-bold">{todayNutrition.calories.goal - todayNutrition.calories.current} kcal</span> 남음
                        </p>
                    </div>
                </motion.div>

                {/* Right Column */}
                <div className="col-span-7 space-y-6">
                    {/* Weekly Trend */}
                    <motion.div
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">📈 주간 트렌드</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">평균</span>
                                <span className="font-bold text-gray-900">1,764 kcal</span>
                                <TrendingDown className="w-4 h-4 text-secondary-500" />
                            </div>
                        </div>

                        <div className="flex items-end justify-between h-32 gap-2">
                            {weeklyData.map((day, i) => {
                                const height = (day.calories / 2200) * 100;
                                const isOver = day.calories > day.goal;
                                const isToday = day.isToday;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <motion.div
                                            className={`w-full rounded-t-lg ${isToday ? 'bg-primary-500' : isOver ? 'bg-red-400' : 'bg-secondary-400'
                                                }`}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.5 }}
                                        />
                                        <span className={`text-xs ${isToday ? 'font-bold text-primary-600' : 'text-gray-500'}`}>
                                            {day.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded bg-secondary-400" />
                                <span>목표 달성</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded bg-red-400" />
                                <span>초과</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded bg-primary-500" />
                                <span>오늘</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Meals Timeline */}
                        <motion.div
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-lg font-bold text-gray-900 mb-4">🍽️ 끼니별 기록</h2>

                            <div className="space-y-4">
                                {meals.map((meal, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${meal.isPending ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meal.isPending ? 'bg-gray-200 text-gray-400' : 'bg-primary-100 text-primary-600'
                                            }`}>
                                            {meal.type === '아침' ? '🌅' : meal.type === '점심' ? '☀️' : '🌙'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{meal.type}</span>
                                                <span className="text-sm text-gray-500">{meal.time}</span>
                                            </div>
                                            {meal.isPending ? (
                                                <p className="text-sm text-gray-400">아직 기록되지 않음</p>
                                            ) : (
                                                <p className="text-sm text-gray-500">{meal.items.join(', ')}</p>
                                            )}
                                        </div>
                                        <div className={`font-bold ${meal.isPending ? 'text-gray-300' : 'text-primary-600'}`}>
                                            {meal.calories > 0 ? `${meal.calories} kcal` : '—'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quests */}
                        <motion.div
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">🎯 오늘의 퀘스트</h2>
                                <span className="text-sm text-gray-500">{completedQuests}/{quests.length}</span>
                            </div>

                            <div className="space-y-3">
                                {quests.map((quest) => (
                                    <div
                                        key={quest.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl ${quest.completed ? 'bg-secondary-50' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${quest.completed ? 'bg-secondary-500 text-white' : 'bg-gray-200'
                                            }`}>
                                            {quest.completed ? '✓' : ''}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${quest.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                {quest.title}
                                            </p>
                                            {quest.progress !== undefined && !quest.completed && (
                                                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-500 rounded-full"
                                                        style={{ width: `${(quest.progress / quest.max!) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${quest.completed ? 'text-secondary-500' : 'text-primary-500'}`}>
                                            +{quest.xp} XP
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {completedQuests === quests.length && (
                                <div className="mt-4 p-3 bg-secondary-100 rounded-xl text-center">
                                    <p className="text-secondary-700 font-medium">🎉 전부 클리어! +15 XP 보너스!</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
