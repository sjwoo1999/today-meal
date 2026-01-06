/**
 * Common Components - Barrel Export
 *
 * Reusable UI components for screen states, loading, and empty states.
 */

// Skeleton Components
export {
    Skeleton,
    TextSkeleton,
    AvatarSkeleton,
    PostCardSkeleton,
    FeedPostSkeleton,
    HotPostCarouselSkeleton,
    CommentSkeleton,
    ProfileHeaderSkeleton,
    ToolsHubSkeleton,
} from './Skeleton/Skeleton';

// Empty State Components
export {
    EmptyState,
    NoPosts,
    NoComments,
    NoRecordsToday,
    NoSearchResults,
    NetworkError as EmptyNetworkError,
    NoMyScraps,
    NoMyPosts,
    NoMyComments,
} from './EmptyState/EmptyState';

// Error State Components
export {
    ErrorState,
    NetworkError,
    ServerError,
    AuthError,
    ForbiddenError,
    NotFoundError,
    TimeoutError,
} from './ErrorState/ErrorState';
export type { ErrorType } from './ErrorState/ErrorState';

// State Container Components
export {
    StateContainer,
    useViewState,
    FeedStateContainer,
    ChallengeStateContainer,
    ShopStateContainer,
    ProfileStateContainer,
} from './StateContainer/StateContainer';
export type { ViewState } from './StateContainer/StateContainer';

// Static Map
export { default as StaticMap } from './StaticMap';

// Notification Badge
export {
    NotificationBadge,
    InlineNotificationBadge,
} from './NotificationBadge/NotificationBadge';

// Point Display
export {
    PointDisplay,
    TransactionIndicator,
    InlinePoints,
} from './PointDisplay/PointDisplay';
