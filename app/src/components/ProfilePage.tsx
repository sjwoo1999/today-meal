'use client';

import { motion } from 'framer-motion';
import { Settings, ChevronRight, Award, Flame, Calendar, Star, LogOut } from 'lucide-react';
import HankiMascot from '@/components/HankiMascot';
import { LevelBadge, XPProgressBar } from '@/components/Gamification';
import { NutritionBar } from '@/components/NutritionProgress';
import { LEVEL_DATA, STREAK_MILESTONES, Badge } from '@/types';
import { useUserStore, getLevelInfo, useHankiStore } from '@/store';
import ProfileTabs from '@/components/profile/ProfileTabs';

// Mock badges
const MOCK_BADGES: Badge[] = [
    { id: 'b1', name: '시작이 반', description: '3일 연속 기록 달성', icon: '🌱', earnedAt: new Date(), category: 'streak' },
    { id: 'b2', name: '일주일 완식', description: '7일 연속 기록 달성', icon: '🔥', earnedAt: new Date(), category: 'streak' },
    { id: 'b3', name: '첫 역추산', description: '역추산 플랜 첫 사용', icon: '📋', earnedAt: new Date(), category: 'achievement' },
];

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);
    const { evolutionStage } = useHankiStore();

    // Mock user data
    const mockUser = {
        name: '지영',
        email: 'jiyoung@email.com',
        profile: {
            dailyCalorieGoal: 1800,
            dailyProteinGoal: 120,
        },
        gamification: {
            xp: 485,
            level: 3,
            streak: 7,
            longestStreak: 14,
            streakFreezes: 2,
            badges: MOCK_BADGES,
            league: 'silver' as const,
            weeklyXP: 185,
        },
    };

    const displayUser = user || mockUser;
    const levelInfo = getLevelInfo(displayUser.gamification.xp);
    const nextLevel = LEVEL_DATA.find(l => l.level === levelInfo.level + 1);

    // Stats
    const stats = {
        totalRecords: 156,
        consecutiveDays: displayUser.gamification.streak,
        averageCalories: 1720,
        goalAchievementRate: 78,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 pb-20 rounded-b-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">프로필</h1>
                    <button className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">
                    <motion.div
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <HankiMascot size="md" showMessage={false} animate={false} />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold">{displayUser.name}</h2>
                        <p className="text-primary-100 text-sm">{displayUser.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <LevelBadge level={displayUser.gamification.level} title={levelInfo.title} showTitle={false} />
                            <span className="text-sm">{levelInfo.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-12 space-y-4">
                {/* XP & Level Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary-500" />
                            레벨 & XP
                        </h3>
                        <span className="text-2xl font-bold text-primary-500">
                            {displayUser.gamification.xp} XP
                        </span>
                    </div>

                    <div className="bg-surface-secondary rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-text-primary">Lv.{levelInfo.level} {levelInfo.title}</span>
                            {nextLevel && (
                                <span className="text-sm text-text-secondary">
                                    다음: Lv.{nextLevel.level} {nextLevel.title}
                                </span>
                            )}
                        </div>
                        <XPProgressBar
                            currentXP={displayUser.gamification.xp}
                            currentLevelXP={levelInfo.requiredXP}
                            nextLevelXP={nextLevel?.requiredXP || levelInfo.requiredXP}
                        />
                    </div>

                    {/* Hanki Evolution */}
                    <div className="flex items-center gap-4 p-3 bg-primary-50 rounded-xl">
                        <span className="text-3xl">🍚</span>
                        <div className="flex-1">
                            <div className="font-medium text-text-primary">한끼 성장 단계</div>
                            <div className="text-sm text-text-secondary">
                                {evolutionStage === 1 && '작은 밥공기'}
                                {evolutionStage === 2 && '반찬이 생긴 밥상'}
                                {evolutionStage === 3 && '푸짐한 한상 차림'}
                                {evolutionStage === 4 && '빛나는 황금 밥상'}
                            </div>
                        </div>
                        <div className="text-2xl">
                            {evolutionStage === 1 && '🍚'}
                            {evolutionStage === 2 && '🍚🥬'}
                            {evolutionStage === 3 && '🍱'}
                            {evolutionStage === 4 && '✨🍱✨'}
                        </div>
                    </div>
                </motion.div>

                {/* Streak Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            스트릭
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">프리즈</span>
                            <span className="badge-primary">{displayUser.gamification.streakFreezes}개</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-orange-500">
                                {displayUser.gamification.streak}일
                            </div>
                            <div className="text-sm text-text-secondary">현재 스트릭</div>
                        </div>
                        <div className="bg-surface-secondary rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-text-primary">
                                {displayUser.gamification.longestStreak}일
                            </div>
                            <div className="text-sm text-text-secondary">최장 스트릭</div>
                        </div>
                    </div>

                    {/* Streak milestones */}
                    <div className="space-y-2">
                        {STREAK_MILESTONES.slice(0, 4).map((milestone) => (
                            <div
                                key={milestone.days}
                                className={`flex items-center justify-between p-2 rounded-xl ${displayUser.gamification.streak >= milestone.days
                                    ? 'bg-secondary-50'
                                    : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${displayUser.gamification.streak >= milestone.days
                                        ? 'bg-secondary-500 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                        }`}>
                                        {displayUser.gamification.streak >= milestone.days ? '✓' : milestone.days}
                                    </span>
                                    <span className={
                                        displayUser.gamification.streak >= milestone.days
                                            ? 'text-secondary-700 font-medium'
                                            : 'text-text-secondary'
                                    }>
                                        {milestone.badge}
                                    </span>
                                </div>
                                <span className={`text-sm ${displayUser.gamification.streak >= milestone.days
                                    ? 'text-secondary-500'
                                    : 'text-text-muted'
                                    }`}>
                                    +{milestone.xp} XP
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Badges */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" />
                            뱃지 컬렉션
                        </h3>
                        <span className="text-sm text-text-secondary">
                            {displayUser.gamification.badges.length}개 획득
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {displayUser.gamification.badges.map((badge) => (
                            <motion.div
                                key={badge.id}
                                className="aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 
                           rounded-xl flex flex-col items-center justify-center p-2"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="text-2xl">{badge.icon}</span>
                                <span className="text-xs text-text-secondary mt-1 text-center truncate w-full">
                                    {badge.name}
                                </span>
                            </motion.div>
                        ))}
                        {/* Empty slots */}
                        {Array.from({ length: 4 - (displayUser.gamification.badges.length % 4) }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
                            >
                                <span className="text-gray-300 text-2xl">?</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            활동 통계
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-surface-secondary rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-text-primary">{stats.totalRecords}</div>
                            <div className="text-sm text-text-secondary">총 기록</div>
                        </div>
                        <div className="bg-surface-secondary rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-secondary-500">{stats.goalAchievementRate}%</div>
                            <div className="text-sm text-text-secondary">목표 달성률</div>
                        </div>
                    </div>

                    <NutritionBar
                        label="평균 섭취 칼로리"
                        current={stats.averageCalories}
                        goal={displayUser.profile?.dailyCalorieGoal || 1800}
                        unit="kcal"
                        color="orange"
                    />
                </motion.div>

                {/* Profile Tabs - 내 게시글, 댓글, 스크랩 */}
                <ProfileTabs userId="u_001" />

                {/* Menu Items */}
                <motion.div
                    className="card p-0 overflow-hidden mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {[
                        { icon: '⚙️', label: '목표 설정', description: '칼로리, 영양소 목표 수정' },
                        { icon: '🔔', label: '알림 설정', description: '리마인더, 푸시 알림 설정' },
                        { icon: '👤', label: '계정 관리', description: '프로필 정보 수정' },
                        { icon: '❓', label: '도움말', description: '사용 방법, FAQ' },
                    ].map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center gap-4 p-4 hover:bg-surface-secondary transition-colors border-b border-gray-100 last:border-0"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-text-primary">{item.label}</div>
                                <div className="text-sm text-text-secondary">{item.description}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-text-muted" />
                        </button>
                    ))}
                </motion.div>

                {/* Logout */}
                <button className="w-full flex items-center justify-center gap-2 text-red-500 font-medium py-3">
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </div>
        </div>
    );
}
