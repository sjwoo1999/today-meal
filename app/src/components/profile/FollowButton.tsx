'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useFollowStore } from '@/store';

interface FollowButtonProps {
    userId: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'outline';
}

export default function FollowButton({ userId, size = 'md', variant = 'primary' }: FollowButtonProps) {
    const { isFollowing, toggleFollow } = useFollowStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const following = isFollowing(userId);

    const handleClick = async () => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        toggleFollow(userId);
        setIsLoading(false);
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-6 py-2 text-base',
    };

    const getButtonStyle = () => {
        if (isLoading) {
            return 'bg-gray-200 text-gray-400 cursor-wait';
        }

        if (following) {
            if (isHovered) {
                return 'bg-red-50 text-red-500 border-red-200';
            }
            return 'bg-white text-gray-700 border-gray-300';
        }

        if (variant === 'outline') {
            return 'bg-white text-green-600 border-green-500 hover:bg-green-50';
        }

        return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
    };

    const getButtonText = () => {
        if (isLoading) return '';
        if (following) {
            return isHovered ? '언팔로우' : '팔로잉';
        }
        return '팔로우';
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]}
                ${getButtonStyle()}
                font-medium rounded-full border transition-all duration-200
                flex items-center justify-center gap-1.5 min-w-[80px]
            `}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                getButtonText()
            )}
        </motion.button>
    );
}
