import { RestaurantLocation } from '@/types';

// Food categories
export type FoodCategory =
    | 'meat'
    | 'chicken'
    | 'pizza'
    | 'western'
    | 'japanese'
    | 'korean'
    | 'chinese'
    | 'salad'
    | 'cafe'
    | 'convenience'
    | 'snack'    // 분식
    | 'pub';     // 주점

// Restaurant tags for filtering
export type RestaurantTag =
    | '가성비' | '학생추천' | '혼밥' | '데이트' | '소개팅'
    | '단체석' | '뒤풀이' | '카공' | '예약가능' | '콜키지'
    | '건강식' | '숨은맛집' | '랜드마크' | '친절함' | '푸짐한양';

// Extended restaurant interface
export interface MockRestaurant extends RestaurantLocation {
    id: string;
    category: FoodCategory[];
    rating?: number;
    priceRange?: '₩' | '₩₩' | '₩₩₩';
    isOpen?: boolean;
    menuItems?: string[];
    operatingHours?: string;
    phone?: string;
    tags?: RestaurantTag[];
    description?: string;
}

// Default location: Korea University Jungwoonoh IT Building
export const DEFAULT_LOCATION = {
    latitude: 37.5898,
    longitude: 127.0321,
    address: '서울특별시 성북구 안암로 145 고려대학교 정운오IT교양관',
    name: '고려대학교 정운오IT교양관',
};

