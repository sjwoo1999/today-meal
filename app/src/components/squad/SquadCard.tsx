'use client';

import { motion } from 'framer-motion';
import { Users, Trophy, Lock, ChevronRight } from 'lucide-react';
import type { Squad } from '@/types';

interface SquadCardProps {
    squad: Squad;
    onClick: () => void;
    variant?: 'default' | 'compact';
}

export default function SquadCard({ squad, onClick, variant = 'default' }: SquadCardProps) {
    if (variant === 'compact') {
        return (
            <motion.button
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
                data-testid="squad-card"
                data-squad-id={squad.id}
                className="w-full bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 text-left"
            >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xl flex-shrink-0">
                    {squad.isPrivate ? '🔒' : '👥'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-gray-900 truncate">{squad.name}</h3>
                        {squad.isPrivate && <Lock className="w-3 h-3 text-gray-400" />}
                    </div>
                    <p className="text-sm text-gray-500">
                        {squad.memberCount}명 · 챌린지 {squad.activeChallenges}개
                    </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </motion.button>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            data-testid="squad-card"
            data-squad-id={squad.id}
            className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-left"
        >
            {/* Header Image */}
            <div className="h-24 bg-gradient-to-br from-green-400 to-blue-500 relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                    {squad.isPrivate ? '🔒' : '🏆'}
                </div>
                {squad.isPrivate && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        비공개
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1" data-testid="squad-name">{squad.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{squad.description}</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {squad.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600" data-testid="member-count">
                            <Users className="w-4 h-4" />
                            <span>{squad.memberCount}/{squad.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span>{squad.activeChallenges}개</span>
                        </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                        {squad.weeklyXP.toLocaleString()} XP/주
                    </div>
                </div>
            </div>
        </motion.button>
    );
}
