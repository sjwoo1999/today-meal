'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface PointDisplayProps {
    balance: number;
    pending?: number;
    expiringSoon?: number;
    showDetails?: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PointDisplay({
    balance,
    pending,
    expiringSoon,
    showDetails = false,
    onClick,
    size = 'md',
    className = '',
}: PointDisplayProps) {
    const sizeClasses = {
        sm: {
            container: 'px-2 py-1',
            icon: 'w-3.5 h-3.5',
            text: 'text-sm',
            subtext: 'text-[10px]',
        },
        md: {
            container: 'px-3 py-1.5',
            icon: 'w-4 h-4',
            text: 'text-base',
            subtext: 'text-xs',
        },
        lg: {
            container: 'px-4 py-2',
            icon: 'w-5 h-5',
            text: 'text-lg',
            subtext: 'text-sm',
        },
    };

    const classes = sizeClasses[size];

    const formattedBalance = balance.toLocaleString();

    return (
        <motion.button
            onClick={onClick}
            whileHover={onClick ? { scale: 1.02 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            data-testid="point-display"
            className={`inline-flex items-center gap-1.5 rounded-full
                bg-gradient-to-r from-amber-50 to-amber-100
                border border-amber-200 ${classes.container} ${className}
                ${onClick ? 'cursor-pointer hover:border-amber-300' : 'cursor-default'}`}
        >
            <Coins className={`${classes.icon} text-amber-500`} />
            <span className={`font-semibold text-amber-700 ${classes.text}`}>
                {formattedBalance}
            </span>

            {showDetails && (
                <div className="flex items-center gap-2 ml-1 pl-2 border-l border-amber-200">
                    {pending !== undefined && pending > 0 && (
                        <div className="flex items-center gap-0.5 text-blue-600">
                            <Clock className="w-3 h-3" />
                            <span className={classes.subtext}>+{pending}</span>
                        </div>
                    )}
                    {expiringSoon !== undefined && expiringSoon > 0 && (
                        <div className="flex items-center gap-0.5 text-red-500">
                            <span className={classes.subtext}>-{expiringSoon} 만료예정</span>
                        </div>
                    )}
                </div>
            )}
        </motion.button>
    );
}

// Transaction indicator component
interface TransactionIndicatorProps {
    type: 'earn' | 'spend';
    amount: number;
    description?: string;
    className?: string;
}

export function TransactionIndicator({
    type,
    amount,
    description,
    className = '',
}: TransactionIndicatorProps) {
    const isEarn = type === 'earn';

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full
                ${isEarn ? 'bg-green-100' : 'bg-red-100'}`}>
                {isEarn ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                )}
            </div>
            <div className="flex-1">
                {description && (
                    <p className="text-sm text-gray-700">{description}</p>
                )}
                <p className={`font-semibold ${isEarn ? 'text-green-600' : 'text-red-600'}`}>
                    {isEarn ? '+' : '-'}{amount.toLocaleString()}P
                </p>
            </div>
        </div>
    );
}

// Compact inline point display
interface InlinePointsProps {
    balance: number;
    className?: string;
}

export function InlinePoints({ balance, className = '' }: InlinePointsProps) {
    return (
        <span className={`inline-flex items-center gap-1 text-amber-600 ${className}`}>
            <Coins className="w-3.5 h-3.5" />
            <span className="font-medium">{balance.toLocaleString()}</span>
        </span>
    );
}

export default PointDisplay;
