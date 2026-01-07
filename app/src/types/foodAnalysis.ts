// 음식 분석 관련 타입 정의

export interface NutritionInfo {
    calories: number;
    caloriesMin?: number;
    caloriesMax?: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
}

export interface FoodAnalysisResult {
    /** 음식 이름 */
    foodName: string;
    /** 영양 정보 */
    nutrition: NutritionInfo;
    /** 신뢰도 (0-100) */
    confidence: number;
    /** 포장식품 여부 */
    isPackaged: boolean;
    /** 브랜드 (포장식품인 경우) */
    brand?: string;
    /** 분량 (예: "1인분", "1개") */
    servingSize?: string;
    /** 분석 소스 */
    source: 'gemini' | 'database' | 'manual';
}

export interface FoodAnalysisRequest {
    /** Base64 인코딩된 이미지 */
    imageBase64: string;
    /** 이미지 MIME 타입 */
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
    /** 추가 컨텍스트 (선택) */
    context?: string;
}

export interface FoodAnalysisError {
    code: 'NETWORK_ERROR' | 'RECOGNITION_FAILED' | 'INVALID_IMAGE' | 'RATE_LIMIT' | 'API_ERROR';
    message: string;
    retryable: boolean;
}

export type FoodAnalysisResponse =
    | { success: true; data: FoodAnalysisResult }
    | { success: false; error: FoodAnalysisError };

// 신뢰도 레벨
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export function getConfidenceLevel(confidence: number): ConfidenceLevel {
    if (confidence >= 85) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
}

export function getConfidenceLabel(level: ConfidenceLevel): string {
    switch (level) {
        case 'high': return '정확';
        case 'medium': return '추정';
        case 'low': return '확인 필요';
    }
}
