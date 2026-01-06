'use client';

import { motion } from 'framer-motion';
import { Check, Target, User, Activity, Utensils } from 'lucide-react';

interface Step {
    id: number;
    name: string;
    title: string;
    icon: React.ReactNode;
}

interface OnboardingProgressSidebarProps {
    currentStep: number;
    totalSteps: number;
}

const STEPS: Step[] = [
    { id: 1, name: 'goal', title: '목표 설정', icon: <Target className="w-5 h-5" /> },
    { id: 2, name: 'body', title: '신체 정보', icon: <User className="w-5 h-5" /> },
    { id: 3, name: 'activity', title: '활동량', icon: <Activity className="w-5 h-5" /> },
    { id: 4, name: 'diet', title: '식이 선호도', icon: <Utensils className="w-5 h-5" /> },
];

export default function OnboardingProgressSidebar({ currentStep }: OnboardingProgressSidebarProps) {
    return (
        <div className="flex flex-col gap-4" data-testid="step-indicator">
            {/* Screen reader only: current step number */}
            <span className="sr-only">{currentStep}</span>
            {STEPS.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isPending = step.id > currentStep;

                return (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                    >
                        {/* Step indicator */}
                        <div className="relative">
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                    isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isCurrent
                                        ? 'bg-coral-500 text-white ring-4 ring-coral-200'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                }}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    step.icon
                                )}
                            </motion.div>

                            {/* Connecting line */}
                            {index < STEPS.length - 1 && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 mt-2">
                                    <motion.div
                                        className={`w-full h-full ${
                                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                        style={{ transformOrigin: 'top' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Step label */}
                        <div className={`transition-colors ${
                            isPending ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                            <p className={`font-semibold ${isCurrent ? 'text-coral-600' : ''}`}>
                                {step.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                {isCompleted ? '완료' : isCurrent ? '진행 중' : '대기'}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
