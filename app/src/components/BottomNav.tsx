'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store';
import { Flame, MessageSquare, Camera, Wrench, User } from 'lucide-react';
import { UIState } from '@/types/ui';

const navItems = [
    { id: 'feed', label: '피드', icon: Flame },
    { id: 'boards', label: '게시판', icon: MessageSquare },
    { id: 'record', label: '기록', icon: Camera, isCenter: true },
    { id: 'tools', label: '도구', icon: Wrench },
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
                                    className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-600 
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
                                    className="absolute inset-0 bg-coral-50 rounded-lg"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 relative z-10 ${isActive ? 'text-coral-500' : ''}`}
                                />
                            </div>
                            <span className={`text-xs mt-1 relative z-10 ${isActive ? 'font-semibold text-coral-500' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
