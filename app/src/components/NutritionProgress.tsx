'use client';

import { motion } from 'framer-motion';

interface NutritionProgressProps {
    label: string;
    current: number;
    goal: number;
    unit?: string;
    color: 'orange' | 'green' | 'blue' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    showPercentage?: boolean;
}

const colorClasses = {
    orange: 'from-orange-400 to-orange-500',
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    purple: 'from-purple-400 to-purple-500',
};

const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
};

export function NutritionBar({
    label,
    current,
    goal,
    unit = '',
    color,
    size = 'md',
    showPercentage = true
}: NutritionProgressProps) {
    const percentage = Math.min((current / goal) * 100, 100);
    const isOverGoal = current > goal;

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-text-primary">{label}</span>
                <span className={`${isOverGoal ? 'text-red-500' : 'text-text-secondary'}`}>
                    {current.toFixed(0)}{unit} / {goal}{unit}
                    {showPercentage && (
                        <span className="ml-1 text-text-muted">
                            ({percentage.toFixed(0)}%)
                        </span>
                    )}
                </span>
            </div>
            <div className={`nutrition-bar ${sizeClasses[size]}`}>
                <motion.div
                    className={`nutrition-bar-fill bg-gradient-to-r ${colorClasses[color]} ${isOverGoal ? 'bg-red-500' : ''}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

interface CircularProgressProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    showValue?: boolean;
    unit?: string;
}

export function CircularProgress({
    value,
    max,
    size = 120,
    strokeWidth = 12,
    color = '#FF9500',
    label,
    showValue = true,
    unit = '',
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((value / max) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showValue && (
                    <span className="text-2xl font-bold text-text-primary">
                        {value.toFixed(0)}
                    </span>
                )}
                {unit && (
                    <span className="text-xs text-text-secondary">{unit}</span>
                )}
                {label && (
                    <span className="text-sm text-text-secondary">{label}</span>
                )}
            </div>
        </div>
    );
}

interface MacroCirclesProps {
    calories: { current: number; goal: number };
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fat: { current: number; goal: number };
}

export function MacroCircles({ calories, protein, carbs, fat }: MacroCirclesProps) {
    return (
        <div className="flex justify-around items-end py-4">
            {/* Main Calorie Circle */}
            <div className="flex flex-col items-center">
                <CircularProgress
                    value={calories.current}
                    max={calories.goal}
                    size={140}
                    strokeWidth={14}
                    color="#FF9500"
                    unit="kcal"
                    label="칼로리"
                />
            </div>

            {/* Macro Circles */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <CircularProgress
                        value={protein.current}
                        max={protein.goal}
                        size={50}
                        strokeWidth={6}
                        color="#22C55E"
                        showValue={false}
                    />
                    <div className="text-sm">
                        <div className="font-medium text-text-primary">단백질</div>
                        <div className="text-text-secondary">{protein.current}g / {protein.goal}g</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <CircularProgress
                        value={carbs.current}
                        max={carbs.goal}
                        size={50}
                        strokeWidth={6}
                        color="#3B82F6"
                        showValue={false}
                    />
                    <div className="text-sm">
                        <div className="font-medium text-text-primary">탄수화물</div>
                        <div className="text-text-secondary">{carbs.current}g / {carbs.goal}g</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <CircularProgress
                        value={fat.current}
                        max={fat.goal}
                        size={50}
                        strokeWidth={6}
                        color="#A855F7"
                        showValue={false}
                    />
                    <div className="text-sm">
                        <div className="font-medium text-text-primary">지방</div>
                        <div className="text-text-secondary">{fat.current}g / {fat.goal}g</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
