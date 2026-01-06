'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trophy, Users, TrendingUp } from 'lucide-react';
import SquadCard from './SquadCard';
import ChallengeCard from './ChallengeCard';
import CreateSquadModal from './CreateSquadModal';
import {
    getMySquads,
    getRecommendedSquads,
    getActiveChallenges,
    SQUAD_CATEGORIES,
    getSquadsByCategory,
    searchSquads,
    getPopularSquads,
    getHotChallenges,
    type SquadCategory,
} from '@/data/mockSquads';
import { useSquad, useChallenge, useViewState } from '@/hooks/useServiceStore';
import { StateContainer } from '@/components/common';
import { useUserStore } from '@/store';

interface SquadListPageProps {
    onSquadSelect: (squadId: string) => void;
    onChallengeSelect: (challengeId: string) => void;
}

type Tab = 'my' | 'discover' | 'challenges';

export default function SquadListPage({ onSquadSelect, onChallengeSelect }: SquadListPageProps) {
    const { user } = useUserStore();

    // Use integrated hooks
    const {
        mySquads: storedSquads,
        setMySquads,
    } = useSquad();

    const {
        activeChallenges: storedChallenges,
        setActiveChallenges,
    } = useChallenge();

    const [activeTab, setActiveTab] = useState<Tab>('my');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<SquadCategory | 'all'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Load data into stores
    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

            const fetchedSquads = getMySquads(user?.id || 'user_1');
            const fetchedChallenges = getActiveChallenges();

            setMySquads(fetchedSquads);
            setActiveChallenges(fetchedChallenges);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, setMySquads, setActiveChallenges]);

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Use data from stores
    const mySquads = storedSquads.length > 0 ? storedSquads : getMySquads(user?.id || 'user_1');
    const recommendedSquads = getRecommendedSquads();
    const activeChallenges = storedChallenges.length > 0 ? storedChallenges : getActiveChallenges();

    const viewState = useViewState(mySquads, isLoading, error);

    // Use new helper functions for filtering
    const filteredRecommended = searchQuery
        ? searchSquads(searchQuery)
        : selectedCategory === 'all'
            ? recommendedSquads
            : getSquadsByCategory(selectedCategory);

    // Get popular squads and hot challenges
    const popularSquads = getPopularSquads(5);
    const hotChallenges = getHotChallenges(5);

    const tabs = [
        { id: 'my' as Tab, label: '내 스쿼드', icon: Users },
        { id: 'discover' as Tab, label: '발견', icon: Search },
        { id: 'challenges' as Tab, label: '챌린지', icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 pb-16 rounded-b-3xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">스쿼드</h1>
                        <p className="text-green-100 text-sm">함께하면 더 즐거운 건강관리</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        data-testid="create-squad-button"
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{mySquads.length}</p>
                        <p className="text-xs text-green-100">참여 스쿼드</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-green-100">진행 챌린지</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">850</p>
                        <p className="text-xs text-green-100">주간 XP</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 -mt-8 mb-4">
                <div className="bg-white rounded-xl shadow-lg p-1 flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            data-testid={`tab-${tab.id}`}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-600'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 space-y-4">
                {activeTab === 'my' && (
                    <StateContainer
                        state={viewState}
                        onRetry={loadData}
                        emptyIcon="👥"
                        emptyTitle="아직 참여한 스쿼드가 없어요"
                        emptyDescription="스쿼드에 참여해서 함께 건강해지세요!"
                        emptyAction={{
                            label: '스쿼드 둘러보기',
                            onClick: () => setActiveTab('discover'),
                        }}
                    >
                        <div className="space-y-3" data-testid="my-squads-list">
                            {mySquads.map((squad) => (
                                <SquadCard
                                    key={squad.id}
                                    squad={squad}
                                    onClick={() => onSquadSelect(squad.id)}
                                />
                            ))}

                            {/* Active Challenges in My Squads */}
                            {mySquads.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        <h3 className="font-bold text-gray-900">진행 중인 챌린지</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {activeChallenges.slice(0, 2).map((challenge) => (
                                            <ChallengeCard
                                                key={challenge.id}
                                                challenge={challenge}
                                                onClick={() => onChallengeSelect(challenge.id)}
                                                variant="compact"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </StateContainer>
                )}

                {activeTab === 'discover' && (
                    <>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value) setSelectedCategory('all');
                                }}
                                placeholder="스쿼드 검색..."
                                data-testid="squad-search"
                                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchQuery('');
                                }}
                                data-testid="category-filter-all"
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    selectedCategory === 'all' && !searchQuery
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                전체
                            </button>
                            {SQUAD_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setSearchQuery('');
                                    }}
                                    data-testid={`category-filter-${cat.id}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === cat.id && !searchQuery
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {cat.emoji} {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Popular Squads Section */}
                        {!searchQuery && selectedCategory === 'all' && (
                            <div className="mb-4" data-testid="popular-squads-section">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    🔥 인기 스쿼드
                                </h3>
                                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                    {popularSquads.slice(0, 4).map((squad) => (
                                        <motion.button
                                            key={squad.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onSquadSelect(squad.id)}
                                            className="flex-shrink-0 w-40 bg-white rounded-xl p-3 shadow-sm text-left"
                                        >
                                            <p className="font-medium text-gray-900 text-sm truncate">{squad.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">👥 {squad.memberCount}명</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filtered/Recommended Squads */}
                        <div className="space-y-3" data-testid="discover-list">
                            <h3 className="font-medium text-gray-700">
                                {searchQuery
                                    ? `"${searchQuery}" 검색 결과`
                                    : selectedCategory === 'all'
                                        ? '추천 스쿼드'
                                        : `${SQUAD_CATEGORIES.find(c => c.id === selectedCategory)?.name} 스쿼드`}
                            </h3>
                            {filteredRecommended.length > 0 ? (
                                filteredRecommended.map((squad) => (
                                    <SquadCard
                                        key={squad.id}
                                        squad={squad}
                                        onClick={() => onSquadSelect(squad.id)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    검색 결과가 없습니다
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'challenges' && (
                    <div className="space-y-4" data-testid="challenges-list">
                        {/* Hot Challenges Carousel */}
                        {hotChallenges.length > 0 && (
                            <div data-testid="hot-challenges-section">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    🔥 핫 챌린지
                                </h3>
                                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                    {hotChallenges.map((challenge) => (
                                        <motion.button
                                            key={challenge.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onChallengeSelect(challenge.id)}
                                            className="flex-shrink-0 w-48 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 text-left border border-orange-200"
                                        >
                                            <p className="font-medium text-gray-900 text-sm truncate">{challenge.title}</p>
                                            <p className="text-xs text-gray-600 mt-1">👥 {challenge.participants}명 참여중</p>
                                            <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full"
                                                    style={{ width: `${Math.min(100, (challenge.participants / 100) * 100)}%` }}
                                                />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Challenges */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">전체 챌린지</h3>
                            <div className="space-y-3">
                                {activeChallenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        onClick={() => onChallengeSelect(challenge.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Squad Modal */}
            <CreateSquadModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={(squadId) => {
                    setShowCreateModal(false);
                    onSquadSelect(squadId);
                }}
            />
        </div>
    );
}
