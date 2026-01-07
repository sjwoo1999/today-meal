'use client';

import { useState } from 'react';
import type { Workout } from '@/types/workout';
import { WORKOUT_TYPE_INFO, WorkoutType } from '@/types/workout';
import {
    Check,
    Edit3,
    AlertTriangle,
    Flame,
    Clock,
    MapPin,
    Footprints,
    Dumbbell
} from 'lucide-react';

// 추출 결과 타입
interface ExtractionResult {
    success: boolean;
    data?: Partial<Workout>;
    confidence: number;
    rawResponse?: string;
    error?: {
        code: string;
        message: string;
    };
}

interface WorkoutExtractionResultProps {
    result: ExtractionResult;
    onConfirm: (workout: Workout) => void;
    onEdit: () => void;
    onCancel: () => void;
}

// 신뢰도 레벨
function getConfidenceLevel(confidence: number): { level: 'high' | 'medium' | 'low'; label: string; color: string } {
    if (confidence >= 85) return { level: 'high', label: '정확', color: 'text-green-600 bg-green-100' };
    if (confidence >= 60) return { level: 'medium', label: '추정', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'low', label: '확인 필요', color: 'text-red-600 bg-red-100' };
}

export function WorkoutExtractionResult({
    result,
    onConfirm,
    onEdit,
    onCancel
}: WorkoutExtractionResultProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(result.data || {});

    if (!result.success || !result.data) {
        return (
            <div className="bg-red-50 rounded-2xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                    운동 데이터를 인식하지 못했습니다
                </h3>
                <p className="text-sm text-red-600 mb-4">
                    {result.error?.message || '다른 스크린샷을 시도해주세요'}
                </p>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    const data = isEditing ? editedData : result.data;
    const typeInfo = WORKOUT_TYPE_INFO[data.activityType as WorkoutType] || WORKOUT_TYPE_INFO.other;
    const confidence = getConfidenceLevel(result.confidence);

    const handleConfirm = () => {
        const workout: Workout = {
            id: 'workout_' + Date.now(),
            userId: 'current_user',
            activityType: data.activityType as WorkoutType || 'other',
            activityName: data.activityName,
            durationMinutes: data.durationMinutes || 0,
            caloriesBurned: data.caloriesBurned || null,
            distanceKm: data.distanceKm || null,
            steps: data.steps || null,
            elevationGainM: data.elevationGainM || null,
            weightTrainingData: data.weightTrainingData || null,
            cardioData: data.cardioData || null,
            activityDate: data.activityDate || new Date().toISOString().split('T')[0],
            activityTime: data.activityTime,
            sourceApp: data.sourceApp || 'other',
            sourceImageUrl: null,
            extractionConfidence: result.confidence,
            createdAt: new Date().toISOString()
        };
        onConfirm(workout);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* 헤더 */}
            <div
                className="p-4 text-white"
                style={{ backgroundColor: typeInfo.color }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{typeInfo.emoji}</span>
                        <div>
                            <h3 className="text-xl font-bold">
                                {data.activityName || typeInfo.label}
                            </h3>
                            <p className="text-white/80 text-sm">
                                {(data.sourceApp || '').toUpperCase() || '직접 입력'}
                            </p>
                        </div>
                    </div>
                    <span className={'px-3 py-1 rounded-full text-sm font-medium ' + confidence.color}>
                        {confidence.label}
                    </span>
                </div>
            </div>

            {/* 메인 데이터 */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* 시간 */}
                    <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <Clock className="w-4 h-4" />
                            운동 시간
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editedData.durationMinutes || ''}
                                onChange={(e) => setEditedData({ ...editedData, durationMinutes: parseInt(e.target.value) || 0 })}
                                className="text-2xl font-bold w-full bg-white border rounded px-2 py-1"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                {data.durationMinutes}분
                            </p>
                        )}
                    </div>

                    {/* 칼로리 */}
                    <div className="bg-orange-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                            <Flame className="w-4 h-4" />
                            소모 칼로리
                        </div>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editedData.caloriesBurned || ''}
                                onChange={(e) => setEditedData({ ...editedData, caloriesBurned: parseInt(e.target.value) || 0 })}
                                className="text-2xl font-bold w-full bg-white border rounded px-2 py-1"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-orange-600">
                                {data.caloriesBurned || '?'} kcal
                            </p>
                        )}
                    </div>

                    {/* 거리 (유산소) */}
                    {(data.distanceKm || data.activityType === 'running' || data.activityType === 'cycling') && (
                        <div className="bg-blue-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                                <MapPin className="w-4 h-4" />
                                이동 거리
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {(data.distanceKm || 0).toFixed(1)} km
                            </p>
                        </div>
                    )}

                    {/* 걸음수 */}
                    {data.steps && (
                        <div className="bg-green-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                                <Footprints className="w-4 h-4" />
                                걸음수
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {(data.steps || 0).toLocaleString()}
                            </p>
                        </div>
                    )}

                    {/* 웨이트 트레이닝 */}
                    {data.weightTrainingData && (
                        <div className="col-span-2 bg-purple-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
                                <Dumbbell className="w-4 h-4" />
                                웨이트 트레이닝
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                                    총 {data.weightTrainingData.totalSets}세트
                                </span>
                                {data.weightTrainingData.muscleGroups.map((muscle: string) => (
                                    <span
                                        key={muscle}
                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                    >
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 신뢰도 안내 */}
                {confidence.level !== 'high' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-xl flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-700">
                            일부 데이터가 정확하지 않을 수 있습니다. 필요시 수정해주세요.
                        </p>
                    </div>
                )}
            </div>

            {/* 액션 버튼 */}
            <div className="p-4 bg-gray-50 flex gap-3">
                <button
                    onClick={() => {
                        if (isEditing) {
                            setIsEditing(false);
                        } else {
                            setIsEditing(true);
                            onEdit();
                        }
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white flex items-center justify-center gap-2"
                >
                    <Edit3 className="w-5 h-5" />
                    {isEditing ? '수정 완료' : '수정하기'}
                </button>
                <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold text-white hover:from-green-600 hover:to-emerald-700 flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    저장하기
                </button>
            </div>
        </div>
    );
}
