'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Leaf, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

export interface PostReactions {
    yummy: number;
    healthy: number;
    support: number;
}

interface ReactionBarProps {
    reactions: PostReactions;
    commentCount: number;
    onCommentClick?: () => void;
    onShareClick?: () => void;
    compact?: boolean;
}

export default function ReactionBar({
    reactions,
    commentCount,
    onCommentClick,
    onShareClick,
    compact = false,
}: ReactionBarProps) {
    const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const handleReaction = (type: 'yummy' | 'healthy' | 'support') => {
        setUserReactions(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
        setShowReactionPicker(false);
    };

    const totalReactions =
        reactions.yummy +
        reactions.healthy +
        reactions.support +
        Object.values(userReactions).filter(Boolean).length;

    const activeReactionType = Object.entries(userReactions).find(([, active]) => active)?.[0];

    if (compact) {
        return (
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                    {/* Quick Reaction Button */}
                    <div className="relative">
                        <motion.button
                            onHoverStart={() => setShowReactionPicker(true)}
                            onHoverEnd={() => setShowReactionPicker(false)}
                            onClick={() => setShowReactionPicker(!showReactionPicker)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                                activeReactionType
                                    ? 'bg-green-100 text-green-600'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            {activeReactionType === 'yummy' && <Utensils className="w-4 h-4" />}
                            {activeReactionType === 'healthy' && <Leaf className="w-4 h-4" />}
                            {activeReactionType === 'support' && <Heart className="w-4 h-4" />}
                            {!activeReactionType && <Heart className="w-4 h-4" />}
                            <span className="text-sm font-medium">{totalReactions}</span>
                        </motion.button>

                        {/* Reaction Picker Popover */}
                        {showReactionPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-100 p-1 flex gap-1"
                            >
                                <ReactionButton
                                    icon={<Utensils className="w-5 h-5" />}
                                    tooltip="맛있겠어요"
                                    active={userReactions.yummy}
                                    color="green"
                                    onClick={() => handleReaction('yummy')}
                                />
                                <ReactionButton
                                    icon={<Leaf className="w-5 h-5" />}
                                    tooltip="건강해요"
                                    active={userReactions.healthy}
                                    color="blue"
                                    onClick={() => handleReaction('healthy')}
                                />
                                <ReactionButton
                                    icon={<Heart className="w-5 h-5" />}
                                    tooltip="응원해요"
                                    active={userReactions.support}
                                    color="amber"
                                    onClick={() => handleReaction('support')}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Comment Button */}
                    <button
                        onClick={onCommentClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{commentCount}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Share Button */}
                    <button
                        onClick={onShareClick}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    {/* Bookmark Button */}
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-2 rounded-full transition-colors ${
                            isBookmarked
                                ? 'text-amber-500 hover:bg-amber-50'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>
        );
    }

    // Full reaction bar with counts
    return (
        <div className="space-y-3">
            {/* Reaction Summary */}
            {totalReactions > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex -space-x-1">
                        {reactions.yummy > 0 && (
                            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Utensils className="w-3 h-3 text-green-600" />
                            </span>
                        )}
                        {reactions.healthy > 0 && (
                            <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <Leaf className="w-3 h-3 text-blue-600" />
                            </span>
                        )}
                        {reactions.support > 0 && (
                            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <Heart className="w-3 h-3 text-amber-600" />
                            </span>
                        )}
                    </div>
                    <span>{totalReactions}명이 반응했어요</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                    <ReactionButtonLarge
                        icon={<Utensils className="w-5 h-5" />}
                        count={reactions.yummy + (userReactions.yummy ? 1 : 0)}
                        active={userReactions.yummy}
                        color="green"
                        onClick={() => handleReaction('yummy')}
                    />
                    <ReactionButtonLarge
                        icon={<Leaf className="w-5 h-5" />}
                        count={reactions.healthy + (userReactions.healthy ? 1 : 0)}
                        active={userReactions.healthy}
                        color="blue"
                        onClick={() => handleReaction('healthy')}
                    />
                    <ReactionButtonLarge
                        icon={<Heart className="w-5 h-5" />}
                        count={reactions.support + (userReactions.support ? 1 : 0)}
                        active={userReactions.support}
                        color="amber"
                        onClick={() => handleReaction('support')}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onCommentClick}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onShareClick}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-2 rounded-full transition-colors ${
                            isBookmarked
                                ? 'text-amber-500 hover:bg-amber-50'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ReactionButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    active: boolean;
    color: 'green' | 'blue' | 'amber';
    onClick: () => void;
}

function ReactionButton({ icon, tooltip, active, color, onClick }: ReactionButtonProps) {
    const colorClasses = {
        green: active ? 'bg-green-100 text-green-600' : 'hover:bg-green-50 text-gray-500 hover:text-green-600',
        blue: active ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-500 hover:text-blue-600',
        amber: active ? 'bg-amber-100 text-amber-600' : 'hover:bg-amber-50 text-gray-500 hover:text-amber-600',
    };

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-colors ${colorClasses[color]}`}
            title={tooltip}
        >
            {icon}
        </motion.button>
    );
}

interface ReactionButtonLargeProps {
    icon: React.ReactNode;
    count: number;
    active: boolean;
    color: 'green' | 'blue' | 'amber';
    onClick: () => void;
}

function ReactionButtonLarge({ icon, count, active, color, onClick }: ReactionButtonLargeProps) {
    const colorClasses = {
        green: active
            ? 'bg-green-100 text-green-600 border-green-200'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200',
        blue: active
            ? 'bg-blue-100 text-blue-600 border-blue-200'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
        amber: active
            ? 'bg-amber-100 text-amber-600 border-amber-200'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200',
    };

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-sm ${colorClasses[color]}`}
        >
            {icon}
            {count > 0 && <span className="font-medium">{count}</span>}
        </motion.button>
    );
}
