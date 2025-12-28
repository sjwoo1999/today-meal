'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageSquare, Flame, Eye, Heart, CheckCircle } from 'lucide-react';
import { CommunityPost, BoardCategory, BOARD_LIST, HotTimeFilter, PostSortOption } from '@/types';
import AdBanner from './AdBanner';

// Mock 데이터
const MOCK_POSTS: CommunityPost[] = [
    {
        id: '1',
        boardId: 'free',
        title: '다이어트 중 회식 부르면 어떻게 함?',
        content: '팀장님이 갑자기 오늘 저녁 회식이래...',
        authorId: 'u1',
        authorName: 'ㅇㅇ',
        authorLevel: 4,
        authorTitle: '영양 탐험가',
        authorStreak: 12,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        viewCount: 342,
        likeCount: 23,
        dislikeCount: 1,
        commentCount: 47,
        scrapCount: 8,
        isHot: true,
        isPinned: false,
    },
    {
        id: '2',
        boardId: 'free',
        title: '오늘 점심 뭐 먹을지 진짜 고민됨',
        content: '배고파...',
        authorId: 'u2',
        authorName: '배고파',
        authorLevel: 2,
        authorTitle: '식단 입문자',
        createdAt: new Date(Date.now() - 23 * 60 * 1000),
        viewCount: 89,
        likeCount: 3,
        dislikeCount: 0,
        commentCount: 12,
        scrapCount: 1,
        isHot: false,
        isPinned: false,
    },
    {
        id: '3',
        boardId: 'info',
        title: '편의점 단백질 조합 총정리 (2024년 ver)',
        content: '편의점에서 단백질 30g 이상 채우는 조합 정리했음...',
        authorId: 'u3',
        authorName: '영양덕후',
        authorLevel: 8,
        authorTitle: '식단 챔피언',
        authorStreak: 89,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        viewCount: 12453,
        likeCount: 892,
        dislikeCount: 5,
        commentCount: 234,
        scrapCount: 456,
        isHot: true,
        isPinned: true,
        hashtags: ['편의점', '단백질', '다이어트'],
    },
    {
        id: '4',
        boardId: 'qna',
        title: '저녁에 탄수화물 먹으면 진짜 살 찜?',
        content: '다들 저녁에 탄수화물 안 먹던데...',
        authorId: 'u4',
        authorName: '다이어트초보',
        authorLevel: 2,
        authorTitle: '식단 입문자',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        viewCount: 567,
        likeCount: 34,
        dislikeCount: 0,
        commentCount: 8,
        scrapCount: 12,
        isHot: false,
        isPinned: false,
        isSolved: true,
    },
    {
        id: '5',
        boardId: 'challenge',
        title: '3개월 -12kg 성공했습니다!!',
        content: '드디어 목표 체중 달성...',
        authorId: 'u5',
        authorName: '드디어성공',
        authorLevel: 5,
        authorTitle: '뉴트리션 프로',
        authorStreak: 92,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        viewCount: 5678,
        likeCount: 456,
        dislikeCount: 2,
        commentCount: 234,
        scrapCount: 123,
        isHot: true,
        isPinned: false,
        images: ['before.jpg', 'after.jpg'],
    },
];

