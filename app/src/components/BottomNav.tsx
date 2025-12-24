'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store';
import { Home, Camera, Calendar, MessageSquare, User } from 'lucide-react';
import { UIState } from '@/types/ui';

const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'planner', label: '역추산', icon: Calendar },
    { id: 'record', label: '기록', icon: Camera, isCenter: true },
    { id: 'community', label: '커뮤니티', icon: MessageSquare, badge: true },
    { id: 'profile', label: '마이', icon: User },
];

export default function BottomNav() {
    const { activeTab, setActiveTab } = useUIStore();

    return (
        <nav className="bottom-nav">
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isCenter = item.isCenter;

                    // 중앙 기록 버튼
                    if (isCenter) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as UIState['activeTab'])}
                                className="relative -mt-6"
                            >
                                <motion.div
                                    className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 
                                     rounded-full flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Camera className="w-7 h-7 text-white" />
                                </motion.div>
                                <span className="text-xs mt-1 text-gray-500 block text-center">
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as UIState['activeTab'])}
                            className={`bottom-nav-item relative ${isActive ? 'active' : 'text-text-secondary'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary-50 rounded-xl"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 relative z-10 ${isActive ? 'text-primary-500' : ''}`}
                                />
                                {/* 알림 뱃지 */}
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full z-20" />
                                )}
                            </div>
                            <span className={`text-xs mt-1 relative z-10 ${isActive ? 'font-semibold text-primary-500' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
