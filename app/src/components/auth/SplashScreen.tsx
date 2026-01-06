'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import HankiMascot from '../HankiMascot';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
            {/* PC에서 중앙 정렬, 최대 너비 제한 */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center w-full max-w-md"
            >
                {/* Mascot with animation */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="mb-6"
                >
                    <HankiMascot size="lg" />
                </motion.div>

                {/* App Name */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                >
                    오늘<span className="text-green-500">한끼</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-gray-500 text-center"
                >
                    나만의 웰니스 파트너
                </motion.p>

                {/* Loading indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-12"
                >
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
