'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, AlertTriangle, TrendingUp, ChevronRight,
    MessageSquare, PieChart, Calendar, Flame, Award,
    Send, X, CheckSquare, Square, Bell,
    ArrowUpDown
} from 'lucide-react';
import { TrainerMember, LEAGUE_COLORS } from '@/types';

// Mock member data
const MOCK_MEMBERS: TrainerMember[] = [
    {
        id: 'm1',
        name: '김지영',
        email: 'jiyoung@email.com',
        profile: { dailyCalorieGoal: 1800, dailyProteinGoal: 120, dailyCarbGoal: 200, dailyFatGoal: 60, allergies: [], preferences: [], dislikedFoods: [], livingArea: '강남' },
        gamification: { xp: 485, level: 3, streak: 7, longestStreak: 14, streakFreezes: 2, badges: [], league: 'silver', weeklyXP: 185 },
        daysWithoutRecord: 0,
        weeklyRecordRate: 86,
        reversePlanUsageRate: 60,
        isAtRisk: false,
    },
    {
        id: 'm2',
        name: '이민지',
        email: 'minji@email.com',
        profile: { dailyCalorieGoal: 1600, dailyProteinGoal: 100, dailyCarbGoal: 180, dailyFatGoal: 50, allergies: [], preferences: [], dislikedFoods: [], livingArea: '서초' },
        gamification: { xp: 320, level: 2, streak: 3, longestStreak: 10, streakFreezes: 1, badges: [], league: 'bronze', weeklyXP: 95 },
        daysWithoutRecord: 1,
        weeklyRecordRate: 71,
        reversePlanUsageRate: 40,
        isAtRisk: false,
    },
    {
        id: 'm3',
        name: '박서준',
        email: 'seojun@email.com',
        profile: { dailyCalorieGoal: 2200, dailyProteinGoal: 150, dailyCarbGoal: 250, dailyFatGoal: 70, allergies: [], preferences: [], dislikedFoods: [], livingArea: '역삼' },
        gamification: { xp: 780, level: 4, streak: 0, longestStreak: 21, streakFreezes: 0, badges: [], league: 'gold', weeklyXP: 45 },
        daysWithoutRecord: 4,
        weeklyRecordRate: 29,
        reversePlanUsageRate: 15,
        isAtRisk: true,
    },
    {
        id: 'm4',
        name: '최유진',
        email: 'yujin@email.com',
        profile: { dailyCalorieGoal: 1700, dailyProteinGoal: 110, dailyCarbGoal: 190, dailyFatGoal: 55, allergies: [], preferences: [], dislikedFoods: [], livingArea: '강남' },
        gamification: { xp: 1250, level: 5, streak: 14, longestStreak: 30, streakFreezes: 3, badges: [], league: 'gold', weeklyXP: 210 },
        daysWithoutRecord: 0,
        weeklyRecordRate: 100,
        reversePlanUsageRate: 85,
        isAtRisk: false,
    },
    {
        id: 'm5',
        name: '정현우',
        email: 'hyunwoo@email.com',
        profile: { dailyCalorieGoal: 2400, dailyProteinGoal: 180, dailyCarbGoal: 280, dailyFatGoal: 80, allergies: [], preferences: [], dislikedFoods: [], livingArea: '판교' },
        gamification: { xp: 150, level: 2, streak: 0, longestStreak: 5, streakFreezes: 0, badges: [], league: 'bronze', weeklyXP: 20 },
        daysWithoutRecord: 5,
        weeklyRecordRate: 14,
        reversePlanUsageRate: 0,
        isAtRisk: true,
    },
];

// Quick feedback templates
const FEEDBACK_TEMPLATES = [
    { id: 'f1', text: '오늘 식단 완벽해요! 👏', emoji: '👏' },
    { id: 'f2', text: '역추산 활용 굿! 💪', emoji: '💪' },
    { id: 'f3', text: '단백질 조금만 더 챙겨요!', emoji: '🥩' },
    { id: 'f4', text: '오늘도 화이팅! 🔥', emoji: '🔥' },
    { id: 'f5', text: '스트릭 유지 중! 대단해요!', emoji: '🎯' },
    { id: 'f6', text: '기록 좀 해주세요! 📝', emoji: '📝' },
];

type SortOption = 'streak' | 'risk' | 'record' | 'xp';

