'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ icon = '📭', title, description, action, className }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}
        >
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>
            )}
            {action && (
                <motion.button
                    onClick={action.onClick}
                    className="px-6 py-2 bg-primary-500 text-white rounded-full font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
}

// 프리셋 컴포넌트들
export function NoPosts({ boardName, onWrite }: { boardName?: string; onWrite?: () => void }) {
    return (
        <EmptyState
            icon="📝"
            title={boardName ? `${boardName}에 글이 없어요` : '게시글이 없어요'}
            description="첫 번째 글을 작성해보세요!"
            action={onWrite ? { label: '글쓰기', onClick: onWrite } : undefined}
        />
    );
}

export function NoComments({ onFocus }: { onFocus?: () => void }) {
    return (
        <EmptyState
            icon="💬"
            title="아직 댓글이 없어요"
            description="첫 번째 댓글을 남겨보세요!"
            action={onFocus ? { label: '댓글 달기', onClick: onFocus } : undefined}
        />
    );
}

export function NoRecordsToday({ onRecord }: { onRecord?: () => void }) {
    return (
        <EmptyState
            icon="📸"
            title="오늘 기록이 없어요"
            description="오늘 먹은 것을 기록해볼까요?"
            action={onRecord ? { label: '기록하기', onClick: onRecord } : undefined}
        />
    );
}

export function NoSearchResults({ query }: { query?: string }) {
    return (
        <EmptyState
            icon="🔍"
            title="검색 결과가 없어요"
            description={query ? `"${query}"에 대한 결과를 찾을 수 없어요` : '다른 키워드로 검색해보세요'}
        />
    );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <EmptyState
            icon="🌐"
            title="연결할 수 없어요"
            description="네트워크 상태를 확인해주세요"
            action={onRetry ? { label: '다시 시도', onClick: onRetry } : undefined}
        />
    );
}

export function NoMyScraps({ onExplore }: { onExplore?: () => void }) {
    return (
        <EmptyState
            icon="🔖"
            title="스크랩한 글이 없어요"
            description="마음에 드는 글을 스크랩해보세요!"
            action={onExplore ? { label: '피드 둘러보기', onClick: onExplore } : undefined}
        />
    );
}

export function NoMyPosts({ onWrite }: { onWrite?: () => void }) {
    return (
        <EmptyState
            icon="📝"
            title="작성한 글이 없어요"
            description="첫 번째 글을 작성해보세요!"
            action={onWrite ? { label: '글쓰기', onClick: onWrite } : undefined}
        />
    );
}

export function NoMyComments({ onExplore }: { onExplore?: () => void }) {
    return (
        <EmptyState
            icon="💬"
            title="작성한 댓글이 없어요"
            description="다른 사용자의 글에 반응해보세요!"
            action={onExplore ? { label: '피드 둘러보기', onClick: onExplore } : undefined}
        />
    );
}
