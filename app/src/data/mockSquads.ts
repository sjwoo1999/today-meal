import type { Squad, SquadMember, Challenge, ChallengeParticipant, ChallengeVerification } from '@/types';

// Squad Category Types
export type SquadCategory = 'diet' | 'muscle' | 'healthy' | 'local' | 'challenge';

export const SQUAD_CATEGORIES: { id: SquadCategory; name: string; emoji: string }[] = [
    { id: 'diet', name: '다이어트', emoji: '🏃' },
    { id: 'muscle', name: '근육증가', emoji: '💪' },
    { id: 'healthy', name: '건강식단', emoji: '🥗' },
    { id: 'local', name: '지역모임', emoji: '📍' },
    { id: 'challenge', name: '챌린지', emoji: '🎯' },
];

// Mock Squads (12개 - 다양한 카테고리)
export const mockSquads: Squad[] = [
    {
        id: 'squad_1',
        name: '건대 헬스 다이어터',
        description: '건대 주변에서 함께 운동하고 건강하게 먹어요! 매주 식단 챌린지 진행 중 🏋️',
        imageUrl: '/images/squads/gym.jpg',
        memberCount: 47,
        maxMembers: 50,
        isPrivate: false,
        activeChallenges: 2,
        ownerId: 'user_2',
        ownerName: '피트니스마스터',
        tags: ['운동', '다이어트', '건대'],
        createdAt: new Date('2024-08-15'),
        weeklyXP: 12500,
        category: 'local' as SquadCategory,
    },
    {
        id: 'squad_2',
        name: '직장인 점심 기록단',
        description: '바쁜 직장인들끼리 점심 식단 공유해요. 건강한 한끼 실천! 🍱',
        imageUrl: '/images/squads/office.jpg',
        memberCount: 128,
        maxMembers: 150,
        isPrivate: false,
        activeChallenges: 1,
        ownerId: 'user_3',
        ownerName: '헬시오피스',
        tags: ['직장인', '점심', '다이어트'],
        createdAt: new Date('2024-06-01'),
        weeklyXP: 28400,
        category: 'healthy' as SquadCategory,
    },
    {
        id: 'squad_3',
        name: '고단백 저탄수 클럽',
        description: '키토, 저탄고지 식단을 실천하는 분들! 레시피 공유 환영 🥑',
        imageUrl: '/images/squads/keto.jpg',
        memberCount: 89,
        maxMembers: 100,
        isPrivate: false,
        activeChallenges: 3,
        ownerId: 'user_4',
        ownerName: '케토마스터',
        tags: ['키토', '저탄고지', '고단백'],
        createdAt: new Date('2024-07-20'),
        weeklyXP: 18200,
        category: 'diet' as SquadCategory,
    },
    {
        id: 'squad_4',
        name: '대학생 1일1끼 챌린저',
        description: '바쁜 대학생활 속 하루 한끼라도 건강하게! 🎓',
        imageUrl: '/images/squads/university.jpg',
        memberCount: 234,
        maxMembers: 300,
        isPrivate: false,
        activeChallenges: 2,
        ownerId: 'user_5',
        ownerName: '건강한대학생',
        tags: ['대학생', '학식', '자취생'],
        createdAt: new Date('2024-09-01'),
        weeklyXP: 45600,
        category: 'challenge' as SquadCategory,
    },
    {
        id: 'squad_5',
        name: 'PT 식단 관리반',
        description: 'PT 받으시는 분들 식단 공유! 트레이너 인증 멤버 포함 💪',
        imageUrl: '/images/squads/pt.jpg',
        memberCount: 32,
        maxMembers: 50,
        isPrivate: true,
        activeChallenges: 1,
        ownerId: 'user_6',
        ownerName: '김트레이너',
        tags: ['PT', '개인운동', '식단관리'],
        createdAt: new Date('2024-10-01'),
        weeklyXP: 9800,
        category: 'muscle' as SquadCategory,
    },
    // 추가된 스쿼드들 (7개)
    {
        id: 'squad_6',
        name: '단백질 러버스',
        description: '고단백 식단을 공유하고 근성장을 함께해요! 매일 단백질 100g 도전 🏋️',
        imageUrl: '/images/squads/protein.jpg',
        memberCount: 256,
        maxMembers: 500,
        isPrivate: false,
        activeChallenges: 2,
        ownerId: 'user_7',
        ownerName: '프로틴매니아',
        tags: ['단백질', '근육', '헬스', '벌크업'],
        createdAt: new Date('2024-05-20'),
        weeklyXP: 52300,
        category: 'muscle' as SquadCategory,
    },
    {
        id: 'squad_7',
        name: '30일 아침밥 챌린지',
        description: '아침 거르지 말자! 30일 동안 매일 아침 기록하고 건강해지자 🌅',
        imageUrl: '/images/squads/breakfast.jpg',
        memberCount: 312,
        maxMembers: 500,
        isPrivate: false,
        activeChallenges: 1,
        ownerId: 'user_8',
        ownerName: '모닝버드',
        tags: ['아침식사', '챌린지', '30일', '습관'],
        createdAt: new Date('2024-12-01'),
        weeklyXP: 38700,
        category: 'challenge' as SquadCategory,
    },
    {
        id: 'squad_8',
        name: '야식 끊기 도전',
        description: '밤 9시 이후 야식 NO! 함께 극복하고 건강한 저녁 습관 만들어요 🌙',
        imageUrl: '/images/squads/no-snack.jpg',
        memberCount: 234,
        maxMembers: 400,
        isPrivate: false,
        activeChallenges: 1,
        ownerId: 'user_9',
        ownerName: '야식탈출러',
        tags: ['야식금지', '다이어트', '습관개선'],
        createdAt: new Date('2024-11-20'),
        weeklyXP: 21500,
        category: 'challenge' as SquadCategory,
    },
    {
        id: 'squad_9',
        name: '판교 IT인 식단',
        description: '판교 테크노밸리 직장인들의 건강한 식단 공유! 맛집 정보도 나눠요 💻',
        imageUrl: '/images/squads/pangyo.jpg',
        memberCount: 189,
        maxMembers: 300,
        isPrivate: false,
        activeChallenges: 2,
        ownerId: 'user_10',
        ownerName: '판교헬시먹방',
        tags: ['판교', 'IT', '직장인', '점심'],
        createdAt: new Date('2024-06-15'),
        weeklyXP: 34200,
        category: 'local' as SquadCategory,
    },
    {
        id: 'squad_10',
        name: '클린 이팅 클럽',
        description: '가공식품 없이! 자연식품으로 건강하게 먹어요 🥗',
        imageUrl: '/images/squads/clean.jpg',
        memberCount: 167,
        maxMembers: 300,
        isPrivate: false,
        activeChallenges: 2,
        ownerId: 'user_11',
        ownerName: '클린푸드러버',
        tags: ['클린이팅', '자연식품', '건강'],
        createdAt: new Date('2024-09-15'),
        weeklyXP: 28900,
        category: 'healthy' as SquadCategory,
    },
    {
        id: 'squad_11',
        name: '간헐적 단식 16:8',
        description: '16시간 공복, 8시간 식사! 함께 실천하고 경험 공유해요 ⏰',
        imageUrl: '/images/squads/fasting.jpg',
        memberCount: 423,
        maxMembers: 500,
        isPrivate: false,
        activeChallenges: 3,
        ownerId: 'user_12',
        ownerName: '단식마스터',
        tags: ['간헐적단식', '16:8', '다이어트'],
        createdAt: new Date('2024-05-01'),
        weeklyXP: 67800,
        category: 'diet' as SquadCategory,
    },
    {
        id: 'squad_12',
        name: '채식주의자 모임',
        description: '비건, 락토, 페스코 모두 환영! 채식 레시피와 맛집 공유 🌱',
        imageUrl: '/images/squads/vegan.jpg',
        memberCount: 78,
        maxMembers: 200,
        isPrivate: false,
        activeChallenges: 1,
        ownerId: 'user_13',
        ownerName: '그린라이프',
        tags: ['채식', '비건', '식물성', '환경'],
        createdAt: new Date('2024-07-01'),
        weeklyXP: 12400,
        category: 'healthy' as SquadCategory,
    },
];

