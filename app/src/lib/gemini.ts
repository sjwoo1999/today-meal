/**
 * Gemini Vision API 클라이언트
 * 음식 사진 → 영양정보 분석
 */

import { FoodAnalysisRequest, FoodAnalysisResponse, FoodAnalysisResult } from '@/types/foodAnalysis';

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// 프롬프트 템플릿
const FOOD_ANALYSIS_PROMPT = `당신은 음식 영양 분석 전문가입니다. 이 음식 사진을 분석해서 아래 JSON 형식으로 정확하게 반환해주세요.

중요 지침:
1. 포장식품이면 라벨 정보를 우선 활용
2. 조리음식이면 일반적인 1인분 기준으로 추정
3. 여러 음식이 있으면 전체 합산
4. 확신이 낮으면 min/max 범위를 넓게 설정
5. 한국 음식에 익숙해져 있어야 함

JSON 형식:
{
  "food_name": "음식 이름 (한글)",
  "is_packaged": true/false,
  "brand": "브랜드명 (포장식품인 경우)",
  "serving_size": "분량 (예: 1인분, 1개)",
  "calories_min": 숫자,
  "calories_max": 숫자,
  "protein_g": 숫자,
  "carbs_g": 숫자,
  "fat_g": 숫자,
  "confidence": 0-100 사이 숫자
}

반드시 위 JSON 형식만 반환하세요. 다른 텍스트는 포함하지 마세요.`;

/**
 * Gemini API로 음식 사진 분석
 */
export async function analyzeFoodWithGemini(
    request: FoodAnalysisRequest
): Promise<FoodAnalysisResponse> {
    // API 키 확인
    if (!GEMINI_API_KEY) {
        console.warn('[Gemini] API key not configured, using mock mode');
        return getMockAnalysisResult();
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: FOOD_ANALYSIS_PROMPT },
                            {
                                inline_data: {
                                    mime_type: request.mimeType,
                                    data: request.imageBase64,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 429) {
                return {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT',
                        message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                        retryable: true,
                    },
                };
            }

            return {
                success: false,
                error: {
                    code: 'API_ERROR',
                    message: errorData.error?.message || '분석 중 오류가 발생했습니다.',
                    retryable: true,
                },
            };
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            return {
                success: false,
                error: {
                    code: 'RECOGNITION_FAILED',
                    message: '음식을 인식하지 못했습니다. 다시 촬영해주세요.',
                    retryable: true,
                },
            };
        }

        // JSON 파싱
        const parsedResult = parseGeminiResponse(textContent);

        if (!parsedResult) {
            return {
                success: false,
                error: {
                    code: 'RECOGNITION_FAILED',
                    message: '분석 결과를 처리하지 못했습니다.',
                    retryable: true,
                },
            };
        }

        return {
            success: true,
            data: parsedResult,
        };

    } catch (error) {
        console.error('[Gemini] Analysis error:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: '네트워크 연결을 확인해주세요.',
                    retryable: true,
                },
            };
        }

        return {
            success: false,
            error: {
                code: 'API_ERROR',
                message: '알 수 없는 오류가 발생했습니다.',
                retryable: true,
            },
        };
    }
}

/**
 * Gemini 응답 JSON 파싱
 */
function parseGeminiResponse(text: string): FoodAnalysisResult | null {
    try {
        // JSON 블록 추출 (마크다운 코드 블록 처리)
        let jsonStr = text;
        const jsonMatch = text.match(/```json?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        // 순수 JSON 객체 추출
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            jsonStr = objectMatch[0];
        }

        const parsed = JSON.parse(jsonStr);

        // 필드 매핑
        const caloriesMin = parsed.calories_min ?? parsed.calories ?? 0;
        const caloriesMax = parsed.calories_max ?? parsed.calories ?? caloriesMin;
        const caloriesAvg = Math.round((caloriesMin + caloriesMax) / 2);

        return {
            foodName: parsed.food_name || '알 수 없는 음식',
            nutrition: {
                calories: caloriesAvg,
                caloriesMin,
                caloriesMax,
                protein: parsed.protein_g ?? 0,
                carbs: parsed.carbs_g ?? 0,
                fat: parsed.fat_g ?? 0,
            },
            confidence: parsed.confidence ?? 50,
            isPackaged: parsed.is_packaged ?? false,
            brand: parsed.brand,
            servingSize: parsed.serving_size ?? '1인분',
            source: 'gemini',
        };
    } catch (error) {
        console.error('[Gemini] Failed to parse response:', error, text);
        return null;
    }
}

/**
 * Mock 분석 결과 (개발용)
 */
function getMockAnalysisResult(): FoodAnalysisResponse {
    // 랜덤 Mock 데이터
    const mockFoods = [
        {
            foodName: 'GS25 도시락 (김치제육)',
            nutrition: { calories: 650, caloriesMin: 620, caloriesMax: 680, protein: 28, carbs: 85, fat: 22 },
            confidence: 92,
            isPackaged: true,
            brand: 'GS25',
            servingSize: '1개',
        },
        {
            foodName: '된장찌개 정식',
            nutrition: { calories: 580, caloriesMin: 500, caloriesMax: 660, protein: 22, carbs: 72, fat: 18 },
            confidence: 72,
            isPackaged: false,
            servingSize: '1인분',
        },
        {
            foodName: '삼각김밥 (참치마요)',
            nutrition: { calories: 210, caloriesMin: 200, caloriesMax: 220, protein: 6, carbs: 35, fat: 5 },
            confidence: 95,
            isPackaged: true,
            brand: 'CU',
            servingSize: '1개',
        },
    ];

    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];

    return {
        success: true,
        data: {
            ...randomFood,
            source: 'gemini',
        },
    };
}

/**
 * Base64로 이미지 변환
 */
export async function imageFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
