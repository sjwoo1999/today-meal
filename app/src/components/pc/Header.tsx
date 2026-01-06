'use client';

import { motion } from 'framer-motion';
import { Search, Bell, Flame, Star, Trophy, ChevronDown, LogOut } from 'lucide-react';
import { useUserStore, useAuthStore, getLevelInfo } from '@/store';
import { LEAGUE_COLORS, LeagueTier } from '@/types';
import { useState } from 'react';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
    const user = useUserStore((state) => state.user);
    const { logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Mock user data
    const mockUser = {
        name: '지영',
        gamification: {
            xp: 850,
            level: 4,
            streak: 12,
            league: 'gold' as LeagueTier,
        },
    };

    const displayUser = user || mockUser;
    const levelInfo = getLevelInfo(displayUser.gamification.xp);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    // Mock notifications
    const notifications = [
        { id: 1, message: '트레이너님이 피드백을 보냈어요!', time: '10분 전' },
        { id: 2, message: '🔥 스트릭 12일 달성!', time: '1시간 전' },
        { id: 3, message: '오늘의 퀘스트가 도착했어요', time: '오늘 09:00' },
    ];

    return (
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 px-6 items-center justify-between sticky top-0 z-30">
            {/* Left: Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="음식 검색... (/ 키로 포커스)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-xs text-gray-400 bg-white border border-gray-200 rounded">
                        /
                    </kbd>
                </div>
            </form>

            {/* Right: Stats & Profile */}
            <div className="flex items-center gap-4">
                {/* Streak */}
                <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full cursor-pointer hover:bg-orange-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                >
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-orange-700">{displayUser.gamification.streak}일</span>
                </motion.div>

                {/* XP */}
                <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full cursor-pointer hover:bg-green-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                >
                    <Star className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">{displayUser.gamification.xp} XP</span>
                </motion.div>

                {/* League */}
                <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${LEAGUE_COLORS[displayUser.gamification.league]}20` }}
                    whileHover={{ scale: 1.02 }}
                >
                    <Trophy className="w-4 h-4" style={{ color: LEAGUE_COLORS[displayUser.gamification.league] }} />
                    <span className="font-semibold capitalize" style={{ color: LEAGUE_COLORS[displayUser.gamification.league] }}>
                        {displayUser.gamification.league === 'gold' ? '골드' :
                            displayUser.gamification.league === 'silver' ? '실버' :
                                displayUser.gamification.league === 'bronze' ? '브론즈' :
                                    displayUser.gamification.league === 'platinum' ? '플래티넘' : '다이아몬드'}
                    </span>
                </motion.div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">알림</h3>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                                        <p className="text-sm text-gray-900">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Hanki Mini */}
                <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-2xl">🍚</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {displayUser.name[0]}
                        </div>
                        <span className="font-medium text-gray-700">{displayUser.name}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {showProfile && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="font-bold text-gray-900">{displayUser.name}</p>
                                <p className="text-sm text-gray-500">Lv.{levelInfo.level} {levelInfo.title}</p>
                            </div>
                            <div className="py-2">
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                    프로필 설정
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                    알림 설정
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                    도움말
                                </button>
                            </div>
                            <div className="border-t border-gray-100 py-2">
                                <button
                                    onClick={() => {
                                        setShowProfile(false);
                                        setShowLogoutConfirm(true);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(showNotifications || showProfile) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowNotifications(false);
                        setShowProfile(false);
                    }}
                />
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-sm"
                    >
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                로그아웃 하시겠습니까?
                            </h3>
                            <p className="text-sm text-gray-500">
                                로그아웃하면 다시 로그인해야 합니다.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowLogoutConfirm(false);
                                }}
                                className="flex-1 py-3 px-4 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </header>
    );
}