// Mock Squad Members
export const mockSquadMembers: Record<string, SquadMember[]> = {
    squad_1: [
        {
            id: 'member_1',
            squadId: 'squad_1',
            userId: 'user_2',
            userName: '피트니스마스터',
            role: 'owner',
            weeklyXP: 850,
            streak: 45,
            joinedAt: new Date('2024-08-15'),
        },
        {
            id: 'member_2',
            squadId: 'squad_1',
            userId: 'user_7',
            userName: '건대헬스러',
            role: 'admin',
            weeklyXP: 720,
            streak: 32,
            joinedAt: new Date('2024-08-20'),
        },
        {
            id: 'member_3',
            squadId: 'squad_1',
            userId: 'user_8',
            userName: '다이어트화이팅',
            role: 'member',
            weeklyXP: 680,
            streak: 28,
            joinedAt: new Date('2024-09-01'),
        },
        {
            id: 'member_4',
            squadId: 'squad_1',
            userId: 'user_9',
            userName: '헬린이탈출',
            role: 'member',
            weeklyXP: 550,
            streak: 14,
            joinedAt: new Date('2024-09-15'),
        },
        {
            id: 'member_5',
            squadId: 'squad_1',
            userId: 'user_10',
            userName: '운동초보',
            role: 'member',
            weeklyXP: 420,
            streak: 7,
            joinedAt: new Date('2024-10-01'),
        },
    ],
};

