'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
    const roundedMap = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    return (
        <motion.div
            className={cn(
                'bg-gray-200',
                roundedMap[rounded],
                className
            )}
            style={{ width, height }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
}

export function TextSkeleton({ lines = 1, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={16}
                    className={cn('w-full', i === lines - 1 && 'w-2/3')}
                />
            ))}
        </div>
    );
}

export function AvatarSkeleton({ size = 40 }: { size?: number }) {
    return <Skeleton width={size} height={size} rounded="full" />;
}

export function PostCardSkeleton({ count = 1 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <AvatarSkeleton size={36} />
                        <div className="flex-1">
                            <Skeleton height={14} className="w-24 mb-1" />
                            <Skeleton height={12} className="w-16" />
                        </div>
                    </div>
                    <Skeleton height={18} className="w-3/4 mb-2" />
                    <TextSkeleton lines={2} />
                    <div className="flex gap-4 mt-3">
                        <Skeleton height={14} className="w-12" />
                        <Skeleton height={14} className="w-12" />
                        <Skeleton height={14} className="w-12" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FeedPostSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3 px-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton height={20} className="w-20" rounded="full" />
                        <Skeleton height={12} className="w-16" />
                    </div>
                    <Skeleton height={18} className="w-4/5 mb-2" />
                    <TextSkeleton lines={2} />
                    <div className="flex justify-between mt-3">
                        <Skeleton height={12} className="w-24" />
                        <div className="flex gap-3">
                            <Skeleton height={12} className="w-10" />
                            <Skeleton height={12} className="w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function HotPostCarouselSkeleton() {
    return (
        <div className="flex gap-3 px-4 pb-2 overflow-hidden">
            {[1, 2].map(i => (
                <div key={i} className="min-w-[280px] bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton height={20} className="w-14" rounded="full" />
                        <Skeleton height={12} className="w-20" />
                    </div>
                    <Skeleton height={18} className="w-full mb-2" />
                    <Skeleton height={16} className="w-2/3 mb-3" />
                    <div className="flex gap-3">
                        <Skeleton height={12} className="w-12" />
                        <Skeleton height={12} className="w-10" />
                        <Skeleton height={12} className="w-10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CommentSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <AvatarSkeleton size={32} />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Skeleton height={14} className="w-20" />
                            <Skeleton height={12} className="w-16" />
                        </div>
                        <TextSkeleton lines={2} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProfileHeaderSkeleton() {
    return (
        <div className="bg-white p-6">
            <div className="flex items-center gap-4 mb-4">
                <AvatarSkeleton size={80} />
                <div className="flex-1">
                    <Skeleton height={24} className="w-32 mb-2" />
                    <Skeleton height={14} className="w-48 mb-1" />
                    <Skeleton height={14} className="w-24" />
                </div>
            </div>
            <div className="flex justify-around py-4 border-t border-gray-100">
                {[1, 2, 3].map(i => (
                    <div key={i} className="text-center">
                        <Skeleton height={24} className="w-12 mx-auto mb-1" />
                        <Skeleton height={12} className="w-16 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ToolsHubSkeleton() {
    return (
        <div className="px-4 space-y-4">
            <div className="flex gap-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 bg-white rounded-xl p-3 border border-gray-100 text-center">
                        <Skeleton height={32} className="w-8 mx-auto mb-2" />
                        <Skeleton height={12} className="w-16 mx-auto" />
                    </div>
                ))}
            </div>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Skeleton width={48} height={48} rounded="xl" />
                        <div className="flex-1">
                            <Skeleton height={16} className="w-32 mb-2" />
                            <Skeleton height={14} className="w-48" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