// Real restaurant data based on 2025 Korea University area report
export const MOCK_RESTAURANTS: MockRestaurant[] = [
    // === 분식 (Snack/Korean Fast Food) ===
    {
        id: 'r1',
        name: '고른햇살',
        address: '안암역 인근 참살이길',
        distance: '200m',
        mapUrl: 'https://map.kakao.com/link/search/고른햇살 안암',
        category: ['korean', 'snack'],
        rating: 4.2,
        priceRange: '₩',
        isOpen: true,
        menuItems: ['치즈롤', '참치김밥', '쌀떡볶이', '토종순대', '라볶이'],
        operatingHours: '06:30~23:30 (연중무휴)',
        tags: ['가성비', '학생추천', '혼밥'],
        description: '안암동 분식의 상징. 흑미밥 치즈롤이 시그니처',
    },
    {
        id: 'r2',
        name: '이공김밥',
        address: '안암역 인근 안암본점',
        distance: '180m',
        mapUrl: 'https://map.kakao.com/link/search/이공김밥 안암',
        category: ['korean', 'snack'],
        rating: 4.3,
        priceRange: '₩',
        isOpen: true,
        menuItems: ['참치김밥(폭탄)', '치즈김밥', '떡볶이'],
        operatingHours: '09:30~20:40 (브레이크 14:30~16:00)',
        tags: ['가성비', '혼밥', '푸짐한양'],
        description: '참치 폭탄 김밥으로 유명. 밥보다 참치가 많다',
    },

    // === 양식 (Western) ===
    {
        id: 'r3',
        name: '무르무르 드 구스토',
        address: '안암역 인근 4층',
        distance: '250m',
        mapUrl: 'https://map.kakao.com/link/search/무르무르드구스토 안암',
        category: ['western'],
        rating: 4.0,
        priceRange: '₩₩₩',
        isOpen: true,
        menuItems: ['바질 파스타', '생면 파스타', '와인'],
        phone: '02-928-0683',
        tags: ['데이트', '소개팅', '예약가능', '콜키지'],
        description: '안암 최고의 분위기 레스토랑. 전망 좋은 4층',
    },
    {
        id: 'r4',
        name: '히포크라테스 스프',
        address: '성북구 고려대로28길 12-3',
        distance: '300m',
        mapUrl: 'https://map.kakao.com/link/search/히포크라테스스프',
        category: ['western', 'salad'],
        rating: 4.3,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['히포정식 9,900원', '탄단지세트 10,900원', '히포크라테스 스튜 8,900원'],
        tags: ['혼밥', '건강식'],
        description: '건강한 혼밥. 바 형태 테이블로 혼자 식사하기 좋음',
    },
    {
        id: 'r5',
        name: '매스플레이트',
        address: '안암역 인근',
        distance: '280m',
        mapUrl: 'https://map.kakao.com/link/search/매스플레이트 안암',
        category: ['western'],
        rating: 4.0,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['목살스테이크', '까르보나라'],
        tags: ['푸짐한양'],
        description: '서가앤쿡 스타일. 2인분 기준 넉넉한 양',
    },
    {
        id: 'r6',
        name: '모이리타',
        address: '안암역 인근',
        distance: '260m',
        mapUrl: 'https://map.kakao.com/link/search/모이리타 안암',
        category: ['western'],
        rating: 4.4,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['단호박 빠네 파스타', '크림 빠네'],
        tags: ['푸짐한양'],
        description: '빠네 파스타 전문. 빵 속 파스타',
    },
    {
        id: 'r7',
        name: '효이당',
        address: '안암역 인근',
        distance: '290m',
        mapUrl: 'https://map.kakao.com/link/search/효이당 안암',
        category: ['western'],
        rating: 4.5,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['파스타', '리조또'],
        tags: ['혼밥', '데이트'],
        description: '조용한 분위기의 파스타집',
    },
    {
        id: 'r8',
        name: '영철버거',
        address: '안암로9가길 (이공계 후문)',
        distance: '400m',
        mapUrl: 'https://map.kakao.com/link/search/영철버거 고려대',
        category: ['western', 'pub'],
        priceRange: '₩',
        isOpen: true,
        menuItems: ['스트리트버거'],
        tags: ['가성비', '학생추천', '랜드마크'],
        description: '고려대의 역사. 낮엔 버거집, 저녁엔 스포츠펍',
    },

    // === 한식 (Korean) ===
    {
        id: 'r9',
        name: '모심',
        address: '안암역 인근',
        distance: '220m',
        mapUrl: 'https://map.kakao.com/link/search/모심 안암',
        category: ['korean'],
        rating: 4.1,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['갈비탕', '점심특선'],
        tags: ['단체석'],
        description: '넓은 매장, 단체 점심 식사에 적합',
    },
    {
        id: 'r10',
        name: '도란도란',
        address: '안암동',
        distance: '320m',
        mapUrl: 'https://map.kakao.com/link/search/도란도란 안암',
        category: ['korean'],
        rating: 5.0,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['가정식 백반', '된장찌개', '제육볶음'],
        tags: ['혼밥', '친절함', '숨은맛집'],
        description: '엄마의 손맛. 정갈한 반찬 구성',
    },
    {
        id: 'r11',
        name: '옥두헌손두부',
        address: '안암역 인근',
        distance: '230m',
        mapUrl: 'https://map.kakao.com/link/search/옥두헌손두부',
        category: ['korean'],
        rating: 4.1,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['순두부찌개', '두부전골'],
        tags: ['혼밥', '건강식'],
        description: '자극적이지 않은 순두부. 혼밥 적합',
    },
    {
        id: 'r12',
        name: '안식당',
        address: '안암역 인근',
        distance: '310m',
        mapUrl: 'https://map.kakao.com/link/search/안식당 안암',
        category: ['korean'],
        rating: 4.7,
        priceRange: '₩₩₩',
        isOpen: true,
        menuItems: ['한정식', '불고기정식'],
        tags: ['데이트', '예약가능'],
        description: '정갈한 한식 상차림. 어른 모시기 적합',
    },

    // === 일식 (Japanese) ===
    {
        id: 'r13',
        name: '핵밥',
        address: '안암역 인근',
        distance: '190m',
        mapUrl: 'https://map.kakao.com/link/search/핵밥 고려대',
        category: ['japanese'],
        rating: 5.0,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['한우대창덮밥', '연어덮밥', '라멘'],
        tags: ['혼밥', '학생추천'],
        description: '안암역 대표 덮밥 맛집. 비대면 시스템 완비',
    },
    {
        id: 'r14',
        name: '스시토라',
        address: '안암역 인근',
        distance: '300m',
        mapUrl: 'https://map.kakao.com/link/search/스시토라 안암',
        category: ['japanese'],
        priceRange: '₩₩₩',
        isOpen: true,
        menuItems: ['광어+연어초밥', '사시미'],
        tags: ['데이트', '소개팅'],
        description: '깔끔하고 정갈한 초밥',
    },
    {
        id: 'r15',
        name: '고야정담',
        address: '안암역 인근',
        distance: '270m',
        mapUrl: 'https://map.kakao.com/link/search/고야정담 안암',
        category: ['japanese'],
        rating: 4.7,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['샤브샤브', '1인샤브'],
        tags: ['데이트', '혼밥'],
        description: '냄새 안 배이는 깔끔한 샤브샤브',
    },

    // === 중식 (Chinese) ===
    {
        id: 'r16',
        name: '용초수',
        address: '성북구 고려대로27길 20 2층',
        distance: '280m',
        mapUrl: 'https://map.kakao.com/link/search/용초수 안암',
        category: ['chinese'],
        rating: 4.2,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['꿔바로우', '호남볶음밥', '사천매운면', '토마토계란면'],
        tags: ['숨은맛집'],
        description: '정통 사천 요리. 중국 현지의 맛',
    },
    {
        id: 'r17',
        name: '하오마라',
        address: '안암역 인근',
        distance: '210m',
        mapUrl: 'https://map.kakao.com/link/search/하오마라 안암',
        category: ['chinese'],
        rating: 4.3,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['마라탕', '마라샹궈'],
        tags: ['학생추천'],
        description: '안암 마라탕 평점 1위',
    },

    // === 주점 (Pub) ===
    {
        id: 'r18',
        name: '춘자',
        address: '고려대로26길 45-4',
        distance: '350m',
        mapUrl: 'https://map.kakao.com/link/search/춘자 안암',
        category: ['pub'],
        rating: 3.6,
        priceRange: '₩',
        isOpen: true,
        menuItems: ['오뎅탕 6,000원', '계란탕 6,000원', '순두부찌개 8,000원', '알탕 8,000원'],
        tags: ['가성비', '학생추천'],
        description: '가성비 술집의 전설. 만 원으로 안주 해결',
    },

    // === 카페 (Cafe) ===
    {
        id: 'r19',
        name: '카페 브레송',
        address: '안암역 3번 출구 2층',
        distance: '150m',
        mapUrl: 'https://map.kakao.com/link/search/카페브레송 안암',
        category: ['cafe'],
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['아메리카노', '라떼', '디저트'],
        operatingHours: '평일 12:00~23:00 / 주말 13:00~23:00',
        tags: ['카공'],
        description: '카공족 성지. 깔끔한 인테리어, 늦게까지 운영',
    },
    {
        id: 'r20',
        name: '카페 애일',
        address: '안암역 인근',
        distance: '200m',
        mapUrl: 'https://map.kakao.com/link/search/카페애일 안암',
        category: ['cafe'],
        rating: 4.8,
        priceRange: '₩₩',
        isOpen: true,
        menuItems: ['마카롱', '휘낭시에', '커피'],
        tags: ['친절함', '숨은맛집'],
        description: '디저트 맛집. 사장님이 친절하다는 리뷰 다수',
    },
];

