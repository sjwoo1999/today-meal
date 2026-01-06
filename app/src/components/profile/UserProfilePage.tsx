'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Award, Calendar, Grid3X3, Trophy } from 'lucide-react';
import { useUIStore, useFollowStore } from '@/store';
import { getUserById } from '@/data/mockUsers';
import FollowButton from './FollowButton';
import FollowListModal from './FollowListModal';

type TabType = 'posts' | 'achievements' | 'calendar';

export default function UserProfilePage() {
    const { selectedUserId, setActiveTab, setSelectedUserId } = useUIStore();
    const { getFollowerCount, getFollowingCount } = useFollowStore();
    const [activeTab, setActiveProfileTab] = useState<TabType>('posts');
    const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);

    const user = selectedUserId ? getUserById(selectedUserId) : null;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">사용자를 찾을 수 없습니다</p>
            </div>
        );
    }

    const isCurrentUser = user.id === 'u_001';
    const followerCount = getFollowerCount(user.id);
    const followingCount = getFollowingCount(user.id);

    const handleBack = () => {
        setSelectedUserId(null);
        setActiveTab('feed');
    };

    const tabs = [
        { id: 'posts' as TabType, label: '게시물', icon: Grid3X3 },
        { id: 'achievements' as TabType, label: '업적', icon: Trophy },
        { id: 'calendar' as TabType, label: '기록', icon: Calendar },
    ];

    // Mock post count
    const postCount = Math.floor(Math.random() * 50) + 10;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="flex items-center gap-3 px-4 py-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">{user.nickname}</h1>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white px-4 py-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">{user.nickname}</h2>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Lv.{user.level}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{user.title}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-orange-500">
                                <Flame className="w-4 h-4" />
                                <span className="font-bold">{user.streak}일</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Award className="w-4 h-4" />
                                <span className="font-medium">{user.xp.toLocaleString()} XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Follow Stats & Button */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-6">
                        <div className="text-center">
                            <p className="font-bold text-gray-900">{postCount}</p>
                            <p className="text-xs text-gray-500">게시물</p>
                        </div>
                        <button
                            onClick={() => setShowFollowModal('followers')}
                            className="text-center hover:opacity-70"
                        >
                            <p className="font-bold text-gray-900">{followerCount}</p>
                            <p className="text-xs text-gray-500">팔로워</p>
                        </button>
                        <button
                            onClick={() => setShowFollowModal('following')}
                            className="text-center hover:opacity-70"
                        >
                            <p className="font-bold text-gray-900">{followingCount}</p>
                            <p className="text-xs text-gray-500">팔로잉</p>
                        </button>
                    </div>

                    {!isCurrentUser && (
                        <FollowButton userId={user.id} size="md" />
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b mt-2">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveProfileTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                    <span className="text-2xl">
                                        {['🍱', '🥗', '🍜', '🍳', '🥪', '🍲', '🍛', '🥙', '🍣'][i]}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="space-y-3">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">🏆</span>
                                </div>
                                <div>
                                    <p className="font-medium">연속 기록 달성</p>
                                    <p className="text-sm text-gray-500">{user.streak}일 연속 기록</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">🥗</span>
                                </div>
                                <div>
                                    <p className="font-medium">식단 마스터</p>
                                    <p className="text-sm text-gray-500">100회 식사 기록</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">💪</span>
                                </div>
                                <div>
                                    <p className="font-medium">단백질 챌린저</p>
                                    <p className="text-sm text-gray-500">단백질 목표 7일 달성</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">기록 캘린더</p>
                            <p className="text-sm text-gray-400 mt-1">
                                이번 달 {Math.floor(Math.random() * 20) + 10}일 기록
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Follow Modal */}
            {showFollowModal && (
                <FollowListModal
                    isOpen={true}
                    onClose={() => setShowFollowModal(null)}
                    userId={user.id}
                    type={showFollowModal}
                />
            )}
        </div>
    );
}
