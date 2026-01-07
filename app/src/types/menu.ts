/**
 * 메뉴 및 구매 관련 타입 정의
 */

// 메뉴 카테고리
export type MenuCategory =
    | 'dosirak'    // 도시락
    | 'sandwich'   // 샌드위치
    | 'salad'      // 샐러드
    | 'drink'      // 음료
    | 'snack'      // 간식
    | 'protein'    // 단백질 식품
    | 'meal_kit'   // 밀키트
    | 'other';

// 편의점 브랜드
export type ConvenienceStoreBrand =
    | 'gs25'
    | 'cu'
    | 'seveneleven'
    | 'emart24'
    | 'ministop';

// 배달/커머스 플랫폼
export type PurchasePlatform =
    | 'gs_freshdelivery'  // GS 프레시딜리버리
    | 'cu_delivery'       // CU 배달
    | 'coupang_eats'      // 쿠팡이츠
    | 'baemin'            // 배달의민족
    | 'yogiyo'            // 요기요
    | 'naver_shopping'    // 네이버 쇼핑
    | 'coupang'           // 쿠팡
    | 'kurly'             // 마켓컬리
    | 'direct';           // 매장 직접 방문

// 구매 링크
export interface PurchaseLink {
    platform: PurchasePlatform;
    url: string;
    appScheme: string | null;  // 딥링크 (cuapp://, gsretailapp:// 등)
    price?: number;
    isAvailable: boolean;
}

// 구매 링크 컬렉션
export interface PurchaseLinks {
    primary: PurchaseLink;
    alternatives: PurchaseLink[];
}

// 메뉴 아이템
export interface MenuItem {
    id: string;
    name: string;
    brand: string;  // 브랜드/제조사
    storeBrand?: ConvenienceStoreBrand;  // 편의점 브랜드
    category: MenuCategory;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;  // mg
    price: number;
    originalPrice?: number;  // 할인 전 가격
    imageUrl: string;
    purchaseLinks: PurchaseLinks;
    tags: string[];  // ['고단백', '저칼로리', '오늘의추천' 등]
    isAvailable: boolean;
    isRecommended?: boolean;
    updatedAt: string;
}

// 구매 클릭 추적
export interface PurchaseClick {
    id: string;
    userId: string;
    menuId: string;
    menuName: string;
    platform: PurchasePlatform;
    linkType: 'deeplink' | 'web' | 'web_fallback';
    context: 'reverse_recommendation' | 'home_recommendation' | 'record_complete' | 'search';
    clickedAt: string;
    converted?: boolean;  // 구매 전환 여부 (추후 트래킹)
}

// 추천 기준
export interface RecommendationCriteria {
    remainingCalories: number;
    remainingProtein: number;
    remainingCarbs: number;
    remainingFat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    preferences?: string[];  // 사용자 선호 태그
    excludes?: string[];     // 제외할 태그
    maxPrice?: number;
    includeWorkoutBonus?: boolean;  // 운동 후 단백질 보너스
}

// 추천 결과
export interface MenuRecommendation {
    menu: MenuItem;
    score: number;  // 추천 적합도 점수 (0-100)
    reasons: string[];  // ['단백질 목표 달성', '가격 적당' 등]
    calorieMatch: number;  // 남은 칼로리 대비 적합도
    proteinMatch: number;
}

// 플랫폼 정보
export const PLATFORM_INFO: Record<PurchasePlatform, {
    name: string;
    logo: string;
    color: string;
    hasDeeplink: boolean;
}> = {
    gs_freshdelivery: { name: 'GS 프레시', logo: '🟢', color: '#00A651', hasDeeplink: true },
    cu_delivery: { name: 'CU 배달', logo: '🟣', color: '#8B00FF', hasDeeplink: true },
    coupang_eats: { name: '쿠팡이츠', logo: '🍕', color: '#E4002B', hasDeeplink: true },
    baemin: { name: '배민', logo: '🍽️', color: '#48D1CC', hasDeeplink: true },
    yogiyo: { name: '요기요', logo: '🍜', color: '#FA0050', hasDeeplink: true },
    naver_shopping: { name: '네이버', logo: '🟩', color: '#03C75A', hasDeeplink: false },
    coupang: { name: '쿠팡', logo: '🛒', color: '#E4002B', hasDeeplink: true },
    kurly: { name: '컬리', logo: '🟪', color: '#5F0080', hasDeeplink: true },
    direct: { name: '매장방문', logo: '🏪', color: '#6B7280', hasDeeplink: false },
};

// 카테고리 정보
export const CATEGORY_INFO: Record<MenuCategory, {
    name: string;
    emoji: string;
}> = {
    dosirak: { name: '도시락', emoji: '🍱' },
    sandwich: { name: '샌드위치', emoji: '🥪' },
    salad: { name: '샐러드', emoji: '🥗' },
    drink: { name: '음료', emoji: '🥤' },
    snack: { name: '간식', emoji: '🍪' },
    protein: { name: '단백질', emoji: '💪' },
    meal_kit: { name: '밀키트', emoji: '🍲' },
    other: { name: '기타', emoji: '🍴' },
};