// Food keyword to category mapping
export const FOOD_TO_CATEGORY_MAP: Record<string, FoodCategory[]> = {
    // Korean keywords
    '삼겹살': ['meat', 'korean'],
    '치킨': ['chicken'],
    '피자': ['pizza'],
    '파스타': ['western'],
    '스테이크': ['western'],
    '햄버거': ['western'],
    '초밥': ['japanese'],
    '라멘': ['japanese'],
    '돈까스': ['japanese'],
    '덮밥': ['japanese'],
    '비빔밥': ['korean'],
    '김치찌개': ['korean'],
    '불고기': ['korean'],
    '갈비탕': ['korean'],
    '순두부': ['korean'],
    '짜장면': ['chinese'],
    '마라탕': ['chinese'],
    '샐러드': ['salad'],
    '커피': ['cafe'],
    '김밥': ['snack'],
    '떡볶이': ['snack'],
    '족발': ['meat', 'korean'],
};

// Helper function to get nearby restaurants by menu keyword
export function getNearbyRestaurants(
    menuKeyword: string,
    limit: number = 3
): MockRestaurant[] {
    const categories = FOOD_TO_CATEGORY_MAP[menuKeyword] || [];

    if (categories.length === 0) {
        return MOCK_RESTAURANTS.slice(0, limit);
    }

    const matching = MOCK_RESTAURANTS.filter(r =>
        r.category.some(c => categories.includes(c))
    );

    return matching.length > 0
        ? matching.slice(0, limit)
        : MOCK_RESTAURANTS.slice(0, limit);
}

// Get restaurants by tag
export function getRestaurantsByTag(tag: RestaurantTag, limit: number = 5): MockRestaurant[] {
    return MOCK_RESTAURANTS
        .filter(r => r.tags?.includes(tag))
        .slice(0, limit);
}

// Get breakfast locations (convenience stores, cafes)
export function getBreakfastLocations(limit: number = 2): MockRestaurant[] {
    return MOCK_RESTAURANTS
        .filter(r => r.category.includes('cafe') || r.category.includes('convenience') || r.category.includes('snack'))
        .slice(0, limit);
}

// Get lunch locations (exclude pubs)
export function getLunchLocations(limit: number = 2): MockRestaurant[] {
    return MOCK_RESTAURANTS
        .filter(r => !r.category.includes('pub') && r.priceRange !== '₩₩₩')
        .sort((a, b) => parseInt(a.distance) - parseInt(b.distance))
        .slice(0, limit);
}

// Popular menu items data derived from restaurants
export interface PopularMenuItem {
    id: string;
    name: string;
    nameKr: string;
    category: FoodCategory;
    estimatedCalories: number;
    estimatedProtein: number;
    restaurants: MockRestaurant[];
}

