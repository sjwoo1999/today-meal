'use client';

import { useState, useCallback } from 'react';
import {
    Workout,
    WorkoutExtractionResult,
    TodayWorkoutSummary,
    WorkoutStats,
    WorkoutType
} from '@/types/workout';

interface UseWorkoutsState {
    workouts: Workout[];
    todayWorkouts: Workout[];
    isLoading: boolean;
    error: string | null;
}

interface UseWorkoutsReturn extends UseWorkoutsState {
    // Actions
    addWorkout: (workout: Workout) => void;
    updateWorkout: (id: string, data: Partial<Workout>) => void;
    deleteWorkout: (id: string) => void;
    // Queries
    getTodaySummary: () => TodayWorkoutSummary;
    getStats: () => WorkoutStats;
    // API
    extractFromImage: (imageBase64: string) => Promise<WorkoutExtractionResult>;
}

// 오늘 날짜 문자열
const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * 운동 데이터 관리 훅
 */
export function useWorkouts(): UseWorkoutsReturn {
    const [state, setState] = useState<UseWorkoutsState>({
        workouts: [],
        todayWorkouts: [],
        isLoading: false,
        error: null
    });

    // 운동 추가
    const addWorkout = useCallback((workout: Workout) => {
        setState(prev => {
            const newWorkouts = [...prev.workouts, workout];
            const today = getTodayDate();
            return {
                ...prev,
                workouts: newWorkouts,
                todayWorkouts: newWorkouts.filter(w => w.activityDate === today)
            };
        });
    }, []);

    // 운동 수정
    const updateWorkout = useCallback((id: string, data: Partial<Workout>) => {
        setState(prev => {
            const newWorkouts = prev.workouts.map(w =>
                w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString() } : w
            );
            const today = getTodayDate();
            return {
                ...prev,
                workouts: newWorkouts,
                todayWorkouts: newWorkouts.filter(w => w.activityDate === today)
            };
        });
    }, []);

    // 운동 삭제
    const deleteWorkout = useCallback((id: string) => {
        setState(prev => {
            const newWorkouts = prev.workouts.filter(w => w.id !== id);
            const today = getTodayDate();
            return {
                ...prev,
                workouts: newWorkouts,
                todayWorkouts: newWorkouts.filter(w => w.activityDate === today)
            };
        });
    }, []);

    // 오늘 운동 요약
    const getTodaySummary = useCallback((): TodayWorkoutSummary => {
        const today = getTodayDate();
        const todayWorkouts = state.workouts.filter(w => w.activityDate === today);

        if (todayWorkouts.length === 0) {
            return {
                hasWorkout: false,
                workouts: [],
                totalCaloriesBurned: 0,
                totalDurationMinutes: 0
            };
        }

        const totalCaloriesBurned = todayWorkouts.reduce(
            (sum, w) => sum + (w.caloriesBurned || 0), 0
        );
        const totalDurationMinutes = todayWorkouts.reduce(
            (sum, w) => sum + w.durationMinutes, 0
        );

        // 가장 많이 한 운동 타입 찾기
        const typeCounts: Record<WorkoutType, number> = {} as Record<WorkoutType, number>;
        todayWorkouts.forEach(w => {
            typeCounts[w.activityType] = (typeCounts[w.activityType] || 0) + 1;
        });
        const primaryType = Object.entries(typeCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] as WorkoutType | undefined;

        return {
            hasWorkout: true,
            workouts: todayWorkouts,
            totalCaloriesBurned,
            totalDurationMinutes,
            primaryType
        };
    }, [state.workouts]);

    // 전체 통계
    const getStats = useCallback((): WorkoutStats => {
        const { workouts } = state;

        if (workouts.length === 0) {
            return {
                totalWorkouts: 0,
                totalCaloriesBurned: 0,
                totalDurationMinutes: 0,
                totalDistanceKm: 0,
                workoutsByType: {} as Record<WorkoutType, number>,
                averageCaloriesPerWorkout: 0,
                currentStreak: 0
            };
        }

        const totalCaloriesBurned = workouts.reduce(
            (sum, w) => sum + (w.caloriesBurned || 0), 0
        );
        const totalDurationMinutes = workouts.reduce(
            (sum, w) => sum + w.durationMinutes, 0
        );
        const totalDistanceKm = workouts.reduce(
            (sum, w) => sum + (w.distanceKm || 0), 0
        );

        const workoutsByType: Record<WorkoutType, number> = {} as Record<WorkoutType, number>;
        workouts.forEach(w => {
            workoutsByType[w.activityType] = (workoutsByType[w.activityType] || 0) + 1;
        });

        // 연속 운동 일수 계산 (간단 버전)
        const today = new Date();
        let currentStreak = 0;
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            const hasWorkout = workouts.some(w => w.activityDate === dateStr);
            if (hasWorkout) {
                currentStreak++;
            } else if (i > 0) {
                break;
            }
        }

        return {
            totalWorkouts: workouts.length,
            totalCaloriesBurned,
            totalDurationMinutes,
            totalDistanceKm,
            workoutsByType,
            averageCaloriesPerWorkout: Math.round(totalCaloriesBurned / workouts.length),
            currentStreak
        };
    }, [state.workouts]);

    // 이미지에서 운동 데이터 추출 (Mock)
    const extractFromImage = useCallback(async (imageBase64: string): Promise<WorkoutExtractionResult> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Mock 딜레이
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock 결과
        const mockResults: WorkoutExtractionResult[] = [
            {
                success: true,
                confidence: 92,
                data: {
                    activityType: 'running',
                    activityName: '아침 러닝',
                    durationMinutes: 35,
                    caloriesBurned: 320,
                    distanceKm: 5.2,
                    steps: 6500,
                    sourceApp: 'strava',
                    activityDate: getTodayDate(),
                    extractionConfidence: 92
                }
            },
            {
                success: true,
                confidence: 88,
                data: {
                    activityType: 'weight',
                    activityName: '상체 운동',
                    durationMinutes: 50,
                    caloriesBurned: 280,
                    sourceApp: 'apple_health',
                    activityDate: getTodayDate(),
                    weightTrainingData: {
                        totalSets: 20,
                        muscleGroups: ['chest', 'back', 'shoulders'],
                        setsPerMuscle: { chest: 8, back: 8, shoulders: 4 }
                    },
                    extractionConfidence: 88
                }
            }
        ];

        // imageBase64를 사용하여 린트 경고 방지
        const resultIndex = imageBase64.length % mockResults.length;
        const result = mockResults[resultIndex];

        setState(prev => ({ ...prev, isLoading: false }));
        return result;
    }, []);

    return {
        ...state,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getTodaySummary,
        getStats,
        extractFromImage
    };
}
