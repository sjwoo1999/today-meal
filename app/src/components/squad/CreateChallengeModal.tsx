'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Trophy, Flame, Target, Camera } from 'lucide-react';

interface CreateChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    squadId: string;
    onSuccess?: (challengeId: string) => void;
}

type ChallengeType = 'streak' | 'calorie' | 'protein' | 'record';

interface ChallengeFormData {
    type: ChallengeType;
    title: string;
    goal: number;
    duration: '1week' | '2weeks' | '1month';
    rewards: Array<{ rank: number; reward: string }>;
}

const challengeTypes = [
    { id: 'streak' as ChallengeType, label: '연속 기록', icon: Flame, description: 'N일 연속 식사 기록하기', unit: '일', defaultGoal: 7 },
    { id: 'calorie' as ChallengeType, label: '칼로리 달성', icon: Target, description: '일일 칼로리 목표 달성', unit: '일', defaultGoal: 7 },
    { id: 'protein' as ChallengeType, label: '단백질 챌린지', icon: Trophy, description: '단백질 목표 달성하기', unit: '일', defaultGoal: 7 },
    { id: 'record' as ChallengeType, label: '기록 개수', icon: Camera, description: 'N개 식사 기록하기', unit: '개', defaultGoal: 21 },
];

const durations = [
    { id: '1week' as const, label: '1주', days: 7 },
    { id: '2weeks' as const, label: '2주', days: 14 },
    { id: '1month' as const, label: '1개월', days: 30 },
];

const defaultRewards = [
    { rank: 1, reward: '금메달 배지' },
    { rank: 2, reward: '은메달 배지' },
    { rank: 3, reward: '동메달 배지' },
];

const initialFormData: ChallengeFormData = {
    type: 'streak',
    title: '',
    goal: 7,
    duration: '1week',
    rewards: defaultRewards,
};

export default function CreateChallengeModal({ isOpen, onClose, squadId, onSuccess }: CreateChallengeModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ChallengeFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setStep(1);
        setFormData(initialFormData);
        onClose();
    };

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSelectType = (type: ChallengeType) => {
        const typeConfig = challengeTypes.find(t => t.id === type);
        setFormData({
            ...formData,
            type,
            goal: typeConfig?.defaultGoal || 7,
            title: typeConfig?.label || '',
        });
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        // Simulate API call - squadId will be sent to server
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Include squadId in the challenge ID for mock purposes
        const newChallengeId = `challenge_${squadId}_${Date.now()}`;
        setIsSubmitting(false);

        if (onSuccess) {
            onSuccess(newChallengeId);
        }
        handleClose();
    };

    const selectedType = challengeTypes.find(t => t.id === formData.type);
    const selectedDuration = durations.find(d => d.id === formData.duration);

    const canProceed = () => {
        switch (step) {
            case 1: return !!formData.type;
            case 2: return formData.goal > 0;
            case 3: return true;
            default: return true;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <div className="flex items-center gap-2">
                                {step > 1 && (
                                    <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <h2 className="text-lg font-bold">챌린지 만들기</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Step {step}/4</span>
                                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex gap-1 px-4 py-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                        s <= step ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <div className="px-4 py-6 min-h-[400px]">
                            {/* Step 1: Challenge Type */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-1">챌린지 유형 선택</h3>
                                        <p className="text-gray-500 text-sm">어떤 챌린지를 진행할까요?</p>
                                    </div>

                                    <div className="space-y-3">
                                        {challengeTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => handleSelectType(type.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                                    formData.type === type.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    formData.type === type.id ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                    <type.icon className={`w-6 h-6 ${
                                                        formData.type === type.id ? 'text-green-500' : 'text-gray-400'
                                                    }`} />
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="font-medium">{type.label}</p>
                                                    <p className="text-sm text-gray-500">{type.description}</p>
                                                </div>
                                                {formData.type === type.id && (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Goal & Duration */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-1">목표 설정</h3>
                                        <p className="text-gray-500 text-sm">챌린지 목표와 기간을 설정해주세요</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            챌린지 이름
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="예: 7일 연속 기록 챌린지"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            목표: {formData.goal} {selectedType?.unit}
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max={formData.type === 'record' ? 50 : 30}
                                            value={formData.goal}
                                            onChange={(e) => setFormData({ ...formData, goal: parseInt(e.target.value) })}
                                            className="w-full accent-green-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>1{selectedType?.unit}</span>
                                            <span>{formData.type === 'record' ? 50 : 30}{selectedType?.unit}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            챌린지 기간
                                        </label>
                                        <div className="flex gap-2">
                                            {durations.map((duration) => (
                                                <button
                                                    key={duration.id}
                                                    onClick={() => setFormData({ ...formData, duration: duration.id })}
                                                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                                                        formData.duration === duration.id
                                                            ? 'border-green-500 bg-green-50 text-green-600'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {duration.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Rewards */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-1">보상 설정 (선택)</h3>
                                        <p className="text-gray-500 text-sm">챌린지 순위별 보상을 설정해주세요</p>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.rewards.map((reward, index) => (
                                            <div key={reward.rank} className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                                    index === 0 ? 'bg-amber-400' :
                                                    index === 1 ? 'bg-gray-400' :
                                                    'bg-amber-700'
                                                }`}>
                                                    {reward.rank}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={reward.reward}
                                                    onChange={(e) => {
                                                        const newRewards = [...formData.rewards];
                                                        newRewards[index] = { ...reward, reward: e.target.value };
                                                        setFormData({ ...formData, rewards: newRewards });
                                                    }}
                                                    placeholder={`${reward.rank}등 보상`}
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs text-gray-400 text-center">
                                        * 보상은 선택사항이에요. 비워두셔도 괜찮아요!
                                    </p>
                                </motion.div>
                            )}

                            {/* Step 4: Review */}
                            {step === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-1">챌린지 확인</h3>
                                        <p className="text-gray-500 text-sm">설정한 내용을 확인해주세요</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            {selectedType && (
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <selectedType.icon className="w-7 h-7 text-green-500" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-lg">{formData.title || selectedType?.label}</h4>
                                                <p className="text-sm text-gray-500">{selectedType?.description}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4">
                                            <div>
                                                <p className="text-xs text-gray-500">목표</p>
                                                <p className="font-bold text-green-600">
                                                    {formData.goal}{selectedType?.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">기간</p>
                                                <p className="font-bold text-green-600">
                                                    {selectedDuration?.label}
                                                </p>
                                            </div>
                                        </div>

                                        {formData.rewards.some(r => r.reward) && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-sm font-medium mb-2">보상</p>
                                                <div className="flex gap-2">
                                                    {formData.rewards.map((reward, index) => (
                                                        reward.reward && (
                                                            <span
                                                                key={reward.rank}
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    index === 0 ? 'bg-amber-100 text-amber-700' :
                                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                                }`}
                                                            >
                                                                {reward.rank}등: {reward.reward}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-4 border-t">
                            <div className="flex gap-3">
                                <button
                                    onClick={step === 1 ? handleClose : handleBack}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {step === 1 ? '취소' : '이전'}
                                </button>
                                <button
                                    onClick={step === 4 ? handleCreate : handleNext}
                                    disabled={!canProceed() || isSubmitting}
                                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                                        canProceed() && !isSubmitting
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        '만드는 중...'
                                    ) : step === 4 ? (
                                        '챌린지 시작!'
                                    ) : (
                                        <>
                                            다음 <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
