'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ===== Design System v2.0: Button Component =====

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-coral-500 text-white hover:bg-coral-600 active:scale-95 shadow-glow',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-100',
    outline: 'border-2 border-coral-500 text-coral-500 bg-transparent hover:bg-coral-50 active:scale-95',
    ghost: 'text-coral-500 bg-transparent hover:bg-coral-50 active:scale-95',
    success: 'bg-sage-500 text-white hover:bg-sage-600 active:scale-95 shadow-glow-green',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-[52px] px-6 text-lg',
};

/**
 * Button Component - Design System v2.0
 * 
 * Variants:
 * - primary: Coral background, main CTA
 * - secondary: Gray background, secondary actions
 * - outline: Coral border, alternative options
 * - ghost: Transparent, text links
 * - success: Sage green, completion/confirmation
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            className,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={twMerge(
                    clsx(
                        // Base styles
                        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
                        // Variant styles
                        variantStyles[variant],
                        // Size styles
                        sizeStyles[size],
                        // Disabled styles
                        (disabled || isLoading) && 'opacity-50 cursor-not-allowed pointer-events-none',
                        // Custom className
                        className
                    )
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
