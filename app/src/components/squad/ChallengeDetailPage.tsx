'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Calendar, Users, Trophy, Flame, Target, Check } from 'lucide-react';
import type { Challenge, ChallengeVerification } from '@/types';
import { getChallengeById, getChallengeParticipants, getChallengeVerifications } from '@/data/mockSquads';
import ChallengeLeaderboard from './ChallengeLeaderboard';

interface ChallengeDetailPageProps {
    challengeId: string;
    onBack: () => void;
}

type Tab = 'leaderboard' | 'feed';

export default function ChallengeDetailPage({ challengeId, onBack }: ChallengeDetailPageProps) {
    const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
    const [isJoined, setIsJoined] = useState(true); // Mock joined state

    const challenge = getChallengeById(challengeId);
    const participants = getChallengeParticipants(challengeId);
    const verifications = getChallengeVerifications(challengeId);

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">챌린지를 찾을 수 없습니다</p>
            </div>
        );
    }

    const getChallengeColor = (type: Challenge['type']) => {
        switch (type) {
            case 'streak': return 'from-orange-400 to-red-500';
            case 'calorie': return 'from-green-400 to-green-600';
            case 'protein': return 'from-blue-400 to-blue-600';
            case 'record': return 'from-purple-400 to-purple-600';
            case 'steps': return 'from-amber-400 to-amber-600';
        }
    };

    const getChallengeIcon = (type: Challenge['type']) => {
        switch (type) {
            case 'streak': return <Flame className="w-6 h-6" />;
            case 'calorie': return <Target className="w-6 h-6" />;
            case 'protein': return <Target className="w-6 h-6" />;
            case 'record': return <Calendar className="w-6 h-6" />;
            case 'steps': return <Target className="w-6 h-6" />;
        }
    };

    const daysRemaining = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const totalDays = Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const progressDays = totalDays - daysRemaining;

    const tabs = [
        { id: 'leaderboard' as Tab, label: '순위' },
        { id: 'feed' as Tab, label: '인증 피드' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`bg-gradient-to-br ${getChallengeColor(challenge.type)} text-white`}>
                {/* Navigation */}
                <div className="flex items-center justify-between p-4">
                    <button onClick={onBack} className="p-2 -ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="p-2 -mr-2">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Challenge Info */}
                <div className="px-6 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            {getChallengeIcon(challenge.type)}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{challenge.title}</h1>
                            <p className="text-white/80 text-sm">{challenge.description}</p>
                        </div>
                    </div>

                    {/* Goal & Progress */}
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-white/70 text-sm">목표</p>
                                <p className="text-2xl font-bold">{challenge.goal} {challenge.unit}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 text-sm">남은 기간</p>
                                <p className="text-2xl font-bold">D-{daysRemaining}</p>
                            </div>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all"
                                style={{ width: `${(progressDays / totalDays) * 100}%` }}
                            />
                        </div>
                        <p className="text-white/70 text-xs mt-2 text-center">
                            {progressDays}/{totalDays}일 진행
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{challenge.participants}명 참여</span>
                        </div>
                        {challenge.prizes && challenge.prizes.length > 0 && (
                            <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4 text-amber-300" />
                                <span>보상 있음</span>
                            </div>
                        )}
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
                            챌린지 참여하기
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Prizes */}
            {challenge.prizes && challenge.prizes.length > 0 && (
                <div className="px-4 -mt-4 mb-4">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-gray-900">보상</h3>
                        </div>
                        <div className="space-y-2">
                            {challenge.prizes.map((prize) => (
                                <div key={prize.rank} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
                                    <span className="text-xl">
                                        {prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{prize.rank}등</p>
                                        <p className="text-sm text-gray-600">{prize.reward}</p>
                                    </div>
                                    {prize.points && (
                                        <span className="text-sm text-amber-600 font-medium">
                                            +{prize.points}P
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                {activeTab === 'leaderboard' && (
                    <ChallengeLeaderboard
                        participants={participants}
                        goalUnit={challenge.unit}
                        currentUserId="user_1"
                    />
                )}

                {activeTab === 'feed' && (
                    <div className="space-y-4">
                        {verifications.length > 0 ? (
                            verifications.map((verification) => (
                                <VerificationCard key={verification.id} verification={verification} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📸</div>
                                <h3 className="font-bold text-gray-900 mb-2">아직 인증이 없어요</h3>
                                <p className="text-gray-500 text-sm">
                                    첫 번째 인증을 올려보세요!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Verify Button (if joined) */}
            {isJoined && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r ${getChallengeColor(challenge.type)} text-white`}
                    >
                        <Check className="w-5 h-5" />
                        오늘 인증하기
                    </motion.button>
                </div>
            )}
        </div>
    );
}

interface VerificationCardProps {
    verification: ChallengeVerification;
}

function VerificationCard({ verification }: VerificationCardProps) {
    const formatTime = (date: Date) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    {verification.userName.slice(0, 1)}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900">{verification.userName}</p>
                    <p className="text-xs text-gray-500">{formatTime(verification.verifiedAt)}</p>
                </div>
                <div className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                    {verification.progress}일차
                </div>
            </div>

            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
            </div>

            {/* Caption & Reactions */}
            <div className="p-3">
                {verification.caption && (
                    <p className="text-gray-700 text-sm mb-3">{verification.caption}</p>
                )}
                <div className="flex items-center gap-3 text-sm">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                        🔥 {verification.reactions.fire}
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                        👍 {verification.reactions.thumbsUp}
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                        ❤️ {verification.reactions.heart}
                    </button>
                </div>
            </div>
        </div>
    );
}