// Mock Challenges (12개 - 다양한 타입)
export const mockChallenges: Challenge[] = [
    {
        id: 'challenge_1',
        squadId: 'squad_1',
        title: '7일 연속 기록 챌린지',
        description: '7일 동안 매일 식단을 기록해요! 완주하면 특별 배지 지급 🏅',
        type: 'streak',
        goal: 7,
        unit: '일',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-07'),
        status: 'active',
        participants: 35,
        prizes: [
            { rank: 1, reward: '프리미엄 1개월 이용권', points: 500 },
            { rank: 2, reward: '스타벅스 기프티콘', points: 300 },
            { rank: 3, reward: '한끼 포인트 500P', points: 200 },
        ],
    },
    {
        id: 'challenge_2',
        squadId: 'squad_1',
        title: '주간 단백질 챌린지',
        description: '일주일간 매일 단백질 100g 이상 섭취! 💪',
        type: 'protein',
        goal: 100,
        unit: 'g/일',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-07'),
        status: 'active',
        participants: 28,
        prizes: [
            { rank: 1, reward: '프로틴 파우더 1통', points: 400 },
            { rank: 2, reward: '닭가슴살 세트', points: 250 },
            { rank: 3, reward: '한끼 포인트 300P', points: 150 },
        ],
    },
    {
        id: 'challenge_3',
        squadId: 'squad_2',
        title: '점심 1500kcal 이하 챌린지',
        description: '건강한 점심 습관! 점심 1500kcal 이하로 맞춰요 🍱',
        type: 'calorie',
        goal: 1500,
        unit: 'kcal',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-14'),
        status: 'active',
        participants: 85,
    },
    {
        id: 'challenge_4',
        squadId: 'squad_3',
        title: '저탄수 30일 챌린지',
        description: '30일 동안 탄수화물 100g 이하! 키토 식단 도전 🥑',
        type: 'calorie',
        goal: 100,
        unit: 'g 탄수화물',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-30'),
        status: 'active',
        participants: 42,
        prizes: [
            { rank: 1, reward: '아보카도 오일 세트', points: 600 },
            { rank: 2, reward: '저탄수 간식 박스', points: 350 },
            { rank: 3, reward: '한끼 포인트 400P', points: 200 },
        ],
    },
    {
        id: 'challenge_5',
        squadId: 'squad_4',
        title: '30일 매일 기록 챌린지',
        description: '한달 동안 매일 식단을 기록하면 특별 배지! 📝',
        type: 'record',
        goal: 30,
        unit: '회',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-30'),
        status: 'active',
        participants: 156,
    },
    // 추가된 챌린지들 (7개)
    {
        id: 'challenge_6',
        squadId: 'squad_6',
        title: '일일 단백질 150g 달성',
        description: '매일 단백질 150g 이상 섭취하고 근성장 부스트! 💪',
        type: 'protein',
        goal: 150,
        unit: 'g/일',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-14'),
        status: 'active',
        participants: 189,
        prizes: [
            { rank: 1, reward: '프로틴 3종 세트', points: 800 },
            { rank: 2, reward: '닭가슴살 한달치', points: 500 },
            { rank: 3, reward: '한끼 포인트 600P', points: 300 },
        ],
    },
    {
        id: 'challenge_7',
        squadId: 'squad_7',
        title: '30일 아침밥 챌린지',
        description: '30일 동안 아침 식사 기록 완주! 아침형 인간 되기 🌅',
        type: 'streak',
        goal: 30,
        unit: '일',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-30'),
        status: 'active',
        participants: 245,
        prizes: [
            { rank: 1, reward: '프리미엄 3개월 이용권', points: 1000 },
            { rank: 2, reward: '건강식품 세트', points: 600 },
            { rank: 3, reward: '한끼 포인트 800P', points: 400 },
        ],
    },
    {
        id: 'challenge_8',
        squadId: 'squad_8',
        title: '야식 없는 7일',
        description: '밤 9시 이후 음식 섭취 금지 7일 연속 도전! 🌙',
        type: 'streak',
        goal: 7,
        unit: '일',
        startDate: new Date('2025-01-06'),
        endDate: new Date('2025-01-13'),
        status: 'active',
        participants: 178,
        prizes: [
            { rank: 1, reward: '수면 개선 제품 세트', points: 500 },
            { rank: 2, reward: '허브티 세트', points: 300 },
            { rank: 3, reward: '한끼 포인트 400P', points: 200 },
        ],
    },
    {
        id: 'challenge_9',
        squadId: 'squad_10',
        title: '가공식품 없는 일주일',
        description: '7일 동안 가공식품 없이 자연식품만! 클린 이팅 도전 🥗',
        type: 'streak',
        goal: 7,
        unit: '일',
        startDate: new Date('2025-01-06'),
        endDate: new Date('2025-01-13'),
        status: 'active',
        participants: 98,
        prizes: [
            { rank: 1, reward: '유기농 식재료 세트', points: 700 },
            { rank: 2, reward: '친환경 도시락통', points: 400 },
            { rank: 3, reward: '한끼 포인트 500P', points: 250 },
        ],
    },
    {
        id: 'challenge_10',
        squadId: 'squad_11',
        title: '16:8 단식 14일 완주',
        description: '14일 동안 16:8 간헐적 단식 실천하기! ⏰',
        type: 'streak',
        goal: 14,
        unit: '일',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-14'),
        status: 'active',
        participants: 312,
        prizes: [
            { rank: 1, reward: '프리미엄 2개월 이용권', points: 900 },
            { rank: 2, reward: '건강 음료 세트', points: 500 },
            { rank: 3, reward: '한끼 포인트 700P', points: 350 },
        ],
    },
    {
        id: 'challenge_11',
        squadId: 'squad_9',
        title: '판교 맛집 10곳 탐방',
        description: '판교 주변 새로운 건강 맛집 10곳 방문하고 리뷰 남기기! 📍',
        type: 'record',
        goal: 10,
        unit: '곳',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'active',
        participants: 67,
        prizes: [
            { rank: 1, reward: '배달의민족 5만원권', points: 500 },
            { rank: 2, reward: '커피 기프티콘 10장', points: 300 },
            { rank: 3, reward: '한끼 포인트 400P', points: 200 },
        ],
    },
    {
        id: 'challenge_12',
        squadId: 'squad_12',
        title: '채식 레시피 공유 챌린지',
        description: '채식 레시피 10개 공유하고 함께 건강해져요! 🌱',
        type: 'record',
        goal: 10,
        unit: '개',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'active',
        participants: 45,
        prizes: [
            { rank: 1, reward: '비건 레스토랑 식사권', points: 600 },
            { rank: 2, reward: '채식 식재료 박스', points: 350 },
            { rank: 3, reward: '한끼 포인트 450P', points: 225 },
        ],
    },
];

