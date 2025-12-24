'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Flame, Calendar } from 'lucide-react';
import HankiMascot from '@/components/HankiMascot';
import { MacroCircles } from '@/components/NutritionProgress';
import { StreakBadge, LevelBadge } from '@/components/Gamification';
import DailyQuests from '@/components/DailyQuests';
import { useUserStore, useNutritionStore, useQuestStore, useHankiStore, useUIStore, getLevelInfo, getXPProgress } from '@/store';
import { Quest } from '@/types';

// Mock data
const MOCK_QUESTS: Quest[] = [
    { id: 'q1', title: '아침 기록하기', description: '아침 식사를 기록해보세요', type: 'easy', xpReward: 10, isCompleted: true },
    { id: 'q2', title: '물 8잔 마시기', description: '하루 수분 섭취 목표', type: 'easy', xpReward: 10, isCompleted: false, progress: 5, maxProgress: 8 },
    { id: 'q3', title: '역추산 플랜 완벽 실행', description: '세운 플랜대로 식사하기', type: 'challenge', xpReward: 30, isCompleted: false },
];

export default function HomePage() {
    const user = useUserStore((state) => state.user);
    const { todayNutrition, reversePlan } = useNutritionStore();
    const { dailyQuests, completeQuest } = useQuestStore();
    const { setActiveTab } = useUIStore();
    const hankiState = useHankiStore();

    // Use mock data if no real data
    const quests = dailyQuests.length > 0 ? dailyQuests : MOCK_QUESTS;

    // Mock user data for demo
    const mockUser = {
        name: '지영',
        gamification: {
            xp: 485,
            level: 3,
            streak: 7,
            longestStreak: 14,
            streakFreezes: 2,
            badges: [],
            league: 'silver' as const,
            weeklyXP: 185,
        },
    };

    const displayUser = user || mockUser;
    const levelInfo = getLevelInfo(displayUser.gamification.xp);
    const xpProgress = getXPProgress(displayUser.gamification.xp);

    // Mock nutrition data
    const mockNutrition = {
        calories: { current: 1250, goal: 1800 },
        protein: { current: 85, goal: 120 },
        carbs: { current: 140, goal: 200 },
        fat: { current: 42, goal: 60 },
    };

    const nutrition = todayNutrition || mockNutrition;

    const handleQuestComplete = (questId: string) => {
        completeQuest(questId);
        // Would also trigger XP popup and update user XP
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 pb-20 rounded-b-3xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            안녕, {displayUser.name}! 👋
                        </h1>
                        <p className="text-primary-100 text-sm">
                            오늘도 맛있게 건강해지자!
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StreakBadge streak={displayUser.gamification.streak} />
                        <LevelBadge level={displayUser.gamification.level} title={levelInfo.title} showTitle={false} />
                    </div>
                </div>

                {/* XP Progress */}
                <div className="bg-white/20 rounded-2xl p-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span>Lv.{levelInfo.level} {levelInfo.title}</span>
                        <span>{displayUser.gamification.xp} XP</span>
                    </div>
                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 -mt-12 space-y-4">
                {/* Hanki Mascot Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4">
                        <HankiMascot size="lg" showMessage={false} />
                        <div className="flex-1">
                            <p className="text-lg font-medium text-text-primary mb-2">
                                {hankiState.message}
                            </p>
                            {reversePlan ? (
                                <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-2 rounded-xl">
                                    <Calendar className="w-4 h-4" />
                                    <span>오늘 저녁: {reversePlan.dinnerChoice?.nameKr}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setActiveTab('planner')}
                                    className="flex items-center gap-1 text-sm text-primary-500 font-medium hover:underline"
                                >
                                    오늘 저녁 계획 세우기
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Reverse Plan CTA (if no plan) */}
                {!reversePlan && (
                    <motion.button
                        onClick={() => setActiveTab('planner')}
                        className="card-interactive w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🍽️</span>
                                <div className="text-left">
                                    <h3 className="font-bold text-lg">오늘 저녁 뭐 먹고 싶어?</h3>
                                    <p className="text-primary-100 text-sm">저녁을 선택하면 아침·점심을 추천해줄게!</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </motion.button>
                )}

                {/* Today's Nutrition Dashboard */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            📊 오늘의 영양
                        </h3>
                        {reversePlan && (
                            <span className="text-sm text-secondary-500 font-medium">
                                저녁까지 {nutrition.calories.goal - nutrition.calories.current} kcal 남음
                            </span>
                        )}
                    </div>
                    <MacroCircles
                        calories={nutrition.calories}
                        protein={nutrition.protein}
                        carbs={nutrition.carbs}
                        fat={nutrition.fat}
                    />
                    {nutrition.calories.current >= nutrition.calories.goal * 0.9 && (
                        <div className="mt-2 text-center text-secondary-600 font-medium bg-secondary-50 py-2 rounded-xl">
                            🎉 오늘 목표 거의 달성!
                        </div>
                    )}
                </motion.div>

                {/* Daily Quests */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <DailyQuests quests={quests} onQuestComplete={handleQuestComplete} />
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="grid grid-cols-2 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <button
                        onClick={() => setActiveTab('record')}
                        className="card-interactive flex flex-col items-center gap-2 py-6"
                    >
                        <span className="text-3xl">📸</span>
                        <span className="font-medium text-text-primary">식사 기록하기</span>
                        <span className="text-xs text-text-muted">+10 XP</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('league')}
                        className="card-interactive flex flex-col items-center gap-2 py-6"
                    >
                        <span className="text-3xl">🏆</span>
                        <span className="font-medium text-text-primary">리그 순위</span>
                        <span className="text-xs text-text-muted">이번 주 3위</span>
                    </button>
                </motion.div>

                {/* Streak Info */}
                {displayUser.gamification.streak > 0 && (
                    <motion.div
                        className="card bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Flame className="w-8 h-8 text-orange-500" />
                                <div>
                                    <h3 className="font-bold text-text-primary">
                                        🔥 {displayUser.gamification.streak}일 연속!
                                    </h3>
                                    <p className="text-sm text-text-secondary">
                                        한끼가 신나서 김이 모락모락 💨
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <div className="text-text-muted">스트릭 프리즈</div>
                                <div className="font-bold text-primary-500">
                                    {displayUser.gamification.streakFreezes}개 보유
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
