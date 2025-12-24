'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store';
import {
    Home, Camera, Calendar, Trophy, User,
    BarChart3, Target, ChevronLeft, ChevronRight,
    Settings, HelpCircle, PieChart, MessageSquare
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { id: 'home', label: '홈', icon: Home, path: '/' },
    { id: 'planner', label: '역추산 플래너', icon: Calendar, path: '/reverse-plan' },
    { id: 'record', label: '기록하기', icon: Camera, path: '/record' },
    { id: 'dashboard', label: '대시보드', icon: PieChart, path: '/dashboard' },
    { id: 'calendar', label: '캘린더', icon: Calendar, path: '/calendar', isNew: true },
    {
        id: 'community', label: '커뮤니티', icon: MessageSquare, path: '/community', badge: 3,
        submenu: [
            { id: 'community-hot', label: '🔥 인기글', path: '/community/hot' },
            { id: 'community-free', label: '💬 자유게시판', path: '/community/free' },
            { id: 'community-info', label: '🥗 다이어트 정보', path: '/community/info' },
            { id: 'community-qna', label: '❓ 질문게시판', path: '/community/qna' },
            { id: 'community-challenge', label: '🎉 인증게시판', path: '/community/challenge' },
        ]
    },
    { id: 'league', label: '리그', icon: Trophy, path: '/league' },
    { id: 'quests', label: '퀘스트', icon: Target, path: '/quests', badge: 2 },
    { id: 'analysis', label: '분석', icon: BarChart3, path: '/analysis' },
    { id: 'profile', label: '프로필', icon: User, path: '/profile' },
];

const footerItems = [
    { id: 'settings', label: '설정', icon: Settings, path: '/settings' },
    { id: 'help', label: '도움말', icon: HelpCircle, path: '/help' },
] as const;

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const { activeTab, setActiveTab } = useUIStore();
    const [isCollapsed, setIsCollapsed] = useState(collapsed);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
        onToggle?.();
    };

    return (
        <motion.aside
            className="hidden lg:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 z-40"
            initial={false}
            animate={{ width: isCollapsed ? 64 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-gray-100">
                <motion.div
                    className="flex items-center gap-3 overflow-hidden"
                    animate={{ opacity: 1 }}
                >
                    <span className="text-2xl">🍚</span>
                    {!isCollapsed && (
                        <motion.span
                            className="font-bold text-lg text-gray-900 whitespace-nowrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            오늘한끼
                        </motion.span>
                    )}
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id as 'home' | 'planner' | 'record' | 'dashboard' | 'calendar' | 'league' | 'quests' | 'analysis' | 'profile')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                    ${isActive
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-500' : ''}`} />

                                    {!isCollapsed && (
                                        <motion.span
                                            className="font-medium whitespace-nowrap"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}

                                    {/* Badge */}
                                    {item.badge && (
                                        <span className={`
                      ${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}
                      w-5 h-5 flex items-center justify-center
                      bg-primary-500 text-white text-xs font-bold rounded-full
                    `}>
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* New Badge */}
                                    {item.isNew && !isCollapsed && (
                                        <span className="ml-auto px-2 py-0.5 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                                            NEW
                                        </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg 
                                    opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Divider */}
            <div className="px-4">
                <div className="border-t border-gray-200" />
            </div>

            {/* Footer Items */}
            <div className="py-4 px-3">
                <ul className="space-y-1">
                    {footerItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors group relative"
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && (
                                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                                    )}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg 
                                    opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={handleToggle}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full 
                   flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                )}
            </button>
        </motion.aside>
    );
}
