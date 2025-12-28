'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { CommunityComment, CommunityPost } from '@/types';
import { getCommentsByUserId, getPostById } from '@/data';
import { CommentSkeleton } from '@/components/common/Skeleton';
import { NoMyComments } from '@/components/common/EmptyState';

interface MyCommentsProps {
    userId: string;
    onPostClick?: (post: CommunityPost) => void;
}

export default function MyComments({ userId, onPostClick }: MyCommentsProps) {
    const [comments, setComments] = useState<(CommunityComment & { postTitle?: string; post?: CommunityPost })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const userComments = getCommentsByUserId(userId);
            // 원글 정보 추가
            const enrichedComments = userComments.map(comment => {
                const post = getPostById(comment.postId);
                return {
                    ...comment,
                    postTitle: post?.title || '삭제된 게시글',
                    post,
                };
            });
            setComments(enrichedComments);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [userId]);

    const handleCommentClick = (comment: typeof comments[0]) => {
        if (comment.post && onPostClick) {
            onPostClick(comment.post);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <CommentSkeleton count={5} />
            </div>
        );
    }

    if (comments.length === 0) {
        return <NoMyComments onExplore={() => { }} />;
    }

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return '방금';
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <div className="divide-y divide-gray-100">
            {comments.map(comment => (
                <motion.div
                    key={comment.id}
                    className="bg-white p-4 cursor-pointer"
                    whileHover={{ backgroundColor: '#fafafa' }}
                    onClick={() => handleCommentClick(comment)}
                >
                    {/* 원글 정보 */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <span className="line-clamp-1 flex-1">{comment.postTitle}</span>
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    </div>

                    {/* 댓글 내용 */}
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2">{comment.content}</p>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(comment.createdAt)}</span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {comment.likeCount}
                        </span>
                        {comment.isBest && (
                            <span className="px-1.5 py-0.5 bg-coral-100 text-coral-600 rounded text-[10px]">BEST</span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
