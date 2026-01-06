'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
    count: number;
    onClick?: () => void;
    showBell?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function NotificationBadge({
    count,
    onClick,
    showBell = true,
    size = 'md',
    className = '',
}: NotificationBadgeProps) {
    const sizeClasses = {
        sm: {
            container: 'w-8 h-8',
            icon: 'w-4 h-4',
            badge: 'min-w-[16px] h-4 text-[10px] -top-1 -right-1',
        },
        md: {
            container: 'w-10 h-10',
            icon: 'w-5 h-5',
            badge: 'min-w-[18px] h-[18px] text-xs -top-1 -right-1',
        },
        lg: {
            container: 'w-12 h-12',
            icon: 'w-6 h-6',
            badge: 'min-w-[20px] h-5 text-xs -top-1 -right-1',
        },
    };

    const classes = sizeClasses[size];

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="notification-badge"
            className={`relative flex items-center justify-center rounded-full
                bg-gray-100 hover:bg-gray-200 transition-colors ${classes.container} ${className}`}
        >
            {showBell && (
                <Bell className={`${classes.icon} text-gray-600`} />
            )}

            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`absolute ${classes.badge} flex items-center justify-center
                            px-1 rounded-full bg-red-500 text-white font-medium`}
                    >
                        {count > 99 ? '99+' : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// Compact inline version for headers
interface InlineBadgeProps {
    count: number;
    className?: string;
}

export function InlineNotificationBadge({ count, className = '' }: InlineBadgeProps) {
    if (count === 0) return null;

    return (
        <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`inline-flex items-center justify-center min-w-[18px] h-[18px]
                px-1.5 rounded-full bg-red-500 text-white text-xs font-medium ${className}`}
        >
            {count > 99 ? '99+' : count}
        </motion.span>
    );
}

export default NotificationBadge;
