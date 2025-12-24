'use client';

import { motion } from 'framer-motion';
import { Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { LeagueTier, LeagueRanking, LEAGUE_COLORS } from '@/types';

// Mock league data
const MOCK_RANKINGS: LeagueRanking[] = [
    { rank: 1, userId: 'u1', userName: '헬스왕', weeklyXP: 320, league: 'gold' },
    { rank: 2, userId: 'u2', userName: '식단마스터', weeklyXP: 285, league: 'gold' },
    { rank: 3, userId: 'u3', userName: '지영', weeklyXP: 185, league: 'silver', isCurrentUser: true },
    { rank: 4, userId: 'u4', userName: '런닝맨', weeklyXP: 175, league: 'silver' },
    { rank: 5, userId: 'u5', userName: '다이어터', weeklyXP: 160, league: 'silver' },
    { rank: 6, userId: 'u6', userName: '근육충', weeklyXP: 145, league: 'silver' },
    { rank: 7, userId: 'u7', userName: '헬린이', weeklyXP: 120, league: 'bronze' },
    { rank: 8, userId: 'u8', userName: '초보회원', weeklyXP: 85, league: 'bronze' },
];

const LEAGUE_INFO: Record<LeagueTier, { name: string; nameKr: string; icon: string }> = {
    bronze: { name: 'Bronze', nameKr: '브론즈', icon: '🥉' },
    silver: { name: 'Silver', nameKr: '실버', icon: '🥈' },
    gold: { name: 'Gold', nameKr: '골드', icon: '🥇' },
    platinum: { name: 'Platinum', nameKr: '플래티넘', icon: '💎' },
    diamond: { name: 'Diamond', nameKr: '다이아몬드', icon: '💠' },
};

interface LeaguePageProps {
    currentLeague?: LeagueTier;
    currentRank?: number;
    weeklyXP?: number;
}

export default function LeaguePage({
    currentLeague = 'silver',
    currentRank = 3,
    weeklyXP = 185
}: LeaguePageProps) {
    const leagueInfo = LEAGUE_INFO[currentLeague];
    const xpToFirst = MOCK_RANKINGS[0].weeklyXP - weeklyXP;

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-secondary to-white pb-24">
            {/* Header */}
            <div
                className="p-6 pb-20 rounded-b-3xl text-white"
                style={{
                    background: `linear-gradient(135deg, ${LEAGUE_COLORS[currentLeague]}, ${adjustColor(LEAGUE_COLORS[currentLeague], -30)})`
                }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">주간 리그</h1>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl">{leagueInfo.icon}</span>
                            <span className="text-xl font-bold">{leagueInfo.nameKr} 리그</span>
                        </div>
                        <p className="text-white/80 text-sm">OO PT 회원들과 함께</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{currentRank}위</div>
                        <div className="text-sm text-white/80">{weeklyXP} XP</div>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-12 space-y-4">
                {/* Stats Card */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-primary-500">{currentRank}</div>
                            <div className="text-sm text-text-secondary">현재 순위</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-secondary-500">{weeklyXP}</div>
                            <div className="text-sm text-text-secondary">이번 주 XP</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">{xpToFirst}</div>
                            <div className="text-sm text-text-secondary">1위까지</div>
                        </div>
                    </div>
                </motion.div>

                {/* Promotion Zone */}
                <motion.div
                    className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 text-green-700">
                        <ChevronUp className="w-5 h-5" />
                        <span className="font-semibold">승급권: 상위 20% (1-2위)</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                        지금 순위 유지하면 골드 리그 승급! 🏆
                    </p>
                </motion.div>

                {/* Rankings */}
                <motion.div
                    className="card p-0 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-surface-secondary px-4 py-3 border-b border-gray-100">
                        <h3 className="font-bold text-text-primary">🏅 이번 주 랭킹</h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {MOCK_RANKINGS.map((ranking, index) => (
                            <motion.div
                                key={ranking.userId}
                                className={`flex items-center gap-4 px-4 py-3 ${ranking.isCurrentUser ? 'bg-primary-50' : ''
                                    }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Rank */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${ranking.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                        ranking.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                            ranking.rank === 3 ? 'bg-orange-300 text-orange-800' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {ranking.rank}
                                </div>

                                {/* User info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${ranking.isCurrentUser ? 'text-primary-600' : 'text-text-primary'
                                            }`}>
                                            {ranking.userName}
                                        </span>
                                        {ranking.isCurrentUser && (
                                            <span className="badge-primary text-xs">나</span>
                                        )}
                                    </div>
                                </div>

                                {/* XP */}
                                <div className="text-right">
                                    <div className="font-bold text-text-primary">{ranking.weeklyXP}</div>
                                    <div className="text-xs text-text-muted">XP</div>
                                </div>

                                {/* Change indicator */}
                                <div className="w-6">
                                    {ranking.rank <= 2 ? (
                                        <ChevronUp className="w-5 h-5 text-green-500" />
                                    ) : ranking.rank >= 7 ? (
                                        <ChevronDown className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <Minus className="w-5 h-5 text-gray-300" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Relegation Warning */}
                <motion.div
                    className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 text-red-700">
                        <ChevronDown className="w-5 h-5" />
                        <span className="font-semibold">강등권: 하위 20% (7-8위)</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                        기록 한 번이면 안전!
                    </p>
                </motion.div>

                {/* League Info */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="font-bold text-text-primary mb-3">🏆 리그 시스템</h3>
                    <div className="space-y-2">
                        {Object.entries(LEAGUE_INFO).reverse().map(([tier, info]) => (
                            <div
                                key={tier}
                                className={`flex items-center gap-3 p-2 rounded-xl ${tier === currentLeague ? 'bg-primary-50 border-2 border-primary-200' : ''
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: LEAGUE_COLORS[tier as LeagueTier] }}
                                >
                                    <span className="text-lg">{info.icon}</span>
                                </div>
                                <span className={`font-medium ${tier === currentLeague ? 'text-primary-600' : 'text-text-secondary'
                                    }`}>
                                    {info.nameKr}
                                </span>
                                {tier === currentLeague && (
                                    <span className="ml-auto badge-primary text-xs">현재</span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
    const clamp = (num: number) => Math.min(255, Math.max(0, num));
    const hex = color.replace('#', '');
    const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
    const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
    const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
