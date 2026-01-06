'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from '../EmptyState/EmptyState';
import { ErrorState, ErrorType } from '../ErrorState/ErrorState';

export type ViewState = 'loading' | 'error' | 'empty' | 'success';

interface StateContainerProps {
    state: ViewState;
    children: ReactNode;

    // Loading props
    loadingComponent?: ReactNode;
    loadingText?: string;

    // Error props
    error?: Error | string | null;
    errorType?: ErrorType;
    errorTitle?: string;
    errorDescription?: string;
    onRetry?: () => void;

    // Empty props
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: {
        label: string;
        onClick: () => void;
    };

    // Container styling
    className?: string;
    minHeight?: string;
}

export function StateContainer({
    state,
    children,
    loadingComponent,
    loadingText,
    error,
    errorType = 'unknown',
    errorTitle,
    errorDescription,
    onRetry,
    emptyIcon = '📭',
    emptyTitle = '데이터가 없어요',
    emptyDescription,
    emptyAction,
    className,
    minHeight = 'min-h-[200px]',
}: StateContainerProps) {
    return (
        <div className={className}>
            <AnimatePresence mode="wait">
                {state === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex flex-col items-center justify-center ${minHeight}`}
                    >
                        {loadingComponent || (
                            <DefaultLoadingState text={loadingText} />
                        )}
                    </motion.div>
                )}

                {state === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={minHeight}
                    >
                        <ErrorState
                            type={errorType}
                            title={errorTitle}
                            description={errorDescription}
                            error={error}
                            onRetry={onRetry}
                        />
                    </motion.div>
                )}

                {state === 'empty' && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={minHeight}
                    >
                        <EmptyState
                            icon={emptyIcon}
                            title={emptyTitle}
                            description={emptyDescription}
                            action={emptyAction}
                        />
                    </motion.div>
                )}

                {state === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DefaultLoadingState({ text }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
                <motion.div
                    className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
            {text && (
                <p className="text-sm text-gray-500">{text}</p>
            )}
        </div>
    );
}

// Hook for easier state management
export function useViewState<T>(
    data: T | null | undefined,
    isLoading: boolean,
    error: Error | null
): ViewState {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!data || (Array.isArray(data) && data.length === 0)) return 'empty';
    return 'success';
}

// Preset State Containers
interface FeedStateContainerProps {
    state: ViewState;
    children: ReactNode;
    onRetry?: () => void;
    onExplore?: () => void;
}

export function FeedStateContainer({ state, children, onRetry, onExplore }: FeedStateContainerProps) {
    return (
        <StateContainer
            state={state}
            onRetry={onRetry}
            emptyIcon="📸"
            emptyTitle="피드가 비어있어요"
            emptyDescription="팔로우하고 피드를 채워보세요!"
            emptyAction={onExplore ? { label: '둘러보기', onClick: onExplore } : undefined}
            minHeight="min-h-[400px]"
        >
            {children}
        </StateContainer>
    );
}

interface ChallengeStateContainerProps {
    state: ViewState;
    children: ReactNode;
    onRetry?: () => void;
    onDiscover?: () => void;
}

export function ChallengeStateContainer({ state, children, onRetry, onDiscover }: ChallengeStateContainerProps) {
    return (
        <StateContainer
            state={state}
            onRetry={onRetry}
            emptyIcon="🏆"
            emptyTitle="새로운 챌린지가 곧 시작됩니다"
            emptyDescription="지금 참여 가능한 챌린지를 찾아보세요!"
            emptyAction={onDiscover ? { label: '챌린지 찾기', onClick: onDiscover } : undefined}
            minHeight="min-h-[300px]"
        >
            {children}
        </StateContainer>
    );
}

interface ShopStateContainerProps {
    state: ViewState;
    children: ReactNode;
    onRetry?: () => void;
}

export function ShopStateContainer({ state, children, onRetry }: ShopStateContainerProps) {
    return (
        <StateContainer
            state={state}
            onRetry={onRetry}
            emptyIcon="🛍️"
            emptyTitle="상품 준비 중입니다"
            emptyDescription="곧 새로운 상품이 입고됩니다!"
            minHeight="min-h-[300px]"
        >
            {children}
        </StateContainer>
    );
}

interface ProfileStateContainerProps {
    state: ViewState;
    children: ReactNode;
    onRetry?: () => void;
    onRecord?: () => void;
}

export function ProfileStateContainer({ state, children, onRetry, onRecord }: ProfileStateContainerProps) {
    return (
        <StateContainer
            state={state}
            onRetry={onRetry}
            emptyIcon="📝"
            emptyTitle="아직 기록이 없어요"
            emptyDescription="첫 번째 식사를 기록해보세요!"
            emptyAction={onRecord ? { label: '기록하기', onClick: onRecord } : undefined}
            minHeight="min-h-[200px]"
        >
            {children}
        </StateContainer>
    );
}

export default StateContainer;
