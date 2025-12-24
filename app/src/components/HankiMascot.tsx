'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useHankiStore } from '@/store';
import { HankiEmotion } from '@/types';

interface HankiMascotProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showMessage?: boolean;
    animate?: boolean;
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
};

const emotionExpressions: Record<HankiEmotion, { eyes: string; mouth: string; extras?: string }> = {
    default: { eyes: '◕ ◕', mouth: '◡', extras: '' },
    happy: { eyes: '◕ ◕', mouth: '▽', extras: '✨' },
    excited: { eyes: '★ ★', mouth: 'ᗜ', extras: '🎉' },
    cheering: { eyes: '◕ ◕', mouth: '▽', extras: '💪' },
    worried: { eyes: '◔ ◔', mouth: '︵', extras: '💦' },
    sad: { eyes: '◕̩̩ ◕̩̩', mouth: '︵', extras: '😢' },
    upset: { eyes: '· ·', mouth: '︵', extras: '' },
    touched: { eyes: '◕ ◕', mouth: '▽', extras: '😭💕' },
};

export default function HankiMascot({
    size = 'md',
    showMessage = true,
    animate = true
}: HankiMascotProps) {
    const { emotion, message, evolutionStage } = useHankiStore();
    const expression = emotionExpressions[emotion];

    // Evolution stage affects appearance
    const getEvolutionContent = () => {
        switch (evolutionStage) {
            case 1:
                return null; // Just rice bowl
            case 2:
                return (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-xs">
                        🥬
                    </div>
                );
            case 3:
                return (
                    <>
                        <div className="absolute -right-2 top-1/3 text-xs">🥬</div>
                        <div className="absolute -left-2 top-1/3 text-xs">🍳</div>
                        <div className="absolute -right-1 bottom-1/3 text-xs">🥢</div>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="absolute -right-3 top-1/3 text-sm">🥬</div>
                        <div className="absolute -left-3 top-1/3 text-sm">🍳</div>
                        <div className="absolute -right-2 bottom-1/4 text-sm">🍖</div>
                        <div className="absolute -left-2 bottom-1/4 text-sm">🥢</div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs">
                            ✨👑✨
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const showSteam = emotion === 'happy' || emotion === 'excited' || emotion === 'touched';

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                className={`hanki-container ${sizeClasses[size]}`}
                animate={animate ? {
                    y: emotion === 'excited' ? [0, -10, 0] : [0, -5, 0],
                } : {}}
                transition={{
                    duration: emotion === 'excited' ? 0.5 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Steam effect */}
                <AnimatePresence>
                    {showSteam && (
                        <>
                            <motion.div
                                className="absolute -top-4 left-1/4 w-2 h-4 bg-gray-300/40 rounded-full blur-sm"
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 0.6, 0], y: -15 }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className="absolute -top-4 left-1/2 w-3 h-5 bg-gray-300/40 rounded-full blur-sm"
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 0.6, 0], y: -20 }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                            <motion.div
                                className="absolute -top-4 right-1/4 w-2 h-4 bg-gray-300/40 rounded-full blur-sm"
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 0.6, 0], y: -15 }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Bowl */}
                <div className="relative w-full h-full">
                    {/* Bowl body */}
                    <div
                        className={`absolute bottom-0 w-full h-3/4 rounded-b-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg 
              ${evolutionStage === 4 ? 'from-yellow-400 to-yellow-600' : ''}`}
                    />

                    {/* Rice (top part) */}
                    <div className="absolute top-1/4 w-full h-1/2 bg-gradient-to-b from-white to-gray-100 rounded-t-full shadow-inner">
                        {/* Face */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {/* Eyes */}
                            <motion.div
                                className="text-gray-800 font-bold tracking-widest"
                                style={{ fontSize: size === 'xl' ? '1.2rem' : size === 'lg' ? '1rem' : '0.8rem' }}
                                animate={emotion === 'happy' || emotion === 'excited' ? {
                                    scale: [1, 1.1, 1],
                                } : {}}
                                transition={{ duration: 0.5, repeat: emotion === 'excited' ? Infinity : 0 }}
                            >
                                {expression.eyes}
                            </motion.div>

                            {/* Blush */}
                            {(emotion === 'happy' || emotion === 'excited' || emotion === 'touched') && (
                                <div className="absolute flex justify-between w-3/4" style={{ top: '55%' }}>
                                    <div className="w-2 h-1 bg-pink-300 rounded-full opacity-60" />
                                    <div className="w-2 h-1 bg-pink-300 rounded-full opacity-60" />
                                </div>
                            )}

                            {/* Mouth */}
                            <motion.div
                                className="text-gray-800 mt-0.5"
                                style={{ fontSize: size === 'xl' ? '1rem' : size === 'lg' ? '0.8rem' : '0.6rem' }}
                                animate={emotion === 'excited' ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3, repeat: Infinity }}
                            >
                                {expression.mouth}
                            </motion.div>
                        </div>
                    </div>

                    {/* Arms (when cheering or touching) */}
                    {(emotion === 'cheering' || emotion === 'touched' || emotion === 'excited') && (
                        <>
                            <motion.div
                                className="absolute bottom-1/3 -left-3 text-lg"
                                animate={{ rotate: [-10, 20, -10] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                💪
                            </motion.div>
                            <motion.div
                                className="absolute bottom-1/3 -right-3 text-lg"
                                animate={{ rotate: [10, -20, 10] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                            >
                                💪
                            </motion.div>
                        </>
                    )}

                    {/* Upset - turned back */}
                    {emotion === 'upset' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center text-2xl"
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: 180 }}
                        >
                            😤
                        </motion.div>
                    )}

                    {/* Evolution extras */}
                    {getEvolutionContent()}
                </div>

                {/* Emotion extras */}
                {expression.extras && (
                    <motion.span
                        className="absolute -top-2 -right-2 text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.3 }}
                    >
                        {expression.extras}
                    </motion.span>
                )}
            </motion.div>

            {/* Message bubble */}
            {showMessage && message && (
                <motion.div
                    className="bg-white rounded-2xl px-4 py-2 shadow-soft max-w-xs text-center relative"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Speech bubble tail */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                    <p className="text-text-primary text-sm font-medium relative z-10">
                        {message}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
