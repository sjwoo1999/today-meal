export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'badge' | 'skin' | 'boost' | 'gift';
    imageUrl?: string;
    emoji: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    isLimited?: boolean;
    stock?: number;
}

export const mockShopItems: ShopItem[] = [
    // Badges
    {
        id: 'badge_1',
        name: '골든 스트릭',
        description: '30일 연속 기록 달성 배지',
        price: 500,
        category: 'badge',
        emoji: '🏅',
        rarity: 'epic',
    },
    {
        id: 'badge_2',
        name: '단백질 마스터',
        description: '단백질 목표 7일 연속 달성',
        price: 300,
        category: 'badge',
        emoji: '💪',
        rarity: 'rare',
    },
    {
        id: 'badge_3',
        name: '아침형 인간',
        description: '아침 식사 기록 10회 달성',
        price: 200,
        category: 'badge',
        emoji: '🌅',
        rarity: 'common',
    },
    {
        id: 'badge_4',
        name: '다이어트 챔피언',
        description: '칼로리 목표 30일 달성',
        price: 800,
        category: 'badge',
        emoji: '🏆',
        rarity: 'legendary',
    },
    {
        id: 'badge_5',
        name: '건강 전도사',
        description: '피드에 50개 이상 포스팅',
        price: 400,
        category: 'badge',
        emoji: '📣',
        rarity: 'rare',
    },

    // Skins
    {
        id: 'skin_1',
        name: '프리미엄 테마 - 민트',
        description: '상쾌한 민트 컬러 테마',
        price: 600,
        category: 'skin',
        emoji: '🌿',
        rarity: 'rare',
    },
    {
        id: 'skin_2',
        name: '프리미엄 테마 - 코랄',
        description: '화사한 코랄 컬러 테마',
        price: 600,
        category: 'skin',
        emoji: '🪸',
        rarity: 'rare',
    },
    {
        id: 'skin_3',
        name: '한끼 마스코트 의상',
        description: '요리사 모자 한끼 캐릭터',
        price: 1000,
        category: 'skin',
        emoji: '👨‍🍳',
        rarity: 'epic',
    },
    {
        id: 'skin_4',
        name: '다크 모드 프리미엄',
        description: '고급스러운 다크 테마',
        price: 400,
        category: 'skin',
        emoji: '🌙',
        rarity: 'common',
    },

    // Boosts
    {
        id: 'boost_1',
        name: 'XP 부스터 (7일)',
        description: '7일간 XP 획득량 1.5배',
        price: 300,
        category: 'boost',
        emoji: '⚡',
        rarity: 'common',
    },
    {
        id: 'boost_2',
        name: 'XP 부스터 (30일)',
        description: '30일간 XP 획득량 1.5배',
        price: 1000,
        category: 'boost',
        emoji: '🚀',
        rarity: 'rare',
    },
    {
        id: 'boost_3',
        name: '스트릭 보호권',
        description: '스트릭 1회 보호',
        price: 200,
        category: 'boost',
        emoji: '🛡️',
        rarity: 'common',
    },
    {
        id: 'boost_4',
        name: '더블 XP 주간',
        description: '7일간 XP 2배 획득',
        price: 500,
        category: 'boost',
        emoji: '✨',
        rarity: 'epic',
        isLimited: true,
        stock: 50,
    },

    // Gifts
    {
        id: 'gift_1',
        name: '스타벅스 아메리카노',
        description: '스타벅스 아메리카노 기프티콘',
        price: 1500,
        category: 'gift',
        emoji: '☕',
        rarity: 'epic',
    },
    {
        id: 'gift_2',
        name: 'CU 편의점 상품권',
        description: '5,000원 상품권',
        price: 2000,
        category: 'gift',
        emoji: '🏪',
        rarity: 'rare',
    },
    {
        id: 'gift_3',
        name: '배달의민족 쿠폰',
        description: '5,000원 할인 쿠폰',
        price: 2500,
        category: 'gift',
        emoji: '🛵',
        rarity: 'epic',
    },
    {
        id: 'gift_4',
        name: '프로틴 바 세트',
        description: '건강한 단백질 바 5개입',
        price: 3000,
        category: 'gift',
        emoji: '🍫',
        rarity: 'legendary',
        isLimited: true,
        stock: 20,
    },
];

export function getShopItemsByCategory(category: ShopItem['category']): ShopItem[] {
    return mockShopItems.filter(item => item.category === category);
}

export function getShopItemById(id: string): ShopItem | undefined {
    return mockShopItems.find(item => item.id === id);
}

export function getFeaturedItems(): ShopItem[] {
    return mockShopItems.filter(item => item.isLimited || item.rarity === 'legendary');
}
