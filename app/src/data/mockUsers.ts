// Mock Users Data - 10명의 사용자
import { SimpleUser } from '@/types';

export const MOCK_USERS: SimpleUser[] = [
    {
        id: 'u_001',
        name: '헬스초보탈출',
        nickname: '헬스초보탈출',
        email: 'health@example.com',
        level: 4,
        xp: 1250,
        streak: 23,
        title: '영양 탐험가',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-09-15'),
    },
    {
        id: 'u_002',
        name: '만년다이어터',
        nickname: '만년다이어터',
        email: 'manyear@example.com',
        level: 6,
        xp: 2800,
        streak: 45,
        title: '헬시 히어로',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-06-20'),
    },
    {
        id: 'u_003',
        name: '삼겹살은진리',
        nickname: '삼겹살은진리',
        email: 'samgyup@example.com',
        level: 3,
        xp: 680,
        streak: 8,
        title: '균형 루키',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-11-01'),
    },
    {
        id: 'u_004',
        name: '야근러의식단',
        nickname: '야근러의식단',
        email: 'yageun@example.com',
        level: 5,
        xp: 1900,
        streak: 31,
        title: '뉴트리션 프로',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-08-10'),
    },
    {
        id: 'u_005',
        name: 'PT받는중',
        nickname: 'PT받는중',
        email: 'ptman@example.com',
        level: 7,
        xp: 3500,
        streak: 67,
        title: '피트니스 마스터',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-04-05'),
    },
    {
        id: 'u_006',
        name: '프로틴덕후',
        nickname: '프로틴덕후',
        email: 'protein@example.com',
        level: 5,
        xp: 1650,
        streak: 28,
        title: '뉴트리션 프로',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-07-22'),
    },
    {
        id: 'u_007',
        name: '직장인다이어터',
        nickname: '직장인다이어터',
        email: 'office@example.com',
        level: 4,
        xp: 1100,
        streak: 15,
        title: '영양 탐험가',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-10-01'),
    },
    {
        id: 'u_008',
        name: '샐러드매니아',
        nickname: '샐러드매니아',
        email: 'salad@example.com',
        level: 6,
        xp: 2400,
        streak: 52,
        title: '헬시 히어로',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-05-15'),
    },
    {
        id: 'u_009',
        name: '치팅데이중독',
        nickname: '치팅데이중독',
        email: 'cheat@example.com',
        level: 3,
        xp: 450,
        streak: 5,
        title: '균형 루키',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-11-20'),
    },
    {
        id: 'u_010',
        name: '헬린이탈출기',
        nickname: '헬린이탈출기',
        email: 'newbie@example.com',
        level: 2,
        xp: 180,
        streak: 3,
        title: '식단 새싹',
        profileImage: undefined,
        role: 'member',
        createdAt: new Date('2024-12-10'),
    },
];

// 헬퍼 함수들
export function getUserById(id: string): SimpleUser | undefined {
    return MOCK_USERS.find(user => user.id === id);
}

export function getUserByNickname(nickname: string): SimpleUser | undefined {
    return MOCK_USERS.find(user => user.nickname === nickname);
}

export function getRandomUser(): SimpleUser {
    return MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
}

export function getCurrentUser(): SimpleUser {
    return MOCK_USERS[0]; // 기본 현재 사용자
}