export default function TrainerDashboard() {
    const [selectedMember, setSelectedMember] = useState<TrainerMember | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [customFeedback, setCustomFeedback] = useState('');

    // v2.0: Bulk selection
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<SortOption>('risk');

    const atRiskMembers = MOCK_MEMBERS.filter(m => m.isAtRisk);

    // Sort members based on selected option
    const sortedMembers = useMemo(() => {
        const members = [...MOCK_MEMBERS];
        switch (sortBy) {
            case 'risk':
                return members.sort((a, b) => b.daysWithoutRecord - a.daysWithoutRecord);
            case 'streak':
                return members.sort((a, b) => b.gamification.streak - a.gamification.streak);
            case 'record':
                return members.sort((a, b) => b.weeklyRecordRate - a.weeklyRecordRate);
            case 'xp':
                return members.sort((a, b) => b.gamification.weeklyXP - a.gamification.weeklyXP);
            default:
                return members;
        }
    }, [sortBy]);

    // Stats
    const avgRecordRate = Math.round(MOCK_MEMBERS.reduce((sum, m) => sum + m.weeklyRecordRate, 0) / MOCK_MEMBERS.length);
    const avgStreak = Math.round(MOCK_MEMBERS.reduce((sum, m) => sum + m.gamification.streak, 0) / MOCK_MEMBERS.length);
    const avgReversePlanUsage = Math.round(MOCK_MEMBERS.reduce((sum, m) => sum + m.reversePlanUsageRate, 0) / MOCK_MEMBERS.length);

    // Toggle member selection
    const toggleMemberSelection = (memberId: string) => {
        const newSelected = new Set(selectedMemberIds);
        if (newSelected.has(memberId)) {
            newSelected.delete(memberId);
        } else {
            newSelected.add(memberId);
        }
        setSelectedMemberIds(newSelected);
    };

    // Select all / deselect all
    const toggleSelectAll = () => {
        if (selectedMemberIds.size === MOCK_MEMBERS.length) {
            setSelectedMemberIds(new Set());
        } else {
            setSelectedMemberIds(new Set(MOCK_MEMBERS.map(m => m.id)));
        }
    };

    // Select all at-risk members
    const selectAtRiskMembers = () => {
        setSelectedMemberIds(new Set(atRiskMembers.map(m => m.id)));
    };

    const handleSendFeedback = (feedback: string) => {
        console.log(`Sending feedback to ${selectedMember?.name}: ${feedback}`);
        setShowFeedbackModal(false);
        setCustomFeedback('');
        setSelectedMember(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍚</span>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">오늘한끼 트레이너</h1>
                                <p className="text-sm text-gray-500">OO PT 회원 관리</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">김민수 트레이너</div>
                                <div className="text-xs text-gray-500">담당 회원 {MOCK_MEMBERS.length}명</div>
                            </div>
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                민
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-4 gap-4">
                    <motion.div
                        className="bg-white rounded-2xl p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-gray-500 text-sm">전체 회원</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{MOCK_MEMBERS.length}명</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-gray-500 text-sm">위험 회원</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600">{atRiskMembers.length}명</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-500 text-sm">평균 기록률</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{avgRecordRate}%</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Flame className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-gray-500 text-sm">평균 스트릭</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{avgStreak}일</div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* At Risk Members */}
                    <div className="col-span-2 space-y-4">
                        {atRiskMembers.length > 0 && (
                            <motion.div
                                className="bg-red-50 border-2 border-red-200 rounded-2xl p-5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <h2 className="text-lg font-bold text-red-800">⚠️ 위험 회원 ({atRiskMembers.length}명)</h2>
                                </div>
                                <div className="space-y-3">
                                    {atRiskMembers.map((member) => (
                                        <MemberCard
                                            key={member.id}
                                            member={member}
                                            onFeedback={() => {
                                                setSelectedMember(member);
                                                setShowFeedbackModal(true);
                                            }}
                                            isRisk
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Active Members */}
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Bulk Action Toolbar */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                    >
                                        {selectedMemberIds.size === MOCK_MEMBERS.length ? (
                                            <CheckSquare className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                        전체 선택
                                    </button>
                                    <button
                                        onClick={selectAtRiskMembers}
                                        className="text-sm text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        위험 회원만 선택
                                    </button>
                                </div>

                                {/* Sort Options */}
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="text-sm border-none bg-gray-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    >
                                        <option value="risk">위험도순</option>
                                        <option value="streak">스트릭순</option>
                                        <option value="record">기록률순</option>
                                        <option value="xp">XP순</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bulk Actions */}
                            <AnimatePresence>
                                {selectedMemberIds.size > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-3 mb-4 p-3 bg-green-50 rounded-xl"
                                    >
                                        <span className="text-sm font-medium text-green-700">
                                            {selectedMemberIds.size}명 선택됨
                                        </span>
                                        <button
                                            onClick={() => {
                                                const names = MOCK_MEMBERS
                                                    .filter(m => selectedMemberIds.has(m.id))
                                                    .map(m => m.name).join(', ');
                                                alert(`${names}에게 일괄 피드백을 보냈습니다: "오늘도 화이팅! 🔥"`);
                                                setSelectedMemberIds(new Set());
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            일괄 피드백
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Sending reminder to:', Array.from(selectedMemberIds));
                                                alert(`${selectedMemberIds.size}명에게 기록 알림을 보냈습니다!`);
                                                setSelectedMemberIds(new Set());
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            <Bell className="w-4 h-4" />
                                            미기록 알림
                                        </button>
                                        <button
                                            onClick={() => setSelectedMemberIds(new Set())}
                                            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            선택 해제
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <h2 className="text-lg font-bold text-gray-900 mb-3">👥 전체 회원</h2>
                            <div className="space-y-3">
                                {sortedMembers.map((member) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        onFeedback={() => {
                                            setSelectedMember(member);
                                            setShowFeedbackModal(true);
                                        }}
                                        isRisk={member.isAtRisk}
                                        isSelected={selectedMemberIds.has(member.id)}
                                        onToggleSelect={() => toggleMemberSelection(member.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-4">
                        {/* Reverse Plan Usage */}
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-green-500" />
                                <h3 className="font-bold text-gray-900">역추산 사용률</h3>
                            </div>
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-green-500">{avgReversePlanUsage}%</div>
                                <div className="text-sm text-gray-500">평균 사용률</div>
                            </div>
                            <div className="text-sm text-gray-600 bg-green-50 rounded-xl p-3">
                                <strong>💡 인사이트:</strong> 역추산 기능 사용 시 목표 달성률이 평균 23% 높아요!
                            </div>
                        </motion.div>

                        {/* Weekly Leaderboard */}
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-yellow-500" />
                                <h3 className="font-bold text-gray-900">이번 주 TOP 3</h3>
                            </div>
                            <div className="space-y-2">
                                {MOCK_MEMBERS
                                    .sort((a, b) => b.gamification.weeklyXP - a.gamification.weeklyXP)
                                    .slice(0, 3)
                                    .map((member, index) => (
                                        <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <span className="flex-1 font-medium">{member.name}</span>
                                            <span className="text-green-500 font-bold">{member.gamification.weeklyXP} XP</span>
                                        </div>
                                    ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="bg-white rounded-2xl p-5 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="font-bold text-gray-900 mb-4">⚡ 빠른 액션</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <span>전체 회원 메시지</span>
                                </button>
                                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-3">
                                    <PieChart className="w-5 h-5 text-green-500" />
                                    <span>주간 리포트 보기</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Feedback Modal */}
            {showFeedbackModal && selectedMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-md w-full"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">💬 {selectedMember.name}에게 피드백</h3>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick templates */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {FEEDBACK_TEMPLATES.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSendFeedback(template.text)}
                                    className="p-3 bg-gray-50 hover:bg-green-50 hover:border-green-300 
                             border-2 border-transparent rounded-xl text-left text-sm transition-colors"
                                >
                                    <span className="mr-2">{template.emoji}</span>
                                    {template.text}
                                </button>
                            ))}
                        </div>

                        {/* Custom feedback */}
                        <div className="space-y-3">
                            <textarea
                                value={customFeedback}
                                onChange={(e) => setCustomFeedback(e.target.value)}
                                placeholder="직접 작성하기..."
                                className="w-full p-3 border-2 border-gray-200 rounded-xl resize-none h-24 focus:border-green-500 outline-none"
                            />
                            <button
                                onClick={() => handleSendFeedback(customFeedback)}
                                disabled={!customFeedback.trim()}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                                피드백 보내기
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// Member Card Component
function MemberCard({
    member,
    onFeedback,
    isRisk = false,
    isSelected = false,
    onToggleSelect
}: {
    member: TrainerMember;
    onFeedback: () => void;
    isRisk?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isSelected ? 'bg-green-50 border-2 border-green-300' :
            isRisk ? 'bg-white hover:bg-red-50' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
            {/* Checkbox */}
            {onToggleSelect && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                    className="flex-shrink-0"
                >
                    {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                    )}
                </button>
            )}
            {/* Avatar */}
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: LEAGUE_COLORS[member.gamification.league] }}
            >
                {member.name[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{member.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                        Lv.{member.gamification.level}
                    </span>
                    {member.gamification.streak > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {member.gamification.streak}일
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>기록률 {member.weeklyRecordRate}%</span>
                    <span>역추산 {member.reversePlanUsageRate}%</span>
                    {member.daysWithoutRecord > 0 && (
                        <span className={isRisk ? 'text-red-600 font-medium' : ''}>
                            {member.daysWithoutRecord}일 미기록
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onFeedback}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="피드백 보내기"
                >
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
