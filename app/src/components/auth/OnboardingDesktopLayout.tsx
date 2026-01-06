'use client';

import { motion } from 'framer-motion';
import OnboardingProgressSidebar from './OnboardingProgressSidebar';
import HankiMascot from '../HankiMascot';

interface OnboardingDesktopLayoutProps {
    currentStep: number;
    totalSteps: number;
    children: React.ReactNode;
    onSkip: () => void;
}

const STEP_ILLUSTRATIONS: Record<number, { emoji: string; title: string; subtitle: string }> = {
    1: {
        emoji: '🎯',
        title: '목표를 향해 나아가요',
        subtitle: '건강한 식습관의 첫 걸음',
    },
    2: {
        emoji: '📊',
        title: '맞춤 영양 분석',
        subtitle: '정확한 정보로 최적의 플랜을',
    },
    3: {
        emoji: '🏃',
        title: '나의 라이프스타일',
        subtitle: '활동량에 맞춘 칼로리 계산',
    },
    4: {
        emoji: '🥗',
        title: '거의 다 왔어요!',
        subtitle: '당신만의 맞춤 식단을 준비해요',
    },
};

export default function OnboardingDesktopLayout({
    currentStep,
    totalSteps,
    children,
    onSkip,
}: OnboardingDesktopLayoutProps) {
    const illustration = STEP_ILLUSTRATIONS[currentStep] || STEP_ILLUSTRATIONS[1];

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding & Progress */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-coral-50 via-white to-sage-50 p-12 flex-col" data-testid="onboarding-sidebar">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-12">
                    <span className="text-2xl">🍚</span>
                    <span className="font-bold text-xl text-gray-900">오늘한끼</span>
                </div>

                {/* Progress Sidebar */}
                <div className="flex-1 flex flex-col justify-center">
                    <OnboardingProgressSidebar
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                </div>

                {/* Step Illustration */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-auto pt-12"
                >
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
                        <div className="flex items-center gap-6">
                            <motion.div
                                className="text-6xl"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                            >
                                {illustration.emoji}
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {illustration.title}
                                </h3>
                                <p className="text-gray-600">
                                    {illustration.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Mascot - Optional floating mascot */}
                <motion.div
                    className="absolute bottom-8 left-8"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <HankiMascot size="md" />
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">
                {/* Desktop Header */}
                <header className="hidden lg:flex items-center justify-end p-6 border-b border-gray-100">
                    <button
                        onClick={onSkip}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        data-testid="skip-button"
                    >
                        건너뛰기
                    </button>
                </header>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                {/* Keyboard hints for desktop */}
                <div className="hidden lg:flex items-center justify-center gap-6 p-4 border-t border-gray-100 text-sm text-gray-400">
                    <span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                        {' '}다음 단계
                    </span>
                    <span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                        {' '}이전 단계
                    </span>
                </div>
            </div>
        </div>
    );
}
