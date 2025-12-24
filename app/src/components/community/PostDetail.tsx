'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Share2, Heart, MessageSquare, Bookmark,
    MoreHorizontal, Send, Flame, CheckCircle, ChevronDown
} from 'lucide-react';
import { CommunityPost, Comment, BOARD_LIST } from '@/types';
import AdBanner from './AdBanner';

// Mock 댓글 데이터 (각 게시글별)
const MOCK_COMMENTS: Comment[] = [
    // Post 1: 회식 관련
    {
        id: 'c1',
        postId: '1',
        authorId: 'u10',
        authorName: '헬스인',
        authorLevel: 6,
        content: '역추산 다시 돌려봐 저녁 삼겹살로\n아침점심 더 가볍게 하면 되지 않음?',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        likeCount: 12,
        isAuthor: false,
    },
    {
        id: 'c2',
        postId: '1',
        parentId: 'c1',
        authorId: 'u1',
        authorName: 'ㅇㅇ',
        authorLevel: 4,
        content: '오 그 생각을 못했네 ㄱㅅㄱㅅ',
        createdAt: new Date(Date.now() - 4 * 60 * 1000),
        likeCount: 3,
        isAuthor: true,
    },
    {
        id: 'c3',
        postId: '1',
        authorId: 'u11',
        authorName: '다이어터',
        authorLevel: 3,
        content: '회식은 그냥 즐기는 거임 ㅋㅋ\n어차피 한 번 먹는다고 안 쪄',
        createdAt: new Date(Date.now() - 3 * 60 * 1000),
        likeCount: 8,
        isAuthor: false,
    },
    {
        id: 'c4',
        postId: '1',
        authorId: 'u12',
        authorName: 'PT받는중',
        authorLevel: 5,
        content: '삼겹살만 먹고 밥 안 먹으면 생각보다 괜찮음\n쌈 싸먹으면 탄수화물도 적고',
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        likeCount: 15,
        isAuthor: false,
    },

    // Post 2: 점심 고민
    {
        id: 'c5',
        postId: '2',
        authorId: 'u20',
        authorName: '샐러드러버',
        authorLevel: 4,
        content: '샐러드 어때? 서브웨이 추천',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        likeCount: 5,
        isAuthor: false,
    },
    {
        id: 'c6',
        postId: '2',
        authorId: 'u21',
        authorName: '편의점단백질',
        authorLevel: 3,
        content: '편의점 닭가슴살 도시락 ㄱ',
        createdAt: new Date(Date.now() - 8 * 60 * 1000),
        likeCount: 3,
        isAuthor: false,
    },

    // Post 3: 편의점 단백질 조합
    {
        id: 'c7',
        postId: '3',
        authorId: 'u30',
        authorName: '근손실방지',
        authorLevel: 7,
        content: '와 이거 진짜 꿀정보다 저장합니다',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likeCount: 45,
        isAuthor: false,
    },
    {
        id: 'c8',
        postId: '3',
        authorId: 'u31',
        authorName: '다이어트초보',
        authorLevel: 2,
        content: '혹시 GS25도 정리해주실 수 있나요? ㅠㅠ',
        createdAt: new Date(Date.now() - 50 * 60 * 1000),
        likeCount: 22,
        isAuthor: false,
    },
    {
        id: 'c9',
        postId: '3',
        parentId: 'c8',
        authorId: 'u3',
        authorName: '영양덕후',
        authorLevel: 8,
        content: '다음 글에 올릴게요! 기대해주세요 ㅎㅎ',
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        likeCount: 18,
        isAuthor: true,
    },
    {
        id: 'c10',
        postId: '3',
        authorId: 'u32',
        authorName: '헬창지망생',
        authorLevel: 5,
        content: '프로틴 바 + 두유 조합이 진짜 갓임',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        likeCount: 31,
        isAuthor: false,
    },

    // Post 4: Q&A 저녁 탄수화물
    {
        id: 'c11',
        postId: '4',
        authorId: 'u40',
        authorName: '트레이너김',
        authorLevel: 9,
        content: '결론부터 말하면 타이밍보다 총량이 중요합니다.\n저녁에 먹든 아침에 먹든 하루 총 섭취량이 같으면 결과도 같아요.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likeCount: 89,
        isAuthor: false,
        isAccepted: true,
    },
    {
        id: 'c12',
        postId: '4',
        parentId: 'c11',
        authorId: 'u4',
        authorName: '다이어트초보',
        authorLevel: 2,
        content: '와 진짜요? 그동안 저녁에 밥 안 먹느라 힘들었는데...',
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likeCount: 12,
        isAuthor: true,
    },

    // Post 5: 3개월 -12kg 성공
    {
        id: 'c13',
        postId: '5',
        authorId: 'u50',
        authorName: '나도할수있다',
        authorLevel: 3,
        content: '와 대박... 어떻게 하신 거예요? 식단 좀 공유해주세요 ㅠㅠ',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likeCount: 34,
        isAuthor: false,
    },
    {
        id: 'c14',
        postId: '5',
        authorId: 'u51',
        authorName: '만년다이어터',
        authorLevel: 4,
        content: '진짜 축하드려요!! 저도 동기부여 받고 갑니다 💪',
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        likeCount: 28,
        isAuthor: false,
    },
    {
        id: 'c15',
        postId: '5',
        parentId: 'c13',
        authorId: 'u5',
        authorName: '드디어성공',
        authorLevel: 5,
        content: '역추산 플래너 진짜 많이 썼어요!\n아침: 그릭요거트+과일\n점심: 회사 구내식당 (밥 반만)\n저녁: 닭가슴살+샐러드\n이렇게 3개월 했어요!',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likeCount: 156,
        isAuthor: true,
    },
    {
        id: 'c16',
        postId: '5',
        authorId: 'u52',
        authorName: '오운완',
        authorLevel: 6,
        content: '운동은 어떻게 하셨나요?',
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        likeCount: 19,
        isAuthor: false,
    },
];