// 게시글 카드 컴포넌트
function PostCard({
    post,
    onClick
}: {
    post: CommunityPost;
    onClick: () => void;
}) {
    const timeAgo = getTimeAgo(post.createdAt);
    const boardInfo = BOARD_LIST.find(b => b.id === post.boardId);

    return (
        <motion.div
            onClick={onClick}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    {/* 배지 */}
                    <div className="flex items-center gap-2 mb-1">
                        {post.isPinned && (
                            <span className="px-2 py-0.5 bg-coral-100 text-coral-600 text-xs font-medium rounded">
                                📌 고정
                            </span>
                        )}
                        {post.isHot && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                HOT
                            </span>
                        )}
                        {post.isSolved && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                해결
                            </span>
                        )}
                        {boardInfo && post.boardId !== 'free' && (
                            <span className="text-xs text-gray-500">
                                {boardInfo.emoji} {boardInfo.name}
                            </span>
                        )}
                    </div>

                    {/* 제목 */}
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {post.title}
                    </h3>

                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{post.authorName}</span>
                        <span>Lv.{post.authorLevel}</span>
                        <span>·</span>
                        <span>{timeAgo}</span>
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatNumber(post.viewCount)}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {post.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {post.likeCount}
                        </span>
                    </div>
                </div>

                {/* 썸네일 (이미지가 있는 경우) */}
                {post.images && post.images.length > 0 && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        📷
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// 시간 포맷
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
}

// 숫자 포맷 (1000 -> 1K)
function formatNumber(num: number): string {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

// 탭 버튼
function TabButton({
    active,
    children,
    onClick
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors
                ${active
                    ? 'text-coral-600 border-b-2 border-coral-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            {children}
        </button>
    );
}

interface CommunityMainProps {
    onPostClick?: (post: CommunityPost) => void;
    onWriteClick?: () => void;
}

export default function CommunityMain({ onPostClick, onWriteClick }: CommunityMainProps) {
    const [activeBoard, setActiveBoard] = useState<BoardCategory | 'all'>('all');
    const [hotTimeFilter, setHotTimeFilter] = useState<HotTimeFilter>('realtime');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sortBy, _setSortBy] = useState<PostSortOption>('latest');

    // 게시글 필터링
    const filteredPosts = MOCK_POSTS.filter(post => {
        if (activeBoard === 'all') return true;
        if (activeBoard === 'hot') return post.isHot;
        return post.boardId === activeBoard;
    });

    // 정렬
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return b.likeCount - a.likeCount;
            case 'comments':
                return b.commentCount - a.commentCount;
            case 'views':
                return b.viewCount - a.viewCount;
            default:
                return b.createdAt.getTime() - a.createdAt.getTime();
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-900">🍚 커뮤니티</h1>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* 탭 바 */}
                    <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 gap-1">
                        <TabButton
                            active={activeBoard === 'all'}
                            onClick={() => setActiveBoard('all')}
                        >
                            전체
                        </TabButton>
                        <TabButton
                            active={activeBoard === 'hot'}
                            onClick={() => setActiveBoard('hot')}
                        >
                            🔥 HOT
                        </TabButton>
                        <TabButton
                            active={activeBoard === 'free'}
                            onClick={() => setActiveBoard('free')}
                        >
                            💬 자유
                        </TabButton>
                        <TabButton
                            active={activeBoard === 'info'}
                            onClick={() => setActiveBoard('info')}
                        >
                            🥗 정보
                        </TabButton>
                        <TabButton
                            active={activeBoard === 'qna'}
                            onClick={() => setActiveBoard('qna')}
                        >
                            ❓ Q&A
                        </TabButton>
                        <TabButton
                            active={activeBoard === 'challenge'}
                            onClick={() => setActiveBoard('challenge')}
                        >
                            🎉 인증
                        </TabButton>
                    </div>
                </div>

                {/* HOT 필터 (HOT 탭일 때만) */}
                <AnimatePresence>
                    {activeBoard === 'hot' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex justify-center gap-2 py-2 border-t border-gray-100"
                        >
                            {(['realtime', 'daily', 'weekly'] as HotTimeFilter[]).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setHotTimeFilter(filter)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors
                                        ${hotTimeFilter === filter
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter === 'realtime' ? '실시간' : filter === 'daily' ? '일간' : '주간'}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 게시글 목록 */}
            <div className="p-4 space-y-3">
                {sortedPosts.map((post, index) => (
                    <div key={post.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <PostCard
                                post={post}
                                onClick={() => onPostClick?.(post)}
                            />
                        </motion.div>

                        {/* 3번째 게시글마다 광고 배치 */}
                        {(index + 1) % 3 === 0 && index < sortedPosts.length - 1 && (
                            <div className="my-3">
                                <AdBanner size={index === 2 ? 'banner' : 'native'} position="feed" />
                            </div>
                        )}
                    </div>
                ))}

                {sortedPosts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-4xl mb-4">📭</p>
                        <p>아직 게시글이 없어요</p>
                    </div>
                )}
            </div>

            {/* 글쓰기 FAB */}
            <motion.button
                onClick={onWriteClick}
                className="fixed bottom-24 right-4 w-14 h-14 bg-coral-500 text-white rounded-full shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Plus className="w-6 h-6" />
            </motion.button>
        </div>
    );
}
