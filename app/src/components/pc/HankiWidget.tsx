'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Calendar, X, MessageCircle } from 'lucide-react';
import { useHankiStore, useUIStore } from '@/store';
import { HankiEmotion } from '@/types';
import Image from 'next/image';

const emotionEmojis: Record<HankiEmotion, string> = {
    default: '😊',
    happy: '😄',
    excited: '🤩',
    cheering: '💪',
    worried: '😟',
    sad: '😢',
    upset: '😤',
    touched: '🥹',
};

// 감정별 마스코트 이미지 경로
const emotionImages: Record<HankiEmotion, string> = {
    default: '/mascot/hanki_default.png',
    happy: '/mascot/hanki_happy.png',
    excited: '/mascot/hanki_excited.png',
    cheering: '/mascot/hanki_cheering.png',
    worried: '/mascot/hanki_worried.png',
    sad: '/mascot/hanki_sad.png',
    upset: '/mascot/hanki_upset.png',
    touched: '/mascot/hanki_touched.png',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const idleMessages = [
    '오늘도 힘내자! 💪',
    '뭐 먹을지 고민돼? 🤔',
    '한끼가 응원해! 🎉',
    '잘하고 있어! ⭐',
    '맛있는 거 먹자! 🍽️',
];

export default function HankiWidget() {
    const { emotion, message, evolutionStage } = useHankiStore();
    const { setActiveTab } = useUIStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(message);
    const [isIdle, setIsIdle] = useState(false);

    // Idle animation - random jumps
    useEffect(() => {
        const idleInterval = setInterval(() => {
            setIsIdle(true);
            setTimeout(() => setIsIdle(false), 500);
        }, 30000); // Every 30 seconds

        return () => clearInterval(idleInterval);
    }, []);

    // Time-based messages
    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            if (hour === 12) {
                setCurrentMessage('점심시간이야! 🍚');
            } else if (hour === 19) {
                setCurrentMessage('저녁 기록 잊지 마! 🌙');
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Update message when store changes
    useEffect(() => {
        setCurrentMessage(message);
    }, [message]);

    return (
        <>
            {/* Mini Widget */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 hidden lg:flex"
                onClick={() => setIsExpanded(!isExpanded)}
                animate={{
                    y: isIdle ? [0, -10, 0] : 0,
                }}
                transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="w-20 h-20 bg-white rounded-full shadow-lg border-2 border-green-200 flex items-center justify-center relative overflow-hidden">
                    <Image
                        src={emotionImages[emotion]}
                        alt="한끼 마스코트"
                        width={64}
                        height={64}
                        className="object-contain"
                    />

                    {/* Notification dot */}
                    {currentMessage && !isExpanded && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                        />
                    )}
                </div>
            </motion.button>

            {/* Expanded Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 lg:hidden bg-black/20"
                            onClick={() => setIsExpanded(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-28 right-6 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hidden lg:block"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 relative">
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="text-center">
                                    <motion.div
                                        className="w-24 h-24 mx-auto mb-2"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                        }}
                                    >
                                        <Image
                                            src={emotionImages[emotion]}
                                            alt="한끼 마스코트"
                                            width={96}
                                            height={96}
                                            className="object-contain"
                                        />
                                    </motion.div>
                                    <h3 className="font-bold text-lg">한끼</h3>
                                    <p className="text-green-100 text-sm">Lv.{evolutionStage} • 단계 {evolutionStage}</p>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <MessageCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div className="flex-1 bg-white rounded-2xl rounded-tl-none p-3 shadow-sm">
                                        <p className="text-gray-700">{currentMessage}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="p-4 space-y-2">
                                <button
                                    onClick={() => {
                                        setActiveTab('record');
                                        setIsExpanded(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                >
                                    <Camera className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-700">식사 기록하기</span>
                                    <span className="ml-auto text-xs text-green-500">+10 XP</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setActiveTab('planner');
                                        setIsExpanded(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                >
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-blue-700">역추산 플래너</span>
                                    <span className="ml-auto text-xs text-blue-500">+10 XP</span>
                                </button>
                            </div>

                            {/* Status */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>현재 기분: {emotionEmojis[emotion]}</span>
                                    <span>진화 단계: {evolutionStage}/4</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
