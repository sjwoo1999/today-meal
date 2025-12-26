'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Eye, Heart, MessageSquare } from 'lucide-react';
import { CommunityPost, BOARD_LIST } from '@/types';
import { MOCK_POSTS } from '@/data';
import { PostCardSkeleton } from '@/components/common/Skeleton';
import { NoMyScraps } from '@/components/common/EmptyState';

interface MyScrapsProps {
    userId: string;
    onPostClick?: (post: CommunityPost) => void;
}

export default function MyScraps({ userId, onPostClick }: MyScrapsProps) {
    const [scraps, setScraps] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            // 시뮬레이션: 스크랩한 게시글 (임의로 몇 개 선택)
            const scrapedPosts = MOCK_POSTS.filter(post =>
                post.scrapCount > 50 && post.authorId !== userId
            ).slice(0, 5);
            setScraps(scrapedPosts);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [userId]);

    const handleUnscrap = (e: React.MouseEvent, postId: string) => {
        e.stopPropagation(); // 상위 클릭 이벤트 방지
        setScraps(prev => prev.filter(post => post.id !== postId));
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <PostCardSkeleton count={3} />
            </div>
        );
    }

    if (scraps.length === 0) {
        return <NoMyScraps onExplore={() => { }} />;
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
            {scraps.map(post => {
                const boardInfo = BOARD_LIST.find(b => b.id === post.boardId);

                return (
                    <motion.div
                        key={post.id}
                        className="bg-white p-4 cursor-pointer"
                        whileHover={{ backgroundColor: '#fafafa' }}
                        onClick={() => onPostClick?.(post)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm">{boardInfo?.emoji}</span>
                                    <span className="text-xs text-gray-500">{boardInfo?.name}</span>
                                    <span className="text-xs text-gray-400">·</span>
                                    <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-1 mb-2">{post.content}</p>
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
                            </div>
                            <motion.button
                                onClick={(e) => handleUnscrap(e, post.id)}
                                className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                                whileTap={{ scale: 0.9 }}
                            >
                                <Bookmark className="w-5 h-5 fill-current" />
                            </motion.button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
