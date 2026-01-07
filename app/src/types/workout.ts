/**
 * 운동 관련 타입 정의
 */

// 운동 유형
export type WorkoutType =
    | 'weight'    // 웨이트 트레이닝
    | 'running'   // 러닝
    | 'cycling'   // 사이클링
    | 'swimming'  // 수영
    | 'walking'   // 걷기
    | 'hiking'    // 등산
    | 'hiit'      // 고강도 인터벌
    | 'yoga'      // 요가/필라테스
    | 'other';    // 기타

// 운동 소스 앱
export type WorkoutSourceApp =
    | 'strava'
    | 'garmin'
    | 'apple_health'
    | 'samsung_health'
    | 'nike_run'
    | 'galaxy_watch'
    | 'manual'
    | 'other';

// 웨이트 트레이닝 상세 데이터
export interface WeightTrainingData {
    totalSets: number;
    muscleGroups: string[];  // ['chest', 'back', 'legs', ...]
    setsPerMuscle: Record<string, number>;
    exercises?: {
        name: string;
        sets: number;
        reps?: number;
        weight?: number;  // kg
    }[];
}

// 유산소 운동 상세 데이터
export interface CardioData {
    distanceKm: number;
    averagePace?: string;  // "5:30" per km
    maxHeartRate?: number;
    avgHeartRate?: number;
    elevationGainM?: number;
}

// 운동 기록
export interface Workout {
    id: string;
    userId: string;
    activityType: WorkoutType;
    activityName?: string;  // 사용자 정의 이름
    durationMinutes: number;
    caloriesBurned: number | null;
    distanceKm: number | null;
    steps: number | null;
    elevationGainM: number | null;
    weightTrainingData: WeightTrainingData | null;
    cardioData: CardioData | null;
    activityDate: string;  // YYYY-MM-DD
    activityTime?: string; // HH:mm
    sourceApp: WorkoutSourceApp;
    sourceImageUrl: string | null;
    extractionConfidence: number;  // 0-100
    note?: string;
    createdAt: string;
    updatedAt?: string;
}

// 운동 추출 결과 (AI 분석)
export interface WorkoutExtractionResult {
    success: boolean;
    data?: Partial<Workout>;
    confidence: number;
    rawResponse?: string;
    error?: {
        code: 'RECOGNITION_FAILED' | 'NO_WORKOUT_DATA' | 'API_ERROR';
        message: string;
    };
}

// 운동 통계
export interface WorkoutStats {
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalDurationMinutes: number;
    totalDistanceKm: number;
    workoutsByType: Record<WorkoutType, number>;
    averageCaloriesPerWorkout: number;
    currentStreak: number;  // 연속 운동 일수
}

// 오늘의 운동 요약
export interface TodayWorkoutSummary {
    hasWorkout: boolean;
    workouts: Workout[];
    totalCaloriesBurned: number;
    totalDurationMinutes: number;
    primaryType?: WorkoutType;
}

// 운동 타입별 정보
export const WORKOUT_TYPE_INFO: Record<WorkoutType, {
    label: string;
    emoji: string;
    color: string;
    metPerHour: number;  // 평균 MET 값 (칼로리 추정용)
}> = {
    weight: { label: '웨이트', emoji: '🏋️', color: '#8B5CF6', metPerHour: 6 },
    running: { label: '러닝', emoji: '🏃', color: '#EF4444', metPerHour: 9.8 },
    cycling: { label: '사이클', emoji: '🚴', color: '#3B82F6', metPerHour: 7.5 },
    swimming: { label: '수영', emoji: '🏊', color: '#06B6D4', metPerHour: 8 },
    walking: { label: '걷기', emoji: '🚶', color: '#22C55E', metPerHour: 3.5 },
    hiking: { label: '등산', emoji: '⛰️', color: '#84CC16', metPerHour: 6 },
    hiit: { label: 'HIIT', emoji: '🔥', color: '#F97316', metPerHour: 12 },
    yoga: { label: '요가', emoji: '🧘', color: '#EC4899', metPerHour: 2.5 },
    other: { label: '기타', emoji: '💪', color: '#6B7280', metPerHour: 5 },
};

// 칼로리 추정 함수 헬퍼
export function estimateCalories(
    type: WorkoutType,
    durationMinutes: number,
    weightKg: number = 70
): number {
    const met = WORKOUT_TYPE_INFO[type].metPerHour;
    // 공식: 칼로리 = MET × 체중(kg) × 시간(h)
    return Math.round(met * weightKg * (durationMinutes / 60));
}
