'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Newspaper,
    Camera,
    Users,
    MessageCircle,
    ShoppingBag,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useUIStore, useUserStore, useAuthStore, getLevelInfo } from '@/store';

type TabType = 'home' | 'feed' | 'record' | 'squad' | 'coach' | 'shop' | 'profile' | 'settings';

interface NavItem {
    id: string;
    label: string;
    icon: typeof Home;
    tab: TabType;
}

const navItems: NavItem[] = [
    { id: 'home', label: '홈', icon: Home, tab: 'home' },
    { id: 'feed', label: '피드', icon: Newspaper, tab: 'feed' },
    { id: 'record', label: '기록', icon: Camera, tab: 'record' },
    { id: 'squad', label: '스쿼드', icon: Users, tab: 'squad' },
    { id: 'coach', label: 'AI 코치', icon: MessageCircle, tab: 'coach' },
    { id: 'shop', label: '포인트샵', icon: ShoppingBag, tab: 'shop' },
    { id: 'profile', label: '프로필', icon: User, tab: 'profile' },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
    const { activeTab, setActiveTab } = useUIStore();
    const { user } = useUserStore();
    const { logout } = useAuthStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const levelInfo = user ? getLevelInfo(user.gamification.xp) : null;

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
                isCollapsed ? 'w-20' : 'w-[280px]'
            }`}
            data-testid="sidebar"
        >
            <div className="flex flex-col h-full">
                {/* Logo & Toggle */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🍚</span>
                            <span className="font-bold text-lg text-gray-900">오늘한끼</span>
                        </div>
                    )}
                    {isCollapsed && <span className="text-2xl mx-auto">🍚</span>}
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    )}
                </div>

                {/* User Info */}
                {user && !isCollapsed && (
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                <span className="text-lg">{user.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                    Lv.{levelInfo?.level} {levelInfo?.title}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="text-amber-500">🔥</span>
                                <span className="text-gray-600">{user.gamification.streak}일</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-green-500">⭐</span>
                                <span className="text-gray-600">{user.gamification.xp} XP</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.tab;
                            const Icon = item.icon;

                            return (
                                <li key={item.id}>
                                    <motion.button
                                        onClick={() => setActiveTab(item.tab)}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                            isActive
                                                ? 'bg-green-50 text-green-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${
                                                isActive ? 'text-green-600' : 'text-gray-500'
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"
                                            />
                                        )}
                                    </motion.button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-gray-100 p-3">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors ${
                            isCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <Settings className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">설정</span>}
                    </button>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors ${
                            isCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">로그아웃</span>}
                    </button>
                </div>
            </div>

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
        </aside>
    );
}
