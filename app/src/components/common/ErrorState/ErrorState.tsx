'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, WifiOff, ServerCrash, Lock, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ErrorType =
    | 'network'
    | 'server'
    | 'auth'
    | 'forbidden'
    | 'notFound'
    | 'timeout'
    | 'unknown';

interface ErrorStateProps {
    type?: ErrorType;
    title?: string;
    description?: string;
    error?: Error | string | null;
    onRetry?: () => void;
    retryLabel?: string;
    showIcon?: boolean;
    className?: string;
}

const errorConfig: Record<ErrorType, { icon: typeof AlertCircle; emoji: string; defaultTitle: string; defaultDescription: string }> = {
    network: {
        icon: WifiOff,
        emoji: '🌐',
        defaultTitle: '네트워크 연결 오류',
        defaultDescription: '인터넷 연결을 확인해주세요.',
    },
    server: {
        icon: ServerCrash,
        emoji: '🔧',
        defaultTitle: '서버 오류',
        defaultDescription: '잠시 후 다시 시도해주세요.',
    },
    auth: {
        icon: Lock,
        emoji: '🔒',
        defaultTitle: '인증이 필요해요',
        defaultDescription: '로그인 후 이용해주세요.',
    },
    forbidden: {
        icon: Ban,
        emoji: '🚫',
        defaultTitle: '접근 권한이 없어요',
        defaultDescription: '이 페이지에 접근할 수 없어요.',
    },
    notFound: {
        icon: AlertCircle,
        emoji: '🔍',
        defaultTitle: '페이지를 찾을 수 없어요',
        defaultDescription: '요청하신 페이지가 존재하지 않아요.',
    },
    timeout: {
        icon: RefreshCw,
        emoji: '⏱️',
        defaultTitle: '요청 시간 초과',
        defaultDescription: '서버 응답이 너무 오래 걸려요.',
    },
    unknown: {
        icon: AlertCircle,
        emoji: '😢',
        defaultTitle: '오류가 발생했어요',
        defaultDescription: '문제가 지속되면 고객센터에 문의해주세요.',
    },
};

export function ErrorState({
    type = 'unknown',
    title,
    description,
    error,
    onRetry,
    retryLabel = '다시 시도',
    showIcon = true,
    className,
}: ErrorStateProps) {
    const config = errorConfig[type];
    const Icon = config.icon;

    const displayTitle = title || config.defaultTitle;
    const displayDescription = description || config.defaultDescription;
    const errorMessage = error instanceof Error ? error.message : error;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex flex-col items-center justify-center py-12 px-6 text-center',
                className
            )}
        >
            {showIcon && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="mb-4"
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-red-500" />
                    </div>
                </motion.div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-2">{displayTitle}</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">{displayDescription}</p>

            {errorMessage && process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-red-400 mb-4 font-mono bg-red-50 px-3 py-2 rounded-lg max-w-sm overflow-hidden text-ellipsis">
                    {errorMessage}
                </p>
            )}

            {onRetry && (
                <motion.button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RefreshCw className="w-4 h-4" />
                    {retryLabel}
                </motion.button>
            )}
        </motion.div>
    );
}

// Preset Error States
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return <ErrorState type="network" onRetry={onRetry} />;
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
    return <ErrorState type="server" onRetry={onRetry} />;
}

export function AuthError({ onLogin }: { onLogin?: () => void }) {
    return <ErrorState type="auth" onRetry={onLogin} retryLabel="로그인하기" />;
}

export function ForbiddenError({ onGoBack }: { onGoBack?: () => void }) {
    return <ErrorState type="forbidden" onRetry={onGoBack} retryLabel="돌아가기" />;
}

export function NotFoundError({ onGoHome }: { onGoHome?: () => void }) {
    return <ErrorState type="notFound" onRetry={onGoHome} retryLabel="홈으로" />;
}

export function TimeoutError({ onRetry }: { onRetry?: () => void }) {
    return <ErrorState type="timeout" onRetry={onRetry} />;
}

export default ErrorState;
