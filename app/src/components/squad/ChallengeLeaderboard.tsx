'use client';

import { motion } from 'framer-motion';
import { Crown, TrendingUp, Flame } from 'lucide-react';
import type { ChallengeParticipant } from '@/types';

interface ChallengeLeaderboardProps {
    participants: ChallengeParticipant[];
    goalUnit: string;
    currentUserId?: string;
}

export default function ChallengeLeaderboard({
    participants,
    goalUnit,
    currentUserId,
}: ChallengeLeaderboardProps) {
    const sortedParticipants = [...participants].sort((a, b) => a.rank - b.rank);
    const topThree = sortedParticipants.slice(0, 3);
    const rest = sortedParticipants.slice(3);

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1: return { emoji: '🥇', color: 'from-yellow-400 to-amber-500', textColor: 'text-amber-600' };
            case 2: return { emoji: '🥈', color: 'from-gray-300 to-gray-400', textColor: 'text-gray-600' };
            case 3: return { emoji: '🥉', color: 'from-orange-300 to-orange-400', textColor: 'text-orange-600' };
            default: return { emoji: `${rank}`, color: 'from-gray-100 to-gray-200', textColor: 'text-gray-500' };
        }
    };

    return (
        <div className="space-y-4">
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-2 py-4">
                {/* 2nd Place */}
                {topThree[1] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2">
                            {topThree[1].profileImage ? (
                                <span className="text-2xl">👤</span>
                            ) : (
                                topThree[1].userName.slice(0, 1)
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[80px]">
                            {topThree[1].userName}
                        </p>
                        <p className="text-xs text-gray-500">{topThree[1].progress}/{topThree[1].goal}</p>
                        <div className="w-16 h-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2 flex items-end justify-center pb-1">
                            <span className="text-2xl">🥈</span>
                        </div>
                    </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <Crown className="w-6 h-6 text-amber-500 mb-1" />
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl mb-2 ring-2 ring-amber-400">
                            {topThree[0].profileImage ? (
                                <span className="text-2xl">👤</span>
                            ) : (
                                topThree[0].userName.slice(0, 1)
                            )}
                        </div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[80px]">
                            {topThree[0].userName}
                        </p>
                        <p className="text-xs text-amber-600 font-medium">{topThree[0].progress}/{topThree[0].goal}</p>
                        <div className="w-20 h-24 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg mt-2 flex items-end justify-center pb-1">
                            <span className="text-3xl">🥇</span>
                        </div>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl mb-2">
                            {topThree[2].profileImage ? (
                                <span className="text-2xl">👤</span>
                            ) : (
                                topThree[2].userName.slice(0, 1)
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[80px]">
                            {topThree[2].userName}
                        </p>
                        <p className="text-xs text-gray-500">{topThree[2].progress}/{topThree[2].goal}</p>
                        <div className="w-16 h-12 bg-gradient-to-t from-orange-300 to-orange-200 rounded-t-lg mt-2 flex items-end justify-center pb-1">
                            <span className="text-2xl">🥉</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Rest of Participants */}
            {rest.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {rest.map((participant, index) => {
                        const isCurrentUser = participant.userId === currentUserId;
                        const badge = getRankBadge(participant.rank);

                        return (
                            <motion.div
                                key={participant.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className={`flex items-center gap-3 p-3 ${
                                    index !== rest.length - 1 ? 'border-b border-gray-100' : ''
                                } ${isCurrentUser ? 'bg-green-50' : ''}`}
                            >
                                {/* Rank */}
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                                    <span className={`text-sm font-bold ${badge.textColor}`}>
                                        {participant.rank}
                                    </span>
                                </div>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    {participant.profileImage ? (
                                        <span>👤</span>
                                    ) : (
                                        <span className="text-gray-600 font-medium">
                                            {participant.userName.slice(0, 1)}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className={`font-medium ${isCurrentUser ? 'text-green-700' : 'text-gray-900'}`}>
                                        {participant.userName}
                                        {isCurrentUser && <span className="text-xs text-green-600 ml-1">(나)</span>}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-0.5">
                                            <Flame className="w-3 h-3 text-orange-500" />
                                            {participant.streak}일
                                        </span>
                                        <span className="flex items-center gap-0.5">
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                            {participant.progress}/{participant.goal} {goalUnit}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${isCurrentUser ? 'text-green-600' : 'text-gray-900'}`}>
                                        {Math.round((participant.progress / participant.goal) * 100)}%
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
