'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import HankiMascot from '../HankiMascot';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import OnboardingDesktopLayout from './OnboardingDesktopLayout';

interface OnboardingPageProps {
    onComplete: () => void;
    onSkip: () => void;
}

const TOTAL_STEPS = 4;

const goalOptions = [
    { id: 'lose', label: '체중 감량', description: '건강하게 살 빼기', emoji: '🏃' },
    { id: 'maintain', label: '체중 유지', description: '현재 체중 유지하기', emoji: '⚖️' },
    { id: 'gain', label: '체중 증가', description: '건강하게 근육 늘리기', emoji: '💪' },
];

const activityOptions = [
    { id: 'sedentary', label: '거의 안 움직임', description: '주로 앉아서 생활', multiplier: 1.2 },
    { id: 'light', label: '가벼운 활동', description: '주 1-2회 가벼운 운동', multiplier: 1.375 },
    { id: 'moderate', label: '보통 활동', description: '주 3-5회 운동', multiplier: 1.55 },
    { id: 'active', label: '활발한 활동', description: '주 6-7회 운동', multiplier: 1.725 },
    { id: 'very_active', label: '매우 활발', description: '운동선수 수준', multiplier: 1.9 },
];

const tagOptions = [
    { id: 'vegetarian', label: '채식', category: 'diet' },
    { id: 'vegan', label: '비건', category: 'diet' },
    { id: 'keto', label: '키토', category: 'diet' },
    { id: 'lowcarb', label: '저탄수화물', category: 'diet' },
    { id: 'highprotein', label: '고단백', category: 'diet' },
    { id: 'gluten', label: '글루텐', category: 'allergy' },
    { id: 'dairy', label: '유제품', category: 'allergy' },
    { id: 'nuts', label: '견과류', category: 'allergy' },
    { id: 'seafood', label: '해산물', category: 'allergy' },
    { id: 'eggs', label: '계란', category: 'allergy' },
];

