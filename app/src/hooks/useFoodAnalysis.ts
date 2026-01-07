'use client';

import { useState, useCallback } from 'react';
import {
    FoodAnalysisResult,
    FoodAnalysisError,
    FoodAnalysisRequest
} from '@/types/foodAnalysis';
import { analyzeFoodWithGemini, imageFileToBase64 } from '@/lib/gemini';

// Mock 모드 여부 - 클라이언트에서 항상 동작하도록 NEXT_PUBLIC 환경 변수 사용
// GEMINI_API_KEY는 서버 전용이므로 클라이언트에서는 항상 Mock 모드
const MOCK_MODE = typeof window !== 'undefined' || process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true';
const MOCK_DELAY_MS = 1500; // Mock 모드에서 로딩 애니메이션 표시 시간

interface UseFoodAnalysisState {
    result: FoodAnalysisResult | null;
    isLoading: boolean;
    error: FoodAnalysisError | null;
}

interface UseFoodAnalysisReturn extends UseFoodAnalysisState {
    /** 이미지 파일로 분석 시작 */
    analyzeImage: (file: File) => Promise<FoodAnalysisResult | null>;
    /** Base64 이미지로 분석 시작 */
    analyzeBase64: (base64: string, mimeType: FoodAnalysisRequest['mimeType']) => Promise<FoodAnalysisResult | null>;
    /** 상태 초기화 */
    reset: () => void;
    /** 수동으로 결과 설정 (사용자 수정용) */
    setManualResult: (result: FoodAnalysisResult) => void;
}

/**
 * 음식 사진 분석 훅
 * 
 * @example
 * const { analyzeImage, result, isLoading, error } = useFoodAnalysis();
 * 
 * const handleCapture = async (file: File) => {
 *   const result = await analyzeImage(file);
 *   if (result) {
 *     console.log('분석 완료:', result.foodName);
 *   }
 * };
 */
export function useFoodAnalysis(): UseFoodAnalysisReturn {
    const [state, setState] = useState<UseFoodAnalysisState>({
        result: null,
        isLoading: false,
        error: null,
    });

    const analyzeBase64 = useCallback(async (
        base64: string,
        mimeType: FoodAnalysisRequest['mimeType']
    ): Promise<FoodAnalysisResult | null> => {
        setState({ result: null, isLoading: true, error: null });

        try {
            // Mock 모드에서는 딜레이 후 Mock 결과 반환
            const response = await analyzeFoodWithGemini({
                imageBase64: base64,
                mimeType,
            });

            if (response.success) {
                setState({ result: response.data, isLoading: false, error: null });
                return response.data;
            } else {
                setState({ result: null, isLoading: false, error: response.error });
                return null;
            }
        } catch {
            const error: FoodAnalysisError = {
                code: 'API_ERROR',
                message: '분석 중 오류가 발생했습니다.',
                retryable: true,
            };
            setState({ result: null, isLoading: false, error });
            return null;
        }
    }, []);

    // Mock 모드 전용 분석 (Base64 변환 없이 바로 결과 반환)
    const analyzeMock = useCallback(async (): Promise<FoodAnalysisResult | null> => {
        setState({ result: null, isLoading: true, error: null });

        // 로딩 애니메이션을 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

        // Mock 결과 생성
        const response = await analyzeFoodWithGemini({
            imageBase64: '',
            mimeType: 'image/jpeg',
        });

        if (response.success) {
            setState({ result: response.data, isLoading: false, error: null });
            return response.data;
        } else {
            setState({ result: null, isLoading: false, error: response.error });
            return null;
        }
    }, []);

    const analyzeImage = useCallback(async (file: File): Promise<FoodAnalysisResult | null> => {
        // Mock 모드에서는 File 처리 없이 바로 Mock 결과 반환
        if (MOCK_MODE) {
            return analyzeMock();
        }

        // MIME 타입 확인
        const mimeType = file.type as FoodAnalysisRequest['mimeType'];
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
            setState({
                result: null,
                isLoading: false,
                error: {
                    code: 'INVALID_IMAGE',
                    message: 'JPG, PNG, WebP 이미지만 지원합니다.',
                    retryable: false,
                },
            });
            return null;
        }

        try {
            const base64 = await imageFileToBase64(file);
            return analyzeBase64(base64, mimeType);
        } catch {
            setState({
                result: null,
                isLoading: false,
                error: {
                    code: 'INVALID_IMAGE',
                    message: '이미지를 읽는데 실패했습니다.',
                    retryable: true,
                },
            });
            return null;
        }
    }, [analyzeBase64, analyzeMock]);

    const reset = useCallback(() => {
        setState({ result: null, isLoading: false, error: null });
    }, []);

    const setManualResult = useCallback((result: FoodAnalysisResult) => {
        setState({ result: { ...result, source: 'manual' }, isLoading: false, error: null });
    }, []);

    return {
        ...state,
        analyzeImage,
        analyzeBase64,
        reset,
        setManualResult,
    };
}