interface PostDetailProps {
    post: CommunityPost;
    onBack: () => void;
}

export default function PostDetail({ post, onBack }: PostDetailProps) {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);

    const boardInfo = BOARD_LIST.find(b => b.id === post.boardId);
    const comments = MOCK_COMMENTS.filter(c => c.postId === post.id);
    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    const handleLike = () => {
        setLiked(!liked);
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
    };

    const handleSubmitComment = () => {
        if (!commentText.trim()) return;
        // TODO: 댓글 등록 API 호출
        alert(`댓글 등록: ${commentText}`);
        setCommentText('');
    };

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
        <div className="min-h-screen bg-white pb-20">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <span className="font-medium text-gray-900">
                        {boardInfo?.emoji} {boardInfo?.name || '게시글'}
                    </span>
                    <button className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
                        <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* 글 내용 */}
            <div className="px-4 py-4">
                {/* 제목 & 뱃지 */}
                <div className="flex items-start gap-2 mb-3">
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
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>

                {/* 작성자 정보 */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🍚</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{post.authorName}</span>
                            <span className="text-xs text-gray-500">Lv.{post.authorLevel} {post.authorTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {post.authorStreak && (
                                <span className="flex items-center gap-1 text-orange-500">
                                    <Flame className="w-3 h-3" />
                                    {post.authorStreak}일 스트릭
                                </span>
                            )}
                            <span>{formatTime(post.createdAt)}</span>
                            <span>조회 {post.viewCount.toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {post.content}
                </div>

                {/* 해시태그 */}
                {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.hashtags.map((tag, i) => (
                            <span key={i} className="text-primary-500 text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* 액션 바 */}
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                    <motion.button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors
                            ${liked ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likeCount + (liked ? 1 : 0)}</span>
                    </motion.button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.commentCount}</span>
                    </button>
                    <motion.button
                        onClick={handleBookmark}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors
                            ${bookmarked ? 'bg-yellow-50 text-yellow-500' : 'text-gray-500 hover:bg-gray-100'}`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 광고 (댓글 섹션 전) */}
            <div className="px-4 pb-2">
                <AdBanner size="card" position="detail-middle" />
            </div>

            {/* 댓글 섹션 */}
            <div className="px-4 py-4">
                <h2 className="font-bold text-gray-900 mb-4">
                    💬 댓글 {comments.length}
                </h2>

                <div className="space-y-4">
                    {displayedComments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`${comment.parentId ? 'ml-8' : ''}`}
                        >
                            <div className={`p-3 rounded-xl ${comment.isAuthor
                                ? 'bg-primary-50 border border-primary-100'
                                : 'bg-gray-50'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-medium ${comment.isAuthor ? 'text-primary-600' : 'text-gray-900'}`}>
                                        {comment.authorName}
                                        {comment.isAuthor && <span className="text-xs ml-1">(글쓴이)</span>}
                                    </span>
                                    <span className="text-xs text-gray-500">Lv.{comment.authorLevel}</span>
                                </div>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap mb-2">
                                    {comment.content}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{formatTime(comment.createdAt)}</span>
                                    <button className="flex items-center gap-1 hover:text-red-500">
                                        <Heart className="w-3.5 h-3.5" />
                                        {comment.likeCount}
                                    </button>
                                    <button className="hover:text-primary-500">답글</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {comments.length > 3 && !showAllComments && (
                    <button
                        onClick={() => setShowAllComments(true)}
                        className="w-full mt-4 py-3 text-sm text-gray-500 flex items-center justify-center gap-1 hover:text-gray-700"
                    >
                        댓글 더보기 ({comments.length - 3}개)
                        <ChevronDown className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* 댓글 입력 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <motion.button
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                            ${commentText.trim()
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
