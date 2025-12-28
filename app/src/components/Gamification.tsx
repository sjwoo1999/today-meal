'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useUserStore } from '@/store';
import { Sparkles, Trophy, Flame, Star, PartyPopper } from 'lucide-react';
import { useEffect } from 'react';

// XP Popup Component
export function XPPopup() {
    const { showXPPopup, hideXP } = useUIStore();

    useEffect(() => {
        if (showXPPopup.show) {
            const timer = setTimeout(hideXP, 2000);
            return () => clearTimeout(timer);
        }
    }, [showXPPopup.show, hideXP]);

    return (
        <AnimatePresence>
            {showXPPopup.show && (
                <motion.div
                    className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <div className="flex flex-col items-center gap-1">
                        <motion.div
                            className="text-4xl font-bold text-coral-500 flex items-center gap-2"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sparkles className="w-8 h-8" />
                            +{showXPPopup.amount} XP
                        </motion.div>
                        <span className="text-lg text-text-secondary bg-white/90 px-3 py-1 rounded-full shadow-soft">
                            {showXPPopup.reason}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Confetti Effect
function Confetti() {
    const colors = ['#FF9500', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#FFD700'];
    const confettiPieces = Array.from({ length: 50 });

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiPieces.map((_, index) => {
                const left = Math.random() * 100;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 10 + 5;
                const delay = Math.random() * 0.5;
                const duration = Math.random() * 2 + 2;

                return (
                    <motion.div
                        key={index}
                        className="absolute"
                        style={{
                            left: `${left}%`,
                            top: '-20px',
                            width: size,
                            height: size,
                            backgroundColor: color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                        }}
                        initial={{ y: -20, rotate: 0, opacity: 1 }}
                        animate={{
                            y: window.innerHeight + 50,
                            rotate: Math.random() * 720 - 360,
                            opacity: [1, 1, 0],
                        }}
                        transition={{
                            duration,
                            delay,
                            ease: 'easeOut',
                        }}
                    />
                );
            })}
        </div>
    );
}

// Celebration Modal
export function CelebrationModal() {
    const { showCelebration, hideCelebration } = useUIStore();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (showCelebration.show) {
            const timer = setTimeout(hideCelebration, 3000);
            return () => clearTimeout(timer);
        }
    }, [showCelebration.show, hideCelebration]);

    const getCelebrationContent = () => {
        switch (showCelebration.type) {
            case 'daily_goal':
                return {
                    icon: <Trophy className="w-16 h-16 text-yellow-500" />,
                    title: '일일 목표 달성! 🎉',
                    message: '완벽한 하루였어! 한끼가 감동받았어 💕',
                };
            case 'reverse_complete':
                return {
                    icon: <Star className="w-16 h-16 text-coral-500" />,
                    title: '역추산 플랜 성공! ⭐',
                    message: '계획대로 완벽하게 해냈어!',
                };
            case 'streak_7':
                return {
                    icon: <Flame className="w-16 h-16 text-red-500" />,
                    title: '7일 연속 달성! 🔥',
                    message: '일주일 완식! 너무 대단해!',
                };
            case 'level_up':
                return {
                    icon: <PartyPopper className="w-16 h-16 text-purple-500" />,
                    title: `레벨 ${user?.gamification.level} 달성!`,
                    message: '축하해! 한끼도 함께 성장했어!',
                };
            default:
                return {
                    icon: <Sparkles className="w-16 h-16 text-coral-500" />,
                    title: '축하해! 🎊',
                    message: '잘했어!',
                };
        }
    };

    const content = getCelebrationContent();

    return (
        <AnimatePresence>
            {showCelebration.show && (
                <>
                    <Confetti />
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={hideCelebration}
                    >
                        <motion.div
                            className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center"
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className="flex justify-center mb-4"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                            >
                                {content.icon}
                            </motion.div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                {content.title}
                            </h2>
                            <p className="text-text-secondary">
                                {content.message}
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Streak Badge
interface StreakBadgeProps {
    streak: number;
    size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
    const sizeClasses = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
    };

    if (streak === 0) return null;

    return (
        <motion.div
            className={`badge-streak ${sizeClasses[size]} flex items-center gap-1`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Flame className="w-4 h-4" />
            <span>{streak}일</span>
        </motion.div>
    );
}

// Level Badge
interface LevelBadgeProps {
    level: number;
    title: string;
    showTitle?: boolean;
}

export function LevelBadge({ level, title, showTitle = true }: LevelBadgeProps) {
    const getBgColor = () => {
        if (level >= 10) return 'from-yellow-400 to-yellow-600';
        if (level >= 7) return 'from-purple-400 to-purple-600';
        if (level >= 4) return 'from-blue-400 to-blue-600';
        return 'from-green-400 to-green-600';
    };

    return (
        <div className="flex items-center gap-2">
            <motion.div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getBgColor()} 
                    flex items-center justify-center text-white font-bold shadow-soft`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {level}
            </motion.div>
            {showTitle && (
                <div className="text-sm">
                    <div className="font-semibold text-text-primary">Lv.{level}</div>
                    <div className="text-text-secondary text-xs">{title}</div>
                </div>
            )}
        </div>
    );
}

// XP Progress Bar
interface XPProgressBarProps {
    currentXP: number;
    currentLevelXP: number;
    nextLevelXP: number;
}

export function XPProgressBar({ currentXP, currentLevelXP, nextLevelXP }: XPProgressBarProps) {
    const progressInLevel = currentXP - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    const percentage = (progressInLevel / levelRange) * 100;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-secondary">
                <span>{progressInLevel} XP</span>
                <span>{levelRange - progressInLevel} XP to next</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-coral-400 to-coral-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
