'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Story } from '@/data/mockStories';

interface StoryAvatarProps {
    story?: Story;
    isAddStory?: boolean;
    onClick?: () => void;
}

export default function StoryAvatar({ story, isAddStory, onClick }: StoryAvatarProps) {
    if (isAddStory) {
        return (
            <button
                onClick={onClick}
                className="flex flex-col items-center gap-1 min-w-[72px]"
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-gray-500" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                </div>
                <span className="text-xs text-gray-600 font-medium truncate w-16 text-center">
                    내 스토리
                </span>
            </button>
        );
    }

    if (!story) return null;

    const hasUnviewed = !story.viewed;

    return (
        <motion.button
            onClick={onClick}
            className="flex flex-col items-center gap-1 min-w-[72px]"
            whileTap={{ scale: 0.95 }}
        >
            <div className={`relative p-[2px] rounded-full ${
                hasUnviewed
                    ? 'bg-gradient-to-tr from-green-400 via-green-500 to-blue-500'
                    : 'bg-gray-300'
            }`}>
                <div className="w-[60px] h-[60px] rounded-full bg-white p-[2px]">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xl">
                        {story.userName.slice(0, 1)}
                    </div>
                </div>
            </div>
            <span className={`text-xs truncate w-16 text-center ${
                hasUnviewed ? 'font-semibold text-gray-900' : 'text-gray-500'
            }`}>
                {story.userName}
            </span>
        </motion.button>
    );
}
