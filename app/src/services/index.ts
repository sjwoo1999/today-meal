/**
 * Service Layer - Barrel Export
 *
 * Exports all service modules for easy import throughout the application.
 * Each service handles a specific domain of business logic.
 */

// Point Transaction Service (SF-001)
export { default as pointService } from './pointService';
export type {
    TransactionType,
    PointSource,
    PointTransactionState,
    PointTransaction,
    PointBalance,
} from './pointService';
export { POINT_RULES } from './pointService';

// Feed Distribution Service (SF-002)
export { default as feedService } from './feedService';
export type {
    FeedState,
    FeedConfig,
    ScoredPost,
    FeedRequest,
    FeedResponse,
} from './feedService';
export { FEED_WEIGHTS } from './feedService';

// AI Moderation Service (SF-003)
export { default as moderationService } from './moderationService';
export type {
    ModerationStatus,
    ModerationFlagType,
    ModerationFlag,
    ModerationResult,
    ContentAnalysis,
    TextAnalysis,
} from './moderationService';

// Challenge Lifecycle Service (SF-004)
export { default as challengeService } from './challengeService';
export type {
    ChallengeState,
    ChallengeType,
    ChallengeConfig,
    ChallengeProgress,
    ChallengeResult,
} from './challengeService';

// Notification Service (SF-005)
export { default as notificationService } from './notificationService';
export type {
    NotificationChannel,
    NotificationCategory,
    NotificationState,
    Notification,
    NotificationPreferences,
} from './notificationService';
export { DEFAULT_PREFERENCES } from './notificationService';

// Re-export all services as a single object for convenience
export const services = {
    point: async () => (await import('./pointService')).default,
    feed: async () => (await import('./feedService')).default,
    moderation: async () => (await import('./moderationService')).default,
    challenge: async () => (await import('./challengeService')).default,
    notification: async () => (await import('./notificationService')).default,
};

export default services;
