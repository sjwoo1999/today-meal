'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Utensils, Scale, Calendar, Trophy, Heart } from 'lucide-react';
import { useHankiAgentStore, useUIStore, usePersonalizationStore, useNutritionStore } from '@/store';
import { HankiSuggestion } from '@/types';

const suggestionIcons: Record<HankiSuggestion['type'], React.ReactNode> = {
    meal_time: <Utensils className="w-5 h-5" />,
    nutrition_balance: <Scale className="w-5 h-5" />,
    schedule_alert: <Calendar className="w-5 h-5" />,
    streak_celebration: <Trophy className="w-5 h-5" />,
    comfort: <Heart className="w-5 h-5" />,
};

const suggestionColors: Record<HankiSuggestion['type'], string> = {
    meal_time: 'from-orange-400 to-orange-500',
    nutrition_balance: 'from-green-400 to-green-500',
    schedule_alert: 'from-purple-400 to-purple-500',
    streak_celebration: 'from-yellow-400 to-yellow-500',
    comfort: 'from-pink-400 to-pink-500',
};

interface HankiProactiveSuggestionProps {
    compact?: boolean;
}

export default function HankiProactiveSuggestion({ compact = false }: HankiProactiveSuggestionProps) {
    const { suggestions, addSuggestion, dismissSuggestion, clearOldSuggestions, isProactiveMode } = useHankiAgentStore();
    const { setActiveTab } = useUIStore();
    const { userContext } = usePersonalizationStore();
    const { todayNutrition } = useNutritionStore();

    // Generate proactive suggestions based on context
    useEffect(() => {
        if (!isProactiveMode) return;

        const checkAndGenerateSuggestions = () => {
            const now = new Date();
            const hour = now.getHours();
            const activeSuggestions = suggestions.filter(s => !s.isDismissed);

            // 점심시간 접근 (11:30 ~ 12:30)
            if (hour >= 11 && hour <= 12 && !activeSuggestions.some(s => s.type === 'meal_time')) {
                addSuggestion({
                    type: 'meal_time',
                    title: '점심 시간이야! 🍚',
                    message: '점심 뭐 먹을지 고민되지? 오늘 플랜대로면 샐러드인데, 추천해줄까?',
                    actions: [
                        { label: '추천 받기', action: 'navigate', target: 'planner' },
                        { label: '직접 선택할래', action: 'dismiss' },
                    ],
                    priority: 'high',
                });
            }

            // 저녁시간 접근 (17:30 ~ 19:00)
            if (hour >= 17 && hour <= 19 && !activeSuggestions.some(s => s.type === 'meal_time')) {
                addSuggestion({
                    type: 'meal_time',
                    title: '저녁 시간! 🌙',
                    message: '오늘 저녁은 뭘 먹을까? 역추산으로 계획해볼까?',
                    actions: [
                        { label: '역추산 시작', action: 'navigate', target: 'planner' },
                        { label: '나중에', action: 'snooze' },
                    ],
                    priority: 'medium',
                });
            }

            // 영양 불균형 감지
            if (todayNutrition && !activeSuggestions.some(s => s.type === 'nutrition_balance')) {
                const proteinRatio = todayNutrition.protein.current / todayNutrition.protein.goal;
                if (proteinRatio < 0.5 && hour >= 12) {
                    addSuggestion({
                        type: 'nutrition_balance',
                        title: '단백질이 부족해! 🥩',
                        message: '오늘 단백질이 좀 부족한 것 같아. 점심에 닭가슴살이나 연어 어때?',
                        actions: [
                            { label: '추천 보기', action: 'navigate', target: 'planner' },
                            { label: '괜찮아', action: 'dismiss' },
                        ],
                        priority: 'medium',
                    });
                }
            }

            // 회식 일정 감지
            const diningEvent = userContext.todaySchedule.find(e => e.isDiningEvent);
            if (diningEvent && !activeSuggestions.some(s => s.type === 'schedule_alert')) {
                addSuggestion({
                    type: 'schedule_alert',
                    title: '오늘 회식이네! 🍻',
                    message: '미리 역추산 해둘까? 점심 가볍게 먹으면 저녁에 여유있어!',
                    actions: [
                        { label: '역추산 시작', action: 'navigate', target: 'planner' },
                        { label: '오늘은 그냥 즐길래', action: 'dismiss' },
                    ],
                    priority: 'high',
                });
            }

            // 피곤한 컨디션 감지
            if (userContext.todayCondition === 'tired' && !activeSuggestions.some(s => s.type === 'comfort')) {
                addSuggestion({
                    type: 'comfort',
                    title: '오늘 좀 힘들어 보여... 💙',
                    message: '가벼운 식사가 좋을 것 같아. 무리하지 말고 맛있는 거 먹자!',
                    actions: [
                        { label: '가벼운 메뉴 보기', action: 'navigate', target: 'planner' },
                        { label: '고마워', action: 'dismiss' },
                    ],
                    priority: 'low',
                });
            }
        };

        // Initial check
        checkAndGenerateSuggestions();

        // Check every 30 minutes
        const interval = setInterval(checkAndGenerateSuggestions, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isProactiveMode, userContext, todayNutrition, addSuggestion, suggestions]);

    // Clear old suggestions periodically
    useEffect(() => {
        const cleanup = setInterval(clearOldSuggestions, 15 * 60 * 1000);
        return () => clearInterval(cleanup);
    }, [clearOldSuggestions]);

    const handleAction = (suggestion: HankiSuggestion, action: HankiSuggestion['actions'][0]) => {
        if (action.action === 'navigate' && action.target) {
            setActiveTab(action.target as 'home' | 'record' | 'planner' | 'profile');
        }
        dismissSuggestion(suggestion.id);
    };

    const activeSuggestions = suggestions.filter(s => !s.isDismissed);
    const currentSuggestion = activeSuggestions.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    })[0];

    if (!currentSuggestion || !isProactiveMode) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${compact ? 'max-w-sm' : 'w-full'
                    }`}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${suggestionColors[currentSuggestion.type]} p-4 text-white relative`}>
                    <button
                        onClick={() => dismissSuggestion(currentSuggestion.id)}
                        className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="닫기"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            {suggestionIcons[currentSuggestion.type]}
                        </div>
                        <div>
                            <h3 className="font-bold">{currentSuggestion.title}</h3>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                        <motion.span
                            className="text-3xl"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🍚
                        </motion.span>
                        <p className="text-gray-700 pt-1">{currentSuggestion.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {currentSuggestion.actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleAction(currentSuggestion, action)}
                                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-1
                                    ${index === 0
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {action.label}
                                {index === 0 && <ChevronRight className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Multiple suggestions indicator */}
                {activeSuggestions.length > 1 && (
                    <div className="px-4 pb-3 flex justify-center">
                        <div className="flex gap-1">
                            {activeSuggestions.slice(0, 3).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
