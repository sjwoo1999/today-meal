/**
 * Gemini API를 사용한 운동 스크린샷 데이터 추출
 */

import {
    Workout,
    WorkoutExtractionResult,
    WorkoutType,
    WorkoutSourceApp,
    estimateCalories
} from '@/types/workout';

// API 키 확인 (서버 사이드)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// 운동 추출 프롬프트
const WORKOUT_EXTRACTION_PROMPT = `You are an expert at analyzing workout app screenshots. Extract workout data from this screenshot and return it in the following JSON format.

Analysis guidelines:
1. Recognize various app formats: Strava, Apple Watch, Samsung Health, Garmin, Nike Run Club, etc.
2. Korean/English mixed content is acceptable
3. Extract all available data: time, distance, calories, heart rate, etc.
4. For weight training, analyze sets and muscle groups
5. Set confidence low if uncertain

JSON format:
{
  "activity_type": "running" | "weight" | "cycling" | "walking" | "swimming" | "hiking" | "hiit" | "yoga" | "other",
  "activity_name": "Activity name if available",
  "duration_minutes": number,
  "calories_burned": number or null,
  "distance_km": number or null,
  "steps": number or null,
  "elevation_gain_m": number or null,
  "source_app": "strava" | "garmin" | "apple_health" | "samsung_health" | "nike_run" | "galaxy_watch" | "other",
  "activity_date": "YYYY-MM-DD" or null,
  "activity_time": "HH:mm" or null,
  "weight_training": {
    "total_sets": number,
    "muscle_groups": ["chest", "back", "legs", ...],
    "sets_per_muscle": {"chest": 4, "back": 3, ...}
  } or null,
  "confidence": number between 0-100
}

Return ONLY the JSON format above. Do not include any other text.`;

/**
 * 운동 스크린샷에서 데이터 추출
 */
export async function extractWorkoutFromImage(
    imageBase64: string,
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'
): Promise<WorkoutExtractionResult> {
    // Mock 모드 (API 키 없거나 클라이언트)
    if (!GEMINI_API_KEY || typeof window !== 'undefined') {
        console.warn('[WorkoutExtractor] Using mock mode');
        return getMockWorkoutResult();
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: WORKOUT_EXTRACTION_PROMPT },
                        { inline_data: { mime_type: mimeType, data: imageBase64 } }
                    ]
                }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 1000 }
            })
        });

        if (!response.ok) {
            return {
                success: false,
                confidence: 0,
                error: { code: 'API_ERROR', message: '운동 데이터 추출 중 오류가 발생했습니다.' }
            };
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            return {
                success: false,
                confidence: 0,
                error: { code: 'RECOGNITION_FAILED', message: '운동 데이터를 인식하지 못했습니다.' }
            };
        }

        return parseWorkoutResponse(textContent);

    } catch (error) {
        console.error('[WorkoutExtractor] Error:', error);
        return {
            success: false,
            confidence: 0,
            error: { code: 'API_ERROR', message: '네트워크 오류가 발생했습니다.' }
        };
    }
}

/**
 * Gemini 응답 파싱
 */