// Mock Challenge Participants (for challenge_1)
export const mockChallengeParticipants: Record<string, ChallengeParticipant[]> = {
    challenge_1: [
        {
            id: 'part_1',
            challengeId: 'challenge_1',
            userId: 'user_7',
            userName: '건대헬스러',
            progress: 6,
            goal: 7,
            rank: 1,
            streak: 6,
            lastVerifiedAt: new Date('2025-01-06'),
        },
        {
            id: 'part_2',
            challengeId: 'challenge_1',
            userId: 'user_8',
            userName: '다이어트화이팅',
            progress: 6,
            goal: 7,
            rank: 2,
            streak: 6,
            lastVerifiedAt: new Date('2025-01-06'),
        },
        {
            id: 'part_3',
            challengeId: 'challenge_1',
            userId: 'user_2',
            userName: '피트니스마스터',
            progress: 5,
            goal: 7,
            rank: 3,
            streak: 5,
            lastVerifiedAt: new Date('2025-01-05'),
        },
        {
            id: 'part_4',
            challengeId: 'challenge_1',
            userId: 'user_9',
            userName: '헬린이탈출',
            progress: 4,
            goal: 7,
            rank: 4,
            streak: 4,
            lastVerifiedAt: new Date('2025-01-04'),
        },
        {
            id: 'part_5',
            challengeId: 'challenge_1',
            userId: 'user_10',
            userName: '운동초보',
            progress: 3,
            goal: 7,
            rank: 5,
            streak: 3,
            lastVerifiedAt: new Date('2025-01-03'),
        },
    ],
};

