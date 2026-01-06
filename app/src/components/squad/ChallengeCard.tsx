'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Flame, Target } from 'lucide-react';
import type { Challenge } from '@/types';

interface ChallengeCardProps {
    challenge: Challenge;
    onClick: () => void;
    variant?: 'default' | 'compact';
}

export default function ChallengeCard({ challenge, onClick, variant = 'default' }: ChallengeCardProps) {
    const getChallengeIcon = (type: Challenge['type']) => {
        switch (type) {
            case 'streak': return <Flame className="w-5 h-5 text-orange-500" />;
            case 'calorie': return <Target className="w-5 h-5 text-green-500" />;
            case 'protein': return <Target className="w-5 h-5 text-blue-500" />;
            case 'record': return <Calendar className="w-5 h-5 text-purple-500" />;
            case 'steps': return <Target className="w-5 h-5 text-amber-500" />;
        }
    };

    const getChallengeColor = (type: Challenge['type']) => {
        switch (type) {
            case 'streak': return 'from-orange-400 to-red-500';
            case 'calorie': return 'from-green-400 to-green-600';
            case 'protein': return 'from-blue-400 to-blue-600';
            case 'record': return 'from-purple-400 to-purple-600';
            case 'steps': return 'from-amber-400 to-amber-600';
        }
    };

    const daysRemaining = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    if (variant === 'compact') {
        return (
            <motion.button
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
                data-testid="challenge-card"
                data-challenge-id={challenge.id}
                className="w-full bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 text-left"
            >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getChallengeColor(challenge.type)} flex items-center justify-center`}>
                    <span className="text-white">{getChallengeIcon(challenge.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{challenge.title}</h3>
                    <p className="text-sm text-gray-500">
                        {challenge.participants}명 참여 · {daysRemaining}일 남음
                    </p>
                </div>
                {challenge.prizes && challenge.prizes.length > 0 && (
                    <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}
            </motion.button>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            data-testid="challenge-card"
            data-challenge-id={challenge.id}
            className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-left"
        >
            {/* Header */}
            <div className={`h-20 bg-gradient-to-r ${getChallengeColor(challenge.type)} relative p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-white">
                    {getChallengeIcon(challenge.type)}
                    <div>
                        <p className="text-white/80 text-sm">목표</p>
                        <p className="font-bold text-lg">{challenge.goal} {challenge.unit}</p>
                    </div>
                </div>
                {challenge.status === 'active' && (
                    <div className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                        D-{daysRemaining}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{challenge.description}</p>

                {/* Prizes */}
                {challenge.prizes && challenge.prizes.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-700">보상</span>
                        </div>
                        <div className="space-y-1">
                            {challenge.prizes.slice(0, 3).map((prize) => (
                                <div key={prize.rank} className="flex items-center gap-2 text-sm">
                                    <span className="w-5 text-amber-600 font-medium">
                                        {prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                    <span className="text-gray-700">{prize.reward}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants}명 참여</span>
                    </div>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        data-testid="join-challenge-button"
                        className="text-sm text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full"
                    >
                        참여하기
                    </motion.span>
                </div>
            </div>
        </motion.button>
    );
}
