/**
 * 편의점 상품 데이터베이스 유틸리티
 */

import productsData from '@/data/convenienceStoreProducts.json';

// 타입 정의
export interface ProductNutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface ConvenienceProduct {
    id: string;
    nameKr: string;
    nameEn?: string;
    category: string;
    storeId: string;
    price: number;
    nutrition: ProductNutrition;
    weight: number;
    imageUrl?: string;
    tags: string[];
    purchaseUrl?: string;
    available: boolean;
}

export interface Store {
    id: string;
    name: string;
    logo?: string;
    appScheme?: string;
    webUrl: string;
}

// 데이터 로드
const products: ConvenienceProduct[] = productsData.products as ConvenienceProduct[];
const stores: Store[] = productsData.stores as Store[];
const categories: string[] = productsData.categories as string[];

/**
 * 모든 상품 조회
 */
export function getAllProducts(): ConvenienceProduct[] {
    return products.filter(p => p.available);
}

/**
 * 카테고리별 상품 조회
 */
export function getProductsByCategory(category: string): ConvenienceProduct[] {
    return products.filter(p => p.category === category && p.available);
}

/**
 * 스토어별 상품 조회
 */
export function getProductsByStore(storeId: string): ConvenienceProduct[] {
    return products.filter(p => p.storeId === storeId && p.available);
}

/**
 * 영양소 기준 상품 필터링
 */
export interface NutritionFilter {
    minProtein?: number;
    maxCalories?: number;
    maxCarbs?: number;
    maxPrice?: number;
}

export function filterProductsByNutrition(filter: NutritionFilter): ConvenienceProduct[] {
    return products.filter(p => {
        if (!p.available) return false;
        if (filter.minProtein && p.nutrition.protein < filter.minProtein) return false;
        if (filter.maxCalories && p.nutrition.calories > filter.maxCalories) return false;
        if (filter.maxCarbs && p.nutrition.carbs > filter.maxCarbs) return false;
        if (filter.maxPrice && p.price > filter.maxPrice) return false;
        return true;
    });
}

/**
 * 고단백 저칼로리 상품 추천
 */
export function getHighProteinLowCalProducts(limit: number = 5): ConvenienceProduct[] {
    return products
        .filter(p => p.available)
        .sort((a, b) => {
            // 단백질/칼로리 비율로 정렬
            const ratioA = a.nutrition.protein / a.nutrition.calories;
            const ratioB = b.nutrition.protein / b.nutrition.calories;
            return ratioB - ratioA;
        })
        .slice(0, limit);
}

/**
 * 목표 영양소에 맞는 상품 조합 추천
 */
export interface NutritionGoal {
    targetCalories: number;
    targetProtein: number;
    maxPrice?: number;
}

export function recommendProductCombination(goal: NutritionGoal): ConvenienceProduct[] {
    const availableProducts = products.filter(p =>
        p.available && (!goal.maxPrice || p.price <= goal.maxPrice)
    );

    // 간단한 그리디 알고리즘 - 단백질 효율 높은 순으로 선택
    const sortedByProtein = [...availableProducts].sort((a, b) =>
        (b.nutrition.protein / b.price) - (a.nutrition.protein / a.price)
    );

    const selected: ConvenienceProduct[] = [];
    let totalCalories = 0;
    let totalProtein = 0;

    for (const product of sortedByProtein) {
        if (totalCalories + product.nutrition.calories <= goal.targetCalories * 1.1) {
            selected.push(product);
            totalCalories += product.nutrition.calories;
            totalProtein += product.nutrition.protein;

            if (totalProtein >= goal.targetProtein) break;
        }
    }

    return selected;
}

/**
 * 스토어 정보 조회
 */
export function getStoreById(storeId: string): Store | undefined {
    return stores.find(s => s.id === storeId);
}

/**
 * 모든 스토어 목록
 */
export function getAllStores(): Store[] {
    return stores;
}

/**
 * 모든 카테고리 목록
 */
export function getAllCategories(): string[] {
    return categories;
}

/**
 * 태그로 상품 검색
 */
export function searchProductsByTag(tag: string): ConvenienceProduct[] {
    const lowerTag = tag.toLowerCase();
    return products.filter(p =>
        p.available && p.tags.some(t => t.toLowerCase().includes(lowerTag))
    );
}

/**
 * 이름으로 상품 검색
 */
export function searchProductsByName(query: string): ConvenienceProduct[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.available && (
            p.nameKr.toLowerCase().includes(lowerQuery) ||
            (p.nameEn && p.nameEn.toLowerCase().includes(lowerQuery))
        )
    );
}
