'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store';
import {
    Flame, Camera, Wrench, User,
    ChevronLeft, ChevronRight,
    Settings, HelpCircle, MessageSquare, MapPin
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { id: 'feed', label: '피드', icon: Flame, path: '/' },
    {
        id: 'boards', label: '게시판', icon: MessageSquare, path: '/boards', badge: 3,
        submenu: [
            { id: 'boards-hot', label: '🔥 인기글', path: '/boards/hot' },
            { id: 'boards-free', label: '💬 자유게시판', path: '/boards/free' },
            { id: 'boards-info', label: '🥗 다이어트 정보', path: '/boards/info' },
            { id: 'boards-qna', label: '❓ 질문게시판', path: '/boards/qna' },
            { id: 'boards-challenge', label: '🎉 인증게시판', path: '/boards/challenge' },
        ]
    },
    { id: 'record', label: '기록하기', icon: Camera, path: '/record' },
    {
        id: 'tools', label: '도구', icon: Wrench, path: '/tools',
        submenu: [
            { id: 'tools-planner', label: '📅 역추산 플래너', path: '/tools/planner' },
            { id: 'tools-dashboard', label: '📊 영양 대시보드', path: '/tools/dashboard' },
            { id: 'tools-analysis', label: '📈 분석', path: '/tools/analysis' },
            { id: 'tools-hanki', label: '🤖 한끼 AI', path: '/tools/hanki' },
        ]
    },
    { id: 'nearby', label: '주변 식당', icon: MapPin, path: '/nearby' },
    { id: 'profile', label: '마이', icon: User, path: '/profile' },
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
            data-testid="sidebar"
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
                                            ? 'bg-green-50 text-green-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-green-500' : ''}`} />

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
                      bg-green-500 text-white text-xs font-bold rounded-full
                    `}>
                                            {item.badge}
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
