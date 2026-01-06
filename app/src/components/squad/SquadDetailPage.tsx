'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Settings, Crown, Shield, Plus } from 'lucide-react';
import type { SquadMember } from '@/types';
import { getSquadById, getSquadMembers, getChallengesBySquadId } from '@/data/mockSquads';
import ChallengeCard from './ChallengeCard';
import CreateChallengeModal from './CreateChallengeModal';

interface SquadDetailPageProps {
    squadId: string;
    onBack: () => void;
    onChallengeSelect: (challengeId: string) => void;
}

type Tab = 'challenges' | 'members' | 'chat';

export default function SquadDetailPage({ squadId, onBack, onChallengeSelect }: SquadDetailPageProps) {
    const [activeTab, setActiveTab] = useState<Tab>('challenges');
    const [isJoined, setIsJoined] = useState(true); // Mock joined state
    const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);

    const squad = getSquadById(squadId);
    const members = getSquadMembers(squadId);
    const challenges = getChallengesBySquadId(squadId);

    if (!squad) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">스쿼드를 찾을 수 없습니다</p>
            </div>
        );
    }

    const getRoleBadge = (role: SquadMember['role']) => {
        switch (role) {
            case 'owner': return { icon: Crown, color: 'text-amber-500', label: '방장' };
            case 'admin': return { icon: Shield, color: 'text-blue-500', label: '관리자' };
            default: return null;
        }
    };

    const tabs = [
        { id: 'challenges' as Tab, label: '챌린지', count: challenges.length },
        { id: 'members' as Tab, label: '멤버', count: squad.memberCount },
        { id: 'chat' as Tab, label: '채팅' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                {/* Navigation */}
                <div className="flex items-center justify-between p-4">
                    <button onClick={onBack} className="p-2 -ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="p-2 -mr-2">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Squad Info */}
                <div className="px-6 pb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
                            {squad.isPrivate ? '🔒' : '👥'}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold mb-1">{squad.name}</h1>
                            <p className="text-green-100 text-sm line-clamp-2">{squad.description}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {squad.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{squad.memberCount}/{squad.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-amber-300" />
                            <span>{squad.activeChallenges} 챌린지</span>
                        </div>
                        <div className="text-green-200">
                            {squad.weeklyXP.toLocaleString()} XP/주
                        </div>
                    </div>
                </div>

                {/* Join Button */}
                {!isJoined && (
                    <div className="px-6 pb-6">
                        <motion.button
                            onClick={() => setIsJoined(true)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-white text-green-600 rounded-xl font-semibold"
                        >
                            스쿼드 참여하기
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-sm font-medium relative ${
                                activeTab === tab.id ? 'text-green-600' : 'text-gray-500'
                            }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
                            )}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-24">
                {activeTab === 'challenges' && (
                    <div className="space-y-4">
                        {/* Create Challenge Button */}
                        {isJoined && (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateChallengeModal(true)}
                                className="w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                새 챌린지 만들기
                            </motion.button>
                        )}

                        {challenges.length > 0 ? (
                            challenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    onClick={() => onChallengeSelect(challenge.id)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🏆</div>
                                <h3 className="font-bold text-gray-900 mb-2">진행 중인 챌린지가 없어요</h3>
                                <p className="text-gray-500 text-sm">
                                    첫 번째 챌린지를 만들어보세요!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="space-y-2">
                        {members.map((member, index) => {
                            const badge = getRoleBadge(member.role);

                            return (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl p-3 flex items-center gap-3"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-lg">
                                        {member.userName.slice(0, 1)}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">{member.userName}</p>
                                            {badge && (
                                                <div className={`flex items-center gap-0.5 text-xs ${badge.color}`}>
                                                    <badge.icon className="w-3 h-3" />
                                                    {badge.label}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            🔥 {member.streak}일 연속 · {member.weeklyXP} XP/주
                                        </p>
                                    </div>

                                    {/* Rank */}
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-400">
                                            #{index + 1}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {members.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">멤버 정보를 불러올 수 없습니다</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="font-bold text-gray-900 mb-2">스쿼드 채팅</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            멤버들과 자유롭게 대화해요!
                        </p>
                        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-500">
                            채팅 기능은 준비 중이에요 🚧
                        </div>
                    </div>
                )}
            </div>

            {/* Create Challenge Modal */}
            <CreateChallengeModal
                isOpen={showCreateChallengeModal}
                onClose={() => setShowCreateChallengeModal(false)}
                squadId={squadId}
                onSuccess={(challengeId) => {
                    setShowCreateChallengeModal(false);
                    onChallengeSelect(challengeId);
                }}
            />
        </div>
    );
}
