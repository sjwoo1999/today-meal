'use client';

import { motion } from 'framer-motion';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';
import { ConfidenceLevel, getConfidenceLevel, getConfidenceLabel } from '@/types/foodAnalysis';

interface ConfidenceBadgeProps {
    /** 신뢰도 (0-100) */
    confidence: number;
    /** 크기 */
    size?: 'sm' | 'md' | 'lg';
    /** 퍼센트 표시 여부 */
    showPercentage?: boolean;
}

const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
};

const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

const levelStyles: Record<ConfidenceLevel, { bg: string; text: string; icon: typeof Check }> = {
    high: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: Check,
    },
    medium: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: AlertCircle,
    },
    low: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: HelpCircle,
    },
};

/**
 * 신뢰도 뱃지 컴포넌트
 * - high (85%+): 초록색, "정확"
 * - medium (60-84%): 노란색, "추정"
 * - low (<60%): 회색, "확인 필요"
 */
export function ConfidenceBadge({
    confidence,
    size = 'md',
    showPercentage = true
}: ConfidenceBadgeProps) {
    const level = getConfidenceLevel(confidence);
    const label = getConfidenceLabel(level);
    const style = levelStyles[level];
    const Icon = style.icon;

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size]}
        ${style.bg}
        ${style.text}
      `}
        >
            <Icon className={iconSizes[size]} />
            <span>{label}</span>
            {showPercentage && (
                <span className="opacity-70">{confidence}%</span>
            )}
        </motion.span>
    );
}

/**
 * 칼로리 범위 표시 컴포넌트
 */
interface CalorieRangeProps {
    calories: number;
    caloriesMin?: number;
    caloriesMax?: number;
    size?: 'sm' | 'md' | 'lg';
}

const calorieTextSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
};

export function CalorieRange({
    calories,
    caloriesMin,
    caloriesMax,
    size = 'md'
}: CalorieRangeProps) {
    const hasRange = caloriesMin !== undefined && caloriesMax !== undefined && caloriesMin !== caloriesMax;

    return (
        <div className="flex items-baseline gap-1">
            {hasRange ? (
                <>
                    <span className={`font-bold text-gray-900 ${calorieTextSizes[size]}`}>
                        {caloriesMin}-{caloriesMax}
                    </span>
                    <span className="text-gray-500 text-sm">kcal</span>
                </>
            ) : (
                <>
                    <span className={`font-bold text-gray-900 ${calorieTextSizes[size]}`}>
                        {calories}
                    </span>
                    <span className="text-gray-500 text-sm">kcal</span>
                </>
            )}
        </div>
    );
}
