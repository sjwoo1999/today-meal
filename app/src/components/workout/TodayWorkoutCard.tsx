'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Flame, Clock, ChevronRight, Plus } from 'lucide-react';
import { WORKOUT_TYPE_INFO, WorkoutType } from '@/types/workout';

interface TodayWorkoutCardProps {
    hasWorkout: boolean;
    totalCaloriesBurned?: number;
    totalDurationMinutes?: number;
    primaryType?: WorkoutType;
    workoutCount?: number;
    onRecordWorkout: () => void;
    onViewDetails?: () => void;
}

export function TodayWorkoutCard({
    hasWorkout,
    totalCaloriesBurned = 0,
    totalDurationMinutes = 0,
    primaryType,
    workoutCount = 0,
    onRecordWorkout,
    onViewDetails
}: TodayWorkoutCardProps) {
    const typeInfo = primaryType ? WORKOUT_TYPE_INFO[primaryType] : null;

    if (!hasWorkout) {
        // 운동 없을 때 - CTA 표시
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">오늘 운동 기록</h3>
                            <p className="text-sm text-gray-500">스크린샷으로 간편하게!</p>
                        </div>
                    </div>
                    <button
                        onClick={onRecordWorkout}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium flex items-center gap-1 hover:from-purple-600 hover:to-blue-700 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        기록
                    </button>
                </div>
            </motion.div>
        );
    }

    // 운동 있을 때 - 요약 표시
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-4 text-white"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeInfo?.emoji || '💪'}</span>
                    <h3 className="font-bold text-lg">오늘 운동 완료!</h3>
                </div>
                {workoutCount > 1 && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        +{workoutCount - 1}개 더
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/20 rounded-xl p-3">
                    <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                        <Flame className="w-3 h-3" />
                        소모 칼로리
                    </div>
                    <p className="text-xl font-bold">{totalCaloriesBurned} kcal</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                    <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                        <Clock className="w-3 h-3" />
                        운동 시간
                    </div>
                    <p className="text-xl font-bold">{totalDurationMinutes}분</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={onRecordWorkout}
                    className="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-white/30 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    추가 기록
                </button>
                {onViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-sm text-white/80 flex items-center gap-1 hover:text-white"
                    >
                        상세보기
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
