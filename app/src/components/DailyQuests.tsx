'use client';

import { motion } from 'framer-motion';
import { Check, Target, Sparkles } from 'lucide-react';
import { Quest } from '@/types';

interface QuestCardProps {
    quest: Quest;
    onComplete?: (questId: string) => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
    const isChallenge = quest.type === 'challenge';

    return (
        <motion.div
            className={`card-interactive flex items-center gap-4 ${quest.isCompleted ? 'bg-sage-50 border-sage-200' : ''
                }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: quest.isCompleted ? 1 : 1.02 }}
        >
            {/* Checkbox */}
            <motion.button
                onClick={() => !quest.isCompleted && onComplete?.(quest.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
          ${quest.isCompleted
                        ? 'bg-sage-500 text-white'
                        : isChallenge
                            ? 'bg-coral-100 border-2 border-coral-300 hover:bg-coral-200'
                            : 'bg-gray-100 border-2 border-gray-300 hover:bg-gray-200'
                    }`}
                whileTap={{ scale: 0.9 }}
                disabled={quest.isCompleted}
            >
                {quest.isCompleted ? (
                    <Check className="w-5 h-5" />
                ) : isChallenge ? (
                    <Target className="w-4 h-4 text-coral-500" />
                ) : null}
            </motion.button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {isChallenge && !quest.isCompleted && (
                        <span className="badge bg-coral-100 text-coral-700 text-xs px-2 py-0.5">
                            챌린지
                        </span>
                    )}
                    <h4 className={`font-medium truncate ${quest.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'
                        }`}>
                        {quest.title}
                    </h4>
                </div>
                {quest.description && (
                    <p className="text-sm text-text-secondary truncate">
                        {quest.description}
                    </p>
                )}

                {/* Progress bar if applicable */}
                {quest.progress !== undefined && quest.maxProgress && !quest.isCompleted && (
                    <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-coral-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                            {quest.progress} / {quest.maxProgress}
                        </p>
                    </div>
                )}
            </div>

            {/* XP Reward */}
            <div className={`flex items-center gap-1 text-sm font-semibold shrink-0 ${quest.isCompleted ? 'text-sage-500' : 'text-coral-500'
                }`}>
                {quest.isCompleted ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
                +{quest.xpReward} XP
            </div>
        </motion.div>
    );
}

interface DailyQuestsProps {
    quests: Quest[];
    onQuestComplete?: (questId: string) => void;
}

export default function DailyQuests({ quests, onQuestComplete }: DailyQuestsProps) {
    const completedCount = quests.filter(q => q.isCompleted).length;
    const allComplete = completedCount === quests.length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="text-lg font-bold text-text-primary">오늘의 퀘스트</h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <span className={completedCount > 0 ? 'text-sage-500 font-semibold' : ''}>
                        {completedCount}
                    </span>
                    <span>/</span>
                    <span>{quests.length}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${allComplete
                            ? 'bg-gradient-to-r from-sage-400 to-sage-500'
                            : 'bg-gradient-to-r from-coral-400 to-coral-500'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / quests.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Quest list */}
            <div className="space-y-3">
                {quests.map((quest, index) => (
                    <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <QuestCard quest={quest} onComplete={onQuestComplete} />
                    </motion.div>
                ))}
            </div>

            {/* All complete bonus */}
            {allComplete && (
                <motion.div
                    className="card bg-gradient-to-r from-sage-50 to-sage-100 border-2 border-sage-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center justify-center gap-2 text-sage-700 font-bold">
                        <Sparkles className="w-5 h-5" />
                        <span>전부 클리어! +15 XP 보너스!</span>
                        <Sparkles className="w-5 h-5" />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
