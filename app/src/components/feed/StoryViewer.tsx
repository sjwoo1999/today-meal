'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Utensils, Leaf, Heart } from 'lucide-react';
import type { Story } from '@/data/mockStories';
import { formatTimeAgo } from '@/data/mockStories';

interface StoryViewerProps {
    story: Story;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const STORY_DURATION = 5000; // 5 seconds per story

export default function StoryViewer({
    story,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}: StoryViewerProps) {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    onNext();
                    return 0;
                }
                return prev + (100 / (STORY_DURATION / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isPaused, onNext, story.id]);

    // Reset progress when story changes
    useEffect(() => {
        setProgress(0);
    }, [story.id]);

    const handleReaction = (type: 'yummy' | 'healthy' | 'support') => {
        setUserReactions(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleTapArea = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width / 3 && hasPrev) {
            onPrev();
        } else if (x > (width * 2) / 3 && hasNext) {
            onNext();
        }
    };

    const getMealTypeLabel = (type: Story['mealType']) => {
        switch (type) {
            case 'breakfast': return '아침';
            case 'lunch': return '점심';
            case 'dinner': return '저녁';
            case 'snack': return '간식';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-lg">
                            {story.userName.slice(0, 1)}
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">{story.userName}</p>
                            <p className="text-white/70 text-xs">
                                {formatTimeAgo(story.createdAt)} · {getMealTypeLabel(story.mealType)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Story Content - Tap areas */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={handleTapArea}
                >
                    {/* Mock image placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                            <p className="text-6xl mb-4">🍽️</p>
                            <p className="text-xl font-semibold">{story.caption}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation hints */}
                {hasPrev && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                        <ChevronLeft className="w-8 h-8 text-white/50" />
                    </div>
                )}
                {hasNext && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                        <ChevronRight className="w-8 h-8 text-white/50" />
                    </div>
                )}

                {/* Bottom Reactions */}
                <div className="absolute bottom-8 left-0 right-0 z-10 px-4">
                    <div className="flex items-center justify-center gap-4">
                        <ReactionButton
                            icon={<Utensils className="w-5 h-5" />}
                            count={story.reactions.yummy + (userReactions.yummy ? 1 : 0)}
                            active={userReactions.yummy}
                            color="green"
                            onClick={() => handleReaction('yummy')}
                        />
                        <ReactionButton
                            icon={<Leaf className="w-5 h-5" />}
                            count={story.reactions.healthy + (userReactions.healthy ? 1 : 0)}
                            active={userReactions.healthy}
                            color="blue"
                            onClick={() => handleReaction('healthy')}
                        />
                        <ReactionButton
                            icon={<Heart className="w-5 h-5" />}
                            count={story.reactions.support + (userReactions.support ? 1 : 0)}
                            active={userReactions.support}
                            color="amber"
                            onClick={() => handleReaction('support')}
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

interface ReactionButtonProps {
    icon: React.ReactNode;
    count: number;
    active: boolean;
    color: 'green' | 'blue' | 'amber';
    onClick: () => void;
}

function ReactionButton({ icon, count, active, color, onClick }: ReactionButtonProps) {
    const colorClasses = {
        green: active ? 'bg-green-500 text-white' : 'bg-white/20 text-white',
        blue: active ? 'bg-blue-500 text-white' : 'bg-white/20 text-white',
        amber: active ? 'bg-amber-500 text-white' : 'bg-white/20 text-white',
    };

    return (
        <motion.button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            whileTap={{ scale: 0.9 }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-colors ${colorClasses[color]}`}
        >
            {icon}
            <span className="text-xs font-medium">{count}</span>
        </motion.button>
    );
}
