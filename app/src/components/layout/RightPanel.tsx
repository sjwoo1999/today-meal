'use client';

import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, TrendingUp, X } from 'lucide-react';
import { useUserStore, useHankiStore, getLevelInfo, getXPProgress } from '@/store';

interface RightPanelProps {
    isVisible?: boolean;
    onClose?: () => void;
}

export default function RightPanel({ isVisible = true, onClose }: RightPanelProps) {
    const { user } = useUserStore();
    const { emotion, message } = useHankiStore();

    const levelInfo = user ? getLevelInfo(user.gamification.xp) : null;
    const xpProgress = user ? getXPProgress(user.gamification.xp) : null;

    if (!isVisible) return null;

    // Get current date info for mini calendar
    const today = new Date();
    const currentMonth = today.toLocaleDateString('ko-KR', { month: 'long' });
    const currentYear = today.getFullYear();

    // Generate calendar days for current week
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    // Hanki emoji based on emotion
    const hankiEmoji =
        emotion === 'happy'
            ? '😊'
            : emotion === 'sad'
            ? '😢'
            : emotion === 'worried'
            ? '😟'
            : emotion === 'cheering'
            ? '💪'
            : '🍚';

    return (
        <aside className="fixed right-0 top-0 h-full w-[320px] bg-gray-50 border-l border-gray-200 z-30 overflow-y-auto">
            <div className="p-4 space-y-6">
                {/* Header with close button for tablet */}
                {onClose && (
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                )}

                {/* Hanki Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                            <span className="text-3xl">{hankiEmoji}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">한끼</p>
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Mini Calendar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-900">
                            {currentYear}년 {currentMonth}
                        </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {weekDays.map((day) => (
                            <div key={day} className="text-xs text-gray-400 py-1">
                                {day}
                            </div>
                        ))}
                        {weekDates.map((date, i) => {
                            const isToday =
                                date.toDateString() === today.toDateString();
                            return (
                                <div
                                    key={i}
                                    className={`py-2 rounded-full text-sm ${
                                        isToday
                                            ? 'bg-green-500 text-white font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Stats Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-900">오늘의 현황</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-amber-500">
                                {user?.gamification.streak || 0}
                            </p>
                            <p className="text-xs text-gray-500">연속 기록</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-green-500">
                                {user?.gamification.weeklyXP || 0}
                            </p>
                            <p className="text-xs text-gray-500">주간 XP</p>
                        </div>
                    </div>
                    {xpProgress && levelInfo && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Lv.{levelInfo.level} → Lv.{levelInfo.level + 1}</span>
                                <span className="text-gray-500">
                                    {xpProgress.current} / {xpProgress.needed} XP
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpProgress.percentage}%` }}
                                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* League Rank */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-gray-900">리그 순위</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    user?.gamification.league === 'gold'
                                        ? 'bg-amber-100'
                                        : user?.gamification.league === 'silver'
                                        ? 'bg-gray-100'
                                        : 'bg-amber-50'
                                }`}
                            >
                                <span className="text-xl">
                                    {user?.gamification.league === 'gold'
                                        ? '🥇'
                                        : user?.gamification.league === 'silver'
                                        ? '🥈'
                                        : '🥉'}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {user?.gamification.league || 'Bronze'} 리그
                                </p>
                                <p className="text-xs text-gray-500">상위 15%</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">#12</p>
                            <p className="text-xs text-gray-500">현재 순위</p>
                        </div>
                    </div>
                </motion.div>

                {/* Active Friends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-gray-900">활동 중인 친구</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: '헬시지영', streak: 12, avatar: '🏃‍♀️' },
                            { name: '닭가슴민수', streak: 8, avatar: '💪' },
                            { name: '샐러드소희', streak: 5, avatar: '🥗' },
                        ].map((friend, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <span>{friend.avatar}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {friend.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-amber-500">
                                    <span>🔥</span>
                                    <span>{friend.streak}일</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </aside>
    );
}
