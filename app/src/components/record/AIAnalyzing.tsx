'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HankiMascot from '../HankiMascot';

interface AIAnalyzingProps {
    onComplete: () => void;
}

const analysisSteps = [
    { text: '이미지 분석 중...', duration: 800 },
    { text: '음식 인식 중...', duration: 1000 },
    { text: '영양 정보 계산 중...', duration: 800 },
    { text: '거의 완료됐어요!', duration: 400 },
];

export default function AIAnalyzing({ onComplete }: AIAnalyzingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let stepTimeout: NodeJS.Timeout;

        const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);
        const progressIncrement = 100 / (totalDuration / 50);

        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + progressIncrement, 100));
        }, 50);

        const runSteps = async () => {
            for (let i = 0; i < analysisSteps.length; i++) {
                setCurrentStep(i);
                await new Promise(resolve => {
                    stepTimeout = setTimeout(resolve, analysisSteps[i].duration);
                });
            }
            onComplete();
        };

        runSteps();

        return () => {
            clearTimeout(stepTimeout);
            clearInterval(progressInterval);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="ai-analyzing"
            className="fixed inset-0 z-50 bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6"
        >
            {/* Mascot Animation */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, -5, 5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="mb-8"
            >
                <HankiMascot size="lg" />
            </motion.div>

            {/* Analysis Text */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    한끼가 분석하고 있어요
                </h2>
                <p className="text-gray-600">
                    {analysisSteps[currentStep].text}
                </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'linear' }}
                    />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                    {Math.round(progress)}%
                </p>
            </div>

            {/* Fun Facts */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <p className="text-sm text-gray-400">
                    💡 한끼 AI는 500가지 이상의 음식을 인식할 수 있어요
                </p>
            </motion.div>
        </motion.div>
    );
}