// Mock Challenge Verifications
export const mockVerifications: ChallengeVerification[] = [
    {
        id: 'verify_1',
        challengeId: 'challenge_1',
        userId: 'user_7',
        userName: '건대헬스러',
        imageUrl: '/images/meals/healthy.jpg',
        caption: '오늘 점심은 닭가슴살 샐러드! 6일차 완료 💪',
        progress: 6,
        reactions: { fire: 12, thumbsUp: 8, heart: 5 },
        verifiedAt: new Date('2025-01-06T12:30:00'),
    },
    {
        id: 'verify_2',
        challengeId: 'challenge_1',
        userId: 'user_8',
        userName: '다이어트화이팅',
        imageUrl: '/images/meals/korean.jpg',
        caption: '건강한 한식 점심! 비빔밥 먹었어요 🍚',
        progress: 6,
        reactions: { fire: 15, thumbsUp: 10, heart: 7 },
        verifiedAt: new Date('2025-01-06T13:00:00'),
    },
    {
        id: 'verify_3',
        challengeId: 'challenge_1',
        userId: 'user_2',
        userName: '피트니스마스터',
        imageUrl: '/images/meals/protein.jpg',
        caption: '운동 후 단백질 보충! 프로틴 쉐이크 🥤',
        progress: 5,
        reactions: { fire: 20, thumbsUp: 15, heart: 10 },
        verifiedAt: new Date('2025-01-05T18:00:00'),
    },
];

// Helper functions
export function getSquadById(id: string): Squad | undefined {
    return mockSquads.find(squad => squad.id === id);
}

export function getChallengesBySquadId(squadId: string): Challenge[] {
    return mockChallenges.filter(challenge => challenge.squadId === squadId);
}

export function getChallengeById(id: string): Challenge | undefined {
    return mockChallenges.find(challenge => challenge.id === id);
}

export function getSquadMembers(squadId: string): SquadMember[] {
    return mockSquadMembers[squadId] || [];
}

export function getChallengeParticipants(challengeId: string): ChallengeParticipant[] {
    return mockChallengeParticipants[challengeId] || [];
}

export function getChallengeVerifications(challengeId: string): ChallengeVerification[] {
    return mockVerifications.filter(v => v.challengeId === challengeId);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMySquads(_userId: string): Squad[] {
    // In real implementation, this would filter by membership
    // For now, return first 2 squads as "my squads"
    return mockSquads.slice(0, 2);
}

export function getRecommendedSquads(): Squad[] {
    // Return squads not joined by user
    return mockSquads.slice(2);
}

export function getActiveChallenges(): Challenge[] {
    return mockChallenges.filter(c => c.status === 'active');
}

// Category-based helper functions
export function getSquadsByCategory(category: SquadCategory): Squad[] {
    return mockSquads.filter(squad => squad.category === category);
}

export function searchSquads(query: string): Squad[] {
    const lowerQuery = query.toLowerCase();
    return mockSquads.filter(squad =>
        squad.name.toLowerCase().includes(lowerQuery) ||
        squad.description.toLowerCase().includes(lowerQuery) ||
        squad.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

export function getPopularSquads(limit: number = 5): Squad[] {
    return [...mockSquads]
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, limit);
}

export function getHotChallenges(limit: number = 5): Challenge[] {
    return [...mockChallenges]
        .filter(c => c.status === 'active')
        .sort((a, b) => b.participants - a.participants)
        .slice(0, limit);
}

export function getChallengesByType(type: Challenge['type']): Challenge[] {
    return mockChallenges.filter(c => c.type === type);
}
