'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, ChevronRight, MessageSquare, Heart, Eye, Camera, RefreshCw } from 'lucide-react';
import { CommunityPost, BOARD_LIST } from '@/types';
import { useUIStore, useUserStore } from '@/store';
import { UIState } from '@/types/ui';
import PostDetail from '@/components/community/PostDetail';
import { StoryBar } from '@/components/feed';
import {
    FeedStateContainer,
    HotPostCarouselSkeleton,
} from '@/components/common';
import { useViewState } from '@/hooks/useServiceStore';
import { PointDisplay, NotificationBadge } from '@/components/common';
import { usePoints, useNotifications } from '@/hooks/useServiceStore';

// HOT 게시글 Mock 데이터
const HOT_POSTS: CommunityPost[] = [
    {
        id: 'hot1',
        boardId: 'free',
        title: '3개월 만에 -12kg 성공 후기 (사진有)',
        content: '진짜 역추산 플래너 없었으면 못 했을 듯...',
        authorId: 'u5',
        authorName: '드디어성공',
        authorLevel: 5,
        authorTitle: '헬시 히어로',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        viewCount: 2847,
        likeCount: 342,
        dislikeCount: 5,
        commentCount: 89,
        scrapCount: 156,
        isHot: true,
        isPinned: false,
        hashtags: ['다이어트성공', '역추산', '바디프로필'],
    },
    {
        id: 'hot2',
        boardId: 'info',
        title: '편의점 고단백 조합 총정리 (CU/GS25/세븐)',
        content: '제가 다이어트 1년 동안 매일 편의점 다니면서...',
        authorId: 'u3',
        authorName: '영양덕후',
        authorLevel: 8,
        authorTitle: '뉴트리션 프로',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        viewCount: 4521,
        likeCount: 567,
        dislikeCount: 8,
        commentCount: 123,
        scrapCount: 234,
        isHot: true,
        isPinned: false,
        hashtags: ['편의점', '단백질', '꿀조합'],
    },
];

// 최신 게시글 Mock 데이터
const RECENT_POSTS: CommunityPost[] = [
    {
        id: 'r1',
        boardId: 'free',
        title: '다이어트 중 회식 부르면 어떻게 함?',
        content: '오늘 저녁 회식인데 삼겹살집임...',
        authorId: 'u1',
        authorName: '오늘도한끼',
        authorLevel: 4,
        authorTitle: '영양 탐험가',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        viewCount: 156,
        likeCount: 23,
        dislikeCount: 0,
        commentCount: 12,
        scrapCount: 8,
        isHot: false,
        isPinned: false,
        hashtags: ['회식', '삼겹살'],
    },
    {
        id: 'r2',
        boardId: 'qna',
        title: '저녁에 탄수화물 먹으면 진짜 살 더 찜?',
        content: '밤에 밥 먹으면 살찐다는 말이 있는데...',
        authorId: 'u4',
        authorName: '다이어트초보',
        authorLevel: 2,
        authorTitle: '식단 새싹',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        viewCount: 89,
        likeCount: 15,
        dislikeCount: 0,
        commentCount: 8,
        scrapCount: 3,
        isHot: false,
        isPinned: false,
        hashtags: ['질문', '탄수화물'],
    },
    {
        id: 'r3',
        boardId: 'challenge',
        title: '오늘의 식단 인증합니다 💪',
        content: '아침: 그릭요거트, 점심: 샐러드, 저녁: 닭가슴살',
        authorId: 'u6',
        authorName: '만년다이어터',
        authorLevel: 3,
        authorTitle: '균형 루키',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        viewCount: 45,
        likeCount: 28,
        dislikeCount: 0,
        commentCount: 6,
        scrapCount: 5,
        isHot: false,
        isPinned: false,
        hashtags: ['식단인증', '오운완'],
    },
];