function parseWorkoutResponse(text: string): WorkoutExtractionResult {
    try {
        // JSON 블록 추출
        let jsonStr = text;
        const jsonMatch = text.match(/```json?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];

        const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (objectMatch) jsonStr = objectMatch[0];

        const parsed = JSON.parse(jsonStr);

        const workoutData: Partial<Workout> = {
            activityType: parsed.activity_type as WorkoutType || 'other',
            activityName: parsed.activity_name,
            durationMinutes: parsed.duration_minutes || 0,
            caloriesBurned: parsed.calories_burned,
            distanceKm: parsed.distance_km,
            steps: parsed.steps,
            elevationGainM: parsed.elevation_gain_m,
            sourceApp: parsed.source_app as WorkoutSourceApp || 'other',
            activityDate: parsed.activity_date || new Date().toISOString().split('T')[0],
            activityTime: parsed.activity_time,
            weightTrainingData: parsed.weight_training ? {
                totalSets: parsed.weight_training.total_sets || 0,
                muscleGroups: parsed.weight_training.muscle_groups || [],
                setsPerMuscle: parsed.weight_training.sets_per_muscle || {}
            } : null,
            cardioData: parsed.distance_km ? {
                distanceKm: parsed.distance_km,
                avgHeartRate: parsed.avg_heart_rate,
                elevationGainM: parsed.elevation_gain_m
            } : null,
            extractionConfidence: parsed.confidence || 50
        };

        // 칼로리 추정 (없으면)
        if (!workoutData.caloriesBurned && workoutData.durationMinutes) {
            workoutData.caloriesBurned = estimateCalories(
                workoutData.activityType || 'other',
                workoutData.durationMinutes
            );
        }

        return {
            success: true,
            data: workoutData,
            confidence: parsed.confidence || 50,
            rawResponse: text
        };

    } catch (error) {
        console.error('[WorkoutExtractor] Parse error:', error);
        return {
            success: false,
            confidence: 0,
            error: { code: 'RECOGNITION_FAILED', message: '데이터 파싱에 실패했습니다.' }
        };
    }
}

/**
 * Mock 결과 (개발/테스트용)
 */
function getMockWorkoutResult(): WorkoutExtractionResult {
    const mockWorkouts = [
        {
            activityType: 'running' as WorkoutType,
            activityName: '아침 러닝',
            durationMinutes: 35,
            caloriesBurned: 320,
            distanceKm: 5.2,
            steps: 6500,
            sourceApp: 'strava' as WorkoutSourceApp,
            extractionConfidence: 92
        },
        {
            activityType: 'weight' as WorkoutType,
            activityName: '상체 운동',
            durationMinutes: 50,
            caloriesBurned: 280,
            sourceApp: 'apple_health' as WorkoutSourceApp,
            weightTrainingData: {
                totalSets: 20,
                muscleGroups: ['chest', 'back', 'shoulders'],
                setsPerMuscle: { chest: 8, back: 8, shoulders: 4 }
            },
            extractionConfidence: 88
        },
        {
            activityType: 'cycling' as WorkoutType,
            activityName: '출근 자전거',
            durationMinutes: 25,
            caloriesBurned: 180,
            distanceKm: 8.5,
            sourceApp: 'samsung_health' as WorkoutSourceApp,
            extractionConfidence: 95
        }
    ];

    const randomWorkout = mockWorkouts[Math.floor(Math.random() * mockWorkouts.length)];

    return {
        success: true,
        data: {
            ...randomWorkout,
            activityDate: new Date().toISOString().split('T')[0],
            cardioData: randomWorkout.distanceKm ? { distanceKm: randomWorkout.distanceKm } : null
        },
        confidence: randomWorkout.extractionConfidence
    };
}

/**
 * 운동 타입 자동 감지 (키워드 기반)
 */
export function detectWorkoutType(text: string): WorkoutType {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('run') || lowerText.includes('러닝') || lowerText.includes('달리기')) return 'running';
    if (lowerText.includes('cycl') || lowerText.includes('bike') || lowerText.includes('자전거')) return 'cycling';
    if (lowerText.includes('swim') || lowerText.includes('수영')) return 'swimming';
    if (lowerText.includes('walk') || lowerText.includes('걷기') || lowerText.includes('산책')) return 'walking';
    if (lowerText.includes('hik') || lowerText.includes('등산')) return 'hiking';
    if (lowerText.includes('weight') || lowerText.includes('헬스') || lowerText.includes('웨이트')) return 'weight';
    if (lowerText.includes('hiit') || lowerText.includes('인터벌')) return 'hiit';
    if (lowerText.includes('yoga') || lowerText.includes('요가') || lowerText.includes('필라')) return 'yoga';

    return 'other';
}

/**
 * 운동 앱 자동 감지
 */
export function detectSourceApp(text: string): WorkoutSourceApp {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('strava')) return 'strava';
    if (lowerText.includes('garmin')) return 'garmin';
    if (lowerText.includes('apple') || lowerText.includes('워치')) return 'apple_health';
    if (lowerText.includes('samsung') || lowerText.includes('삼성')) return 'samsung_health';
    if (lowerText.includes('nike')) return 'nike_run';
    if (lowerText.includes('galaxy')) return 'galaxy_watch';

    return 'other';
}
