'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import { CommunityPost, BOARD_LIST } from '@/types';
import { getPostsByUser } from '@/data';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { NoMyPosts } from '@/components/common/EmptyState';

interface MyPostsProps {
    userId: string;
    onPostClick?: (post: CommunityPost) => void;
}

export default function MyPosts({ userId, onPostClick }: MyPostsProps) {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const userPosts = getPostsByUser(userId);
            setPosts(userPosts);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [userId]);

    if (isLoading) {
        return (
            <div className="p-4">
                <PostCardSkeleton count={3} />
            </div>
        );
    }

    if (posts.length === 0) {
        return <NoMyPosts onWrite={() => { }} />;
    }

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return '오늘';
        if (days === 1) return '어제';
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <div className="divide-y divide-gray-100">
            {posts.map(post => {
                const boardInfo = BOARD_LIST.find(b => b.id === post.boardId);

                return (
                    <motion.div
                        key={post.id}
                        className="bg-white p-4 cursor-pointer"
                        whileHover={{ backgroundColor: '#fafafa' }}
                        onClick={() => onPostClick?.(post)}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{boardInfo?.emoji}</span>
                            <span className="text-xs text-gray-500">{boardInfo?.name}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                            {post.isHot && (
                                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">HOT</span>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" /> {post.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" /> {post.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> {post.commentCount}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