// HOT 게시글 카드
function HotPostCard({ post }: { post: CommunityPost }) {
    return (
        <motion.div
            className="min-w-[280px] bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> HOT
                </span>
                <span className="text-xs text-gray-500">
                    {BOARD_LIST.find(b => b.id === post.boardId)?.name}
                </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {post.viewCount.toLocaleString()}
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
}

// 피드 게시글 카드
function FeedPostCard({ post }: { post: CommunityPost }) {
    const boardInfo = BOARD_LIST.find(b => b.id === post.boardId);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}분 전`;
        const hours = Math.floor(diff / 3600000);
        if (hours < 24) return `${hours}시간 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <motion.div
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            whileHover={{ backgroundColor: '#fafafa' }}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{boardInfo?.emoji}</span>
                <span className="text-xs text-gray-500">{boardInfo?.name}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-400">{formatTime(post.createdAt)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{post.authorName}</span>
                    <span className="text-gray-300">·</span>
                    <span>Lv.{post.authorLevel}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {post.commentCount}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function FeedPage() {
    const { setActiveTab } = useUIStore();
    const { user } = useUserStore();
    const { balance, fetchBalance } = usePoints();
    const { unreadCount, fetchUnreadCount } = useNotifications();

    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [hotPosts, setHotPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

    // Calculate view state
    const viewState = useViewState(posts, isLoading, error);

    // Fetch posts (simulated with mock data)
    const loadPosts = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            setPosts(RECENT_POSTS);
            setHotPosts(HOT_POSTS);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('피드를 불러오는데 실패했습니다'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Refresh handler
    const handleRefresh = useCallback(async () => {
        try {
            setIsRefreshing(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setPosts(RECENT_POSTS);
            setHotPosts(HOT_POSTS);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadPosts();
        if (user?.id) {
            fetchBalance(user.id);
            fetchUnreadCount(user.id);
        }
    }, [loadPosts, user?.id, fetchBalance, fetchUnreadCount]);

    // 게시글 클릭 핸들러
    const handlePostClick = (post: CommunityPost) => {
        setSelectedPost(post);
    };

    // 선택된 게시글이 있으면 상세 페이지로
    if (selectedPost) {
        return (
            <PostDetail
                post={selectedPost}
                onBack={() => setSelectedPost(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">🍚 오늘한끼</h1>
                    <div className="flex items-center gap-3">
                        <PointDisplay
                            balance={balance?.available ?? 0}
                            size="sm"
                            onClick={() => setActiveTab('shop' as UIState['activeTab'])}
                        />
                        <NotificationBadge
                            count={unreadCount}
                            size="sm"
                            onClick={() => {/* Open notifications */ }}
                        />
                        {isRefreshing ? (
                            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" data-testid="refresh-button" />
                        ) : (
                            <button onClick={handleRefresh} data-testid="refresh-button">
                                <RefreshCw className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 스토리 바 */}
            <div data-testid="story-bar">
                <StoryBar />
            </div>

            {/* 오늘의 기록 CTA */}
            <div className="px-4 py-3">
                <motion.button
                    onClick={() => setActiveTab('record' as UIState['activeTab'])}
                    className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl p-4 flex items-center justify-between shadow-lg"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    data-testid="record-cta"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">오늘 뭐 먹었어? 📸</p>
                            <p className="text-sm text-green-100">사진 찍으면 자동 분석!</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>

            {/* HOT 게시글 */}
            <div className="px-4 py-2" data-testid="hot-posts">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        지금 뜨는 글
                    </h2>
                    <button className="text-sm text-green-600 flex items-center gap-1">
                        더보기 <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                {isLoading ? (
                    <HotPostCarouselSkeleton />
                ) : (
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                        {hotPosts.map(post => (
                            <div key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer" data-testid="hot-post-card">
                                <HotPostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 최신 피드 */}
            <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        최신 글
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <button className="px-3 py-1 bg-gray-900 text-white rounded-full">전체</button>
                        <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full">구독</button>
                    </div>
                </div>

                <FeedStateContainer
                    state={viewState}
                    onRetry={loadPosts}
                    onExplore={() => setActiveTab('community' as UIState['activeTab'])}
                >
                    <div className="space-y-3">
                        {posts.map(post => (
                            <div key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer" data-testid="feed-post-card">
                                <FeedPostCard post={post} />
                            </div>
                        ))}
                    </div>
                </FeedStateContainer>
            </div>
        </div>
    );
}