export default function OnboardingPage({ onComplete, onSkip }: OnboardingPageProps) {
    const { onboardingStep, setOnboardingStep, updateOnboardingData, completeOnboarding, onboardingData } = useAuthStore();
    const { isDesktopOrLarger } = useBreakpoint();

    const [selectedGoal, setSelectedGoal] = useState(onboardingData.goal || '');
    const [height, setHeight] = useState(onboardingData.bodyInfo?.height?.toString() || '');
    const [weight, setWeight] = useState(onboardingData.bodyInfo?.weight?.toString() || '');
    const [age, setAge] = useState(onboardingData.bodyInfo?.age?.toString() || '');
    const [gender, setGender] = useState(onboardingData.bodyInfo?.gender || '');
    const [activityLevel, setActivityLevel] = useState(onboardingData.activityLevel || '');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleNext = useCallback(() => {
        // Save current step data
        switch (onboardingStep) {
            case 1:
                updateOnboardingData({ goal: selectedGoal as 'lose' | 'maintain' | 'gain' });
                break;
            case 2:
                updateOnboardingData({
                    bodyInfo: {
                        height: parseInt(height),
                        weight: parseInt(weight),
                        age: parseInt(age),
                        gender: gender as 'male' | 'female' | 'other',
                    },
                });
                break;
            case 3:
                updateOnboardingData({ activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' });
                break;
            case 4:
                updateOnboardingData({
                    tags: {
                        allergies: selectedTags.filter(t => tagOptions.find(o => o.id === t)?.category === 'allergy'),
                        preferences: selectedTags.filter(t => tagOptions.find(o => o.id === t)?.category === 'diet'),
                        dislikes: [],
                    }
                });
                completeOnboarding();
                onComplete();
                return;
        }

        if (onboardingStep < TOTAL_STEPS) {
            setOnboardingStep((onboardingStep + 1) as 1 | 2 | 3 | 4);
        }
    }, [onboardingStep, selectedGoal, height, weight, age, gender, activityLevel, selectedTags, updateOnboardingData, completeOnboarding, onComplete, setOnboardingStep]);

    const handleBack = useCallback(() => {
        if (onboardingStep > 1) {
            setOnboardingStep((onboardingStep - 1) as 1 | 2 | 3 | 4);
        }
    }, [onboardingStep, setOnboardingStep]);

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId]
        );
    };

    const canProceed = useCallback(() => {
        switch (onboardingStep) {
            case 1: return !!selectedGoal;
            case 2: return height && weight && age && gender;
            case 3: return !!activityLevel;
            case 4: return true; // Tags are optional
            default: return false;
        }
    }, [onboardingStep, selectedGoal, height, weight, age, gender, activityLevel]);

    // Keyboard navigation for desktop
    useEffect(() => {
        if (!isDesktopOrLarger) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                // Allow Enter only when all fields are filled
                if (e.key === 'Enter' && canProceed()) {
                    e.preventDefault();
                    handleNext();
                }
                return;
            }

            if (e.key === 'Enter' && canProceed()) {
                e.preventDefault();
                handleNext();
            } else if (e.key === 'Escape' && onboardingStep > 1) {
                e.preventDefault();
                handleBack();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDesktopOrLarger, onboardingStep, canProceed, handleNext, handleBack]);

    const getMascotMessage = () => {
        switch (onboardingStep) {
            case 1: return '목표를 알려주세요!';
            case 2: return '신체 정보를 입력해주세요';
            case 3: return '평소 활동량은 어떠세요?';
            case 4: return '거의 다 왔어요!';
            default: return '시작해볼까요?';
        }
    };

    // Animation variants based on platform
    const stepVariants = isDesktopOrLarger
        ? {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
        }
        : {
            initial: { x: 50, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: -50, opacity: 0 },
        };

    // Step Content - Shared between layouts
    const stepContent = (
        <AnimatePresence mode="wait">
            <motion.div
                key={onboardingStep}
                initial={stepVariants.initial}
                animate={stepVariants.animate}
                exit={stepVariants.exit}
                transition={{ duration: 0.2 }}
                className="space-y-4"
            >
                {/* Step 1: Goal */}
                {onboardingStep === 1 && (
                    <div className="space-y-3">
                        <h2 className={`font-bold text-gray-900 mb-4 ${isDesktopOrLarger ? 'text-2xl' : 'text-xl'}`}>
                            어떤 목표를 가지고 계세요?
                        </h2>
                        <div className={isDesktopOrLarger ? 'grid grid-cols-3 gap-4' : 'space-y-3'}>
                            {goalOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedGoal(option.id)}
                                    data-testid={`goal-${option.id}`}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        selectedGoal === option.id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${isDesktopOrLarger ? 'flex flex-col items-center text-center aspect-square justify-center' : 'w-full'}`}
                                >
                                    <span className={`${isDesktopOrLarger ? 'text-4xl mb-3' : 'text-2xl mr-3'}`}>
                                        {option.emoji}
                                    </span>
                                    <div className={isDesktopOrLarger ? '' : 'flex-1'}>
                                        <p className="font-semibold text-gray-900">{option.label}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    {selectedGoal === option.id && !isDesktopOrLarger && (
                                        <Check className="ml-auto w-5 h-5 text-green-500" />
                                    )}
                                    {selectedGoal === option.id && isDesktopOrLarger && (
                                        <div className="mt-2">
                                            <Check className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Body Info */}
                {onboardingStep === 2 && (
                    <div className="space-y-4">
                        <h2 className={`font-bold text-gray-900 mb-4 ${isDesktopOrLarger ? 'text-2xl' : 'text-xl'}`}>
                            신체 정보를 알려주세요
                        </h2>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'male', label: '남성', emoji: '👨' },
                                    { id: 'female', label: '여성', emoji: '👩' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setGender(option.id)}
                                        data-testid={`gender-${option.id}`}
                                        className={`p-3 rounded-xl border-2 transition-all ${
                                            gender === option.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-xl mr-2">{option.emoji}</span>
                                        <span className="font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: 2-column grid for inputs */}
                        <div className={isDesktopOrLarger ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                            {/* Height */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">키 (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="170"
                                    data-testid="height-input"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition-colors"
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="65"
                                    data-testid="weight-input"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className={isDesktopOrLarger ? 'w-1/2' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="25"
                                data-testid="age-input"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Activity Level */}
                {onboardingStep === 3 && (
                    <div className="space-y-3">
                        <h2 className={`font-bold text-gray-900 mb-4 ${isDesktopOrLarger ? 'text-2xl' : 'text-xl'}`}>
                            평소 활동량은 어떤가요?
                        </h2>
                        <div className={isDesktopOrLarger ? 'grid grid-cols-1 gap-3' : 'space-y-3'}>
                            {activityOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setActivityLevel(option.id)}
                                    data-testid={`activity-${option.id}`}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                        activityLevel === option.id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{option.label}</p>
                                            <p className="text-sm text-gray-500">{option.description}</p>
                                        </div>
                                        {activityLevel === option.id && (
                                            <Check className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Tags */}
                {onboardingStep === 4 && (
                    <div className="space-y-4">
                        <h2 className={`font-bold text-gray-900 mb-2 ${isDesktopOrLarger ? 'text-2xl' : 'text-xl'}`}>
                            식단 선호도와 알레르기가 있나요?
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            선택사항이에요. 나중에 설정에서 변경할 수 있어요.
                        </p>

                        {/* Desktop: side by side, Mobile: stacked */}
                        <div className={isDesktopOrLarger ? 'grid grid-cols-2 gap-6' : 'space-y-6'}>
                            {/* Diet preferences */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    식단 선호
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tagOptions
                                        .filter(t => t.category === 'diet')
                                        .map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                data-testid={`tag-${tag.id}`}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                    selectedTags.includes(tag.id)
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {tag.label}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Allergies */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    알레르기 (해당하는 것 선택)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tagOptions
                                        .filter(t => t.category === 'allergy')
                                        .map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                data-testid={`tag-${tag.id}`}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                    selectedTags.includes(tag.id)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {tag.label}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );

    // Form content with button
    const formWithButton = (
        <>
            {/* Mascot greeting - Mobile only or Desktop inline */}
            {!isDesktopOrLarger && (
                <motion.div
                    key={onboardingStep}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4 mb-6"
                >
                    <HankiMascot size="sm" />
                    <div>
                        <p className="text-gray-900 font-semibold">{getMascotMessage()}</p>
                        <p className="text-gray-500 text-sm">Step {onboardingStep} of {TOTAL_STEPS}</p>
                    </div>
                </motion.div>
            )}

            {stepContent}

            {/* Next Button */}
            <div className={`${isDesktopOrLarger ? 'mt-8' : 'mt-6'}`}>
                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    data-testid="next-button"
                    className={`bg-green-500 hover:bg-green-600 disabled:bg-gray-300 ${
                        isDesktopOrLarger ? 'w-auto px-8' : 'w-full'
                    }`}
                >
                    <span>{onboardingStep === TOTAL_STEPS ? '시작하기' : '다음'}</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </>
    );

    // Desktop Layout
    if (isDesktopOrLarger) {
        return (
            <OnboardingDesktopLayout
                currentStep={onboardingStep}
                totalSteps={TOTAL_STEPS}
                onSkip={onSkip}
            >
                {formWithButton}
            </OnboardingDesktopLayout>
        );
    }

    // Mobile Layout
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-100">
                <button
                    onClick={onboardingStep > 1 ? handleBack : onSkip}
                    className="p-2 -ml-2"
                    data-testid="back-button"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex gap-1.5 items-center" data-testid="step-indicator">
                    <span className="sr-only">{onboardingStep}</span>
                    <div className="flex gap-1.5" data-testid="step-dots">
                        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-8 rounded-full transition-colors ${
                                    i < onboardingStep ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => { onSkip(); }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    data-testid="skip-button"
                >
                    건너뛰기
                </button>
            </header>

            <div className="flex-1 p-6 overflow-y-auto">
                {formWithButton}
            </div>
        </div>
    );
}
