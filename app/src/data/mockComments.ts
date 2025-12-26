// Mock Comments Data - 40개+ 댓글
import { CommunityComment } from '@/types';

export const MOCK_COMMENTS: CommunityComment[] = [
    // p_001 댓글 (회식 고민)
    {
        id: 'c_001',
        postId: 'p_001',
        content: '아 ㅋㅋ 저도 오늘 회식인데 공감... 점심에 샐러드 먹고 버티는 중',
        authorId: 'u_007',
        authorName: '직장인다이어터',
        authorLevel: 4,
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likeCount: 12,
        isAuthor: false,
    },
    {
        id: 'c_002',
        postId: 'p_001',
        content: '역추산 돌려보면 삼겹살 2인분 정도는 괜찮지 않을까요? 저는 그렇게 하고 있어요',
        authorId: 'u_002',
        authorName: '만년다이어터',
        authorLevel: 6,
        createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
        likeCount: 34,
        isAuthor: false,
        isBest: true,
    },
    {
        id: 'c_003',
        postId: 'p_001',
        content: '쌈 많이 싸먹으세요! 상추로 배 채우면 고기 덜 먹게 됨',
        authorId: 'u_008',
        authorName: '샐러드매니아',
        authorLevel: 6,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likeCount: 23,
        isAuthor: false,
    },

    // p_002 댓글 (역추산 후기)
    {
        id: 'c_004',
        postId: 'p_002',
        content: '오 저도 이거 보고 시작했는데 진짜 좋아요! 박탈감이 없어서 지속 가능함',
        authorId: 'u_001',
        authorName: '헬스초보탈출',
        authorLevel: 4,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likeCount: 45,
        isAuthor: false,
    },
    {
        id: 'c_005',
        postId: 'p_002',
        content: '한 달 써보니까 몸이 알아서 조절되는 느낌? 신기함',
        authorId: 'u_005',
        authorName: 'PT받는중',
        authorLevel: 7,
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        likeCount: 67,
        isAuthor: false,
        isBest: true,
    },
    {
        id: 'c_006',
        postId: 'p_002',
        content: '작성자님 비포애프터 있으신가요? 궁금해요!',
        authorId: 'u_010',
        authorName: '헬린이탈출기',
        authorLevel: 2,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likeCount: 8,
        isAuthor: false,
    },

    // p_004 댓글 (-12kg 달성)
    {
        id: 'c_007',
        postId: 'p_004',
        content: '와 대박... 진짜 멋있어요 👏👏 저도 할 수 있겠죠?',
        authorId: 'u_009',
        authorName: '치팅데이중독',
        authorLevel: 3,
        createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
        likeCount: 56,
        isAuthor: false,
    },
    {
        id: 'c_008',
        postId: 'p_004',
        content: '3개월이면 진짜 빠른 편인데 운동도 하셨나요?',
        authorId: 'u_006',
        authorName: '프로틴덕후',
        authorLevel: 5,
        createdAt: new Date(Date.now() - 10.5 * 60 * 60 * 1000),
        likeCount: 23,
        isAuthor: false,
    },
    {
        id: 'c_009',
        postId: 'p_004',
        content: '네 PT 받으면서 주 3회 웨이트 했어요! 식단이 진짜 80%인듯',
        authorId: 'u_005',
        authorName: 'PT받는중',
        authorLevel: 7,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        likeCount: 89,
        isAuthor: true,
        isBest: true,
    },
    {
        id: 'c_010',
        postId: 'p_004',
        content: '역추산 진짜 사기템이네요... 저도 시작해봐야겠다',
        authorId: 'u_003',
        authorName: '삼겹살은진리',
        authorLevel: 3,
        createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
        likeCount: 34,
        isAuthor: false,
    },

    // p_006 댓글 (편의점 조합)
    {
        id: 'c_011',
        postId: 'p_006',
        content: '이거 저장 필수!! 매일 편의점 가는데 넘 유용해요',
        authorId: 'u_004',
        authorName: '야근러의식단',
        authorLevel: 5,
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
        likeCount: 123,
        isAuthor: false,
        isBest: true,
    },
    {
        id: 'c_012',
        postId: 'p_006',
        content: 'CU 닭가슴살 샐러드 + 단백질 음료 조합 최고입니다',
        authorId: 'u_002',
        authorName: '만년다이어터',
        authorLevel: 6,
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
        likeCount: 67,
        isAuthor: false,
    },
    {
        id: 'c_013',
        postId: 'p_006',
        content: '세븐 버팔로윙 진심 맛있는데 칼로리가... ㅠㅠ',
        authorId: 'u_003',
        authorName: '삼겹살은진리',
        authorLevel: 3,
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
        likeCount: 45,
        isAuthor: false,
    },

    // p_009 댓글 (탄수화물 질문)
    {
        id: 'c_014',
        postId: 'p_009',
        content: '결론부터 말하면 상관없어요! 총 칼로리가 더 중요합니다',
        authorId: 'u_005',
        authorName: 'PT받는중',
        authorLevel: 7,
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        likeCount: 78,
        isAuthor: false,
        isBest: true,
    },
    {
        id: 'c_015',
        postId: 'p_009',
        content: '저도 저녁에만 밥 먹는데 살 안 쪄요! 맘 편히 드세요',
        authorId: 'u_007',
        authorName: '직장인다이어터',
        authorLevel: 4,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likeCount: 34,
        isAuthor: false,
    },
    {
        id: 'c_016',
        postId: 'p_009',
        content: '밤에 먹으면 살찐다는 건 미신이에요 ㅋㅋ 열량이 다임',
        authorId: 'u_002',
        authorName: '만년다이어터',
        authorLevel: 6,
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        likeCount: 56,
        isAuthor: false,
    },

    // p_012 댓글 (식단 인증)
    {
        id: 'c_017',
        postId: 'p_012',
        content: '연어 스테이크 맛있겠다 ㅠㅠ 부러워요',
        authorId: 'u_009',
        authorName: '치팅데이중독',
        authorLevel: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likeCount: 12,
        isAuthor: false,
    },
    {
        id: 'c_018',
        postId: 'p_012',
        content: '완벽한 식단이네요! 단백질 얼마나 나오나요?',
        authorId: 'u_006',
        authorName: '프로틴덕후',
        authorLevel: 5,
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likeCount: 8,
        isAuthor: false,
    },

    // 추가 댓글들
    {
        id: 'c_019',
        postId: 'p_003',
        content: '치팅데이 다음날은 원래 그래요... 하루 지나면 괜찮아져요!',
        authorId: 'u_002',
        authorName: '만년다이어터',
        authorLevel: 6,
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
        likeCount: 45,
        isAuthor: false,
        isBest: true,
    },
    {
        id: 'c_020',
        postId: 'p_003',
        content: '저도 어제 치팅하고 오늘 우울했는데 댓글보고 힘나요 ㅠㅠ',
        authorId: 'u_010',
        authorName: '헬린이탈출기',
        authorLevel: 2,
        createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
        likeCount: 23,
        isAuthor: false,
    },
];

// 헬퍼 함수들
export function getCommentsByPostId(postId: string): CommunityComment[] {
    return MOCK_COMMENTS.filter(comment => comment.postId === postId);
}

export function getCommentsByUserId(userId: string): CommunityComment[] {
    return MOCK_COMMENTS.filter(comment => comment.authorId === userId);
}

export function getBestComment(postId: string): CommunityComment | undefined {
    return MOCK_COMMENTS.find(comment => comment.postId === postId && comment.isBest);
}

export function getCommentCount(postId: string): number {
    return MOCK_COMMENTS.filter(comment => comment.postId === postId).length;
}
