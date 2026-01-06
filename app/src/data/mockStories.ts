export interface Story {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    imageUrl: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    caption?: string;
    createdAt: Date;
    expiresAt: Date;
    viewed: boolean;
    reactions: {
        yummy: number;
        healthy: number;
        support: number;
    };
}

export const mockStories: Story[] = [
    {
        id: 'story_1',
        userId: 'user_2',
        userName: '건강식단러',
        userAvatar: undefined,
        imageUrl: '/images/meals/breakfast-1.jpg',
        mealType: 'breakfast',
        caption: '오늘 아침은 귀리죽으로 시작!',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
        viewed: false,
        reactions: { yummy: 12, healthy: 24, support: 8 },
    },
    {
        id: 'story_2',
        userId: 'user_3',
        userName: '다이어터진',
        userAvatar: undefined,
        imageUrl: '/images/meals/salad-1.jpg',
        mealType: 'lunch',
        caption: '점심은 샐러드로 가볍게',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
        viewed: false,
        reactions: { yummy: 8, healthy: 31, support: 15 },
    },
    {
        id: 'story_3',
        userId: 'user_4',
        userName: '헬스마니아',
        userAvatar: undefined,
        imageUrl: '/images/meals/protein-1.jpg',
        mealType: 'dinner',
        caption: '운동 후 단백질 보충!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
        viewed: true,
        reactions: { yummy: 18, healthy: 42, support: 21 },
    },
    {
        id: 'story_4',
        userId: 'user_5',
        userName: '밸런스식탁',
        userAvatar: undefined,
        imageUrl: '/images/meals/korean-1.jpg',
        mealType: 'dinner',
        caption: '집밥이 최고야',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
        viewed: false,
        reactions: { yummy: 56, healthy: 28, support: 12 },
    },
    {
        id: 'story_5',
        userId: 'user_6',
        userName: '비건라이프',
        userAvatar: undefined,
        imageUrl: '/images/meals/vegan-1.jpg',
        mealType: 'lunch',
        caption: '오늘의 비건 도시락',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000),
        viewed: false,
        reactions: { yummy: 22, healthy: 67, support: 33 },
    },
    {
        id: 'story_6',
        userId: 'user_7',
        userName: '치팅데이',
        userAvatar: undefined,
        imageUrl: '/images/meals/cheat-1.jpg',
        mealType: 'snack',
        caption: '오늘은 치팅데이!',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
        viewed: false,
        reactions: { yummy: 89, healthy: 5, support: 45 },
    },
];

// Helper to get user's own story (for "add story" feature)
export const myStory: Story | null = null;

// Helper to format time ago
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return '어제';
}