// Get popular menus from restaurant data
export function getPopularMenusFromRestaurants(): PopularMenuItem[] {
    const menuData: PopularMenuItem[] = [
        // 분식
        {
            id: 'm1', name: 'Kimbap', nameKr: '김밥', category: 'snack', estimatedCalories: 450, estimatedProtein: 12,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('김밥')))
        },
        {
            id: 'm2', name: 'Tteokbokki', nameKr: '떡볶이', category: 'snack', estimatedCalories: 380, estimatedProtein: 8,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('떡볶이')))
        },
        // 한식
        {
            id: 'm3', name: 'Galbitang', nameKr: '갈비탕', category: 'korean', estimatedCalories: 550, estimatedProtein: 35,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('갈비탕')))
        },
        {
            id: 'm4', name: 'Sundubu', nameKr: '순두부', category: 'korean', estimatedCalories: 380, estimatedProtein: 22,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('순두부')))
        },
        {
            id: 'm5', name: 'Baekban', nameKr: '백반', category: 'korean', estimatedCalories: 550, estimatedProtein: 25,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('백반') || m.includes('정식')))
        },
        // 양식
        {
            id: 'm6', name: 'Pasta', nameKr: '파스타', category: 'western', estimatedCalories: 620, estimatedProtein: 18,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('파스타') || m.includes('빠네')))
        },
        {
            id: 'm7', name: 'Steak', nameKr: '스테이크', category: 'western', estimatedCalories: 750, estimatedProtein: 55,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('스테이크')))
        },
        {
            id: 'm8', name: 'Burger', nameKr: '버거', category: 'western', estimatedCalories: 650, estimatedProtein: 30,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('버거')))
        },
        // 일식
        {
            id: 'm9', name: 'Donburi', nameKr: '덮밥', category: 'japanese', estimatedCalories: 680, estimatedProtein: 35,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('덮밥')))
        },
        {
            id: 'm10', name: 'Ramen', nameKr: '라멘', category: 'japanese', estimatedCalories: 550, estimatedProtein: 18,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('라멘')))
        },
        {
            id: 'm11', name: 'Sushi', nameKr: '초밥', category: 'japanese', estimatedCalories: 450, estimatedProtein: 22,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('초밥') || m.includes('사시미')))
        },
        {
            id: 'm12', name: 'Shabu', nameKr: '샤브샤브', category: 'japanese', estimatedCalories: 480, estimatedProtein: 28,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('샤브')))
        },
        // 중식
        {
            id: 'm13', name: 'Malatang', nameKr: '마라탕', category: 'chinese', estimatedCalories: 520, estimatedProtein: 25,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('마라')))
        },
        {
            id: 'm14', name: 'Kkwobarou', nameKr: '꿔바로우', category: 'chinese', estimatedCalories: 680, estimatedProtein: 22,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('꿔바로우')))
        },
        // 카페
        {
            id: 'm15', name: 'Coffee', nameKr: '커피', category: 'cafe', estimatedCalories: 150, estimatedProtein: 2,
            restaurants: MOCK_RESTAURANTS.filter(r => r.category.includes('cafe'))
        },
        {
            id: 'm16', name: 'Dessert', nameKr: '디저트', category: 'cafe', estimatedCalories: 350, estimatedProtein: 5,
            restaurants: MOCK_RESTAURANTS.filter(r => r.menuItems?.some(m => m.includes('마카롱') || m.includes('휘낭시에')))
        },
    ];

    // Only return menus that have associated restaurants
    return menuData.filter(m => m.restaurants.length > 0);
}

// Get restaurants that serve a specific menu
export function getRestaurantsForMenu(menuKeyword: string, limit: number = 3): MockRestaurant[] {
    // First, try exact match on menuItems
    const exactMatches = MOCK_RESTAURANTS.filter(r =>
        r.menuItems?.some(m => m.toLowerCase().includes(menuKeyword.toLowerCase()))
    );

    if (exactMatches.length > 0) {
        return exactMatches.slice(0, limit);
    }

    // Fallback to category-based search
    const categories = FOOD_TO_CATEGORY_MAP[menuKeyword] || [];
    if (categories.length > 0) {
        const categoryMatches = MOCK_RESTAURANTS.filter(r =>
            r.category.some(c => categories.includes(c))
        );
        return categoryMatches.slice(0, limit);
    }

    // Final fallback: return closest restaurants
    return MOCK_RESTAURANTS
        .sort((a, b) => parseInt(a.distance) - parseInt(b.distance))
        .slice(0, limit);
}
