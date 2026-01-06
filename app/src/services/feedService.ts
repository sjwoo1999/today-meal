/**
 * Feed Distribution Service (SF-002)
 *
 * Handles feed algorithm, content scoring, and personalized feed generation.
 * Implements weighted scoring system for content relevance.
 */

import type { Post } from '@/types';

// Feed Algorithm Weights
export const FEED_WEIGHTS = {
    relevance: 0.30,    // Content relevance to user preferences
    freshness: 0.25,    // How recent the content is
    engagement: 0.25,   // Likes, comments, shares
    following: 0.20,    // From followed users
} as const;

// Feed States
export type FeedState = 'loading' | 'loaded' | 'refreshing' | 'loadingMore' | 'error' | 'empty';

export interface FeedConfig {
    pageSize: number;
    maxAge: number; // Hours
    minEngagement: number;
    boostFollowing: boolean;
    filterMealType?: string[];
}

export interface ScoredPost extends Post {
    score: number;
    relevanceScore: number;
    freshnessScore: number;
    engagementScore: number;
    followingScore: number;
}

export interface FeedRequest {
    userId: string;
    cursor?: string;
    limit?: number;
    filter?: {
        mealType?: string[];
        timeRange?: 'today' | 'week' | 'month' | 'all';
        onlyFollowing?: boolean;
    };
}

export interface FeedResponse {
    posts: ScoredPost[];
    nextCursor?: string;
    hasMore: boolean;
    totalCount: number;
}

// Scoring Functions
function calculateFreshnessScore(createdAt: Date | string): number {
    const now = new Date();
    const postDate = new Date(createdAt);
    const hoursAgo = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

    // Decay function: score decreases over time
    if (hoursAgo < 1) return 1.0;
    if (hoursAgo < 6) return 0.9;
    if (hoursAgo < 24) return 0.7;
    if (hoursAgo < 72) return 0.5;
    if (hoursAgo < 168) return 0.3; // 1 week
    return 0.1;
}

function calculateEngagementScore(likes: number, comments: number): number {
    // Normalize engagement scores (0-1)
    const likeScore = Math.min(likes / 100, 1);
    const commentScore = Math.min(comments / 20, 1);

    // Comments weighted slightly higher as they indicate more engagement
    return (likeScore * 0.4) + (commentScore * 0.6);
}

function calculateRelevanceScore(
    post: Post,
    userPreferences: { mealTypes?: string[]; tags?: string[] }
): number {
    let score = 0.5; // Base relevance

    // Meal type matching
    if (userPreferences.mealTypes?.includes(post.mealType || '')) {
        score += 0.3;
    }

    // Tag matching (if implemented)
    if (userPreferences.tags?.some(tag => post.content?.includes(tag))) {
        score += 0.2;
    }

    return Math.min(score, 1);
}

function calculateFollowingScore(
    authorId: string,
    followingList: string[]
): number {
    return followingList.includes(authorId) ? 1.0 : 0.0;
}

// Main Feed Functions
export async function generateFeed(request: FeedRequest): Promise<FeedResponse> {
    const { userId, limit = 20, filter } = request;

    // Fetch user preferences and following list
    const userPreferences = await getUserPreferences(userId);
    const followingList = await getFollowingList(userId);

    // Fetch candidate posts (would be from backend)
    const candidatePosts = await fetchCandidatePosts(filter);

    // Score each post
    const scoredPosts: ScoredPost[] = candidatePosts.map(post => {
        const relevanceScore = calculateRelevanceScore(post, userPreferences);
        const freshnessScore = calculateFreshnessScore(post.createdAt);
        const engagementScore = calculateEngagementScore(post.likes, post.comments);
        const followingScore = calculateFollowingScore(post.author.id, followingList);

        const totalScore =
            (relevanceScore * FEED_WEIGHTS.relevance) +
            (freshnessScore * FEED_WEIGHTS.freshness) +
            (engagementScore * FEED_WEIGHTS.engagement) +
            (followingScore * FEED_WEIGHTS.following);

        return {
            ...post,
            score: totalScore,
            relevanceScore,
            freshnessScore,
            engagementScore,
            followingScore,
        };
    });

    // Sort by score (descending)
    scoredPosts.sort((a, b) => b.score - a.score);

    // Apply pagination
    const paginatedPosts = scoredPosts.slice(0, limit);

    return {
        posts: paginatedPosts,
        nextCursor: paginatedPosts.length === limit ? `cursor_${Date.now()}` : undefined,
        hasMore: paginatedPosts.length === limit,
        totalCount: scoredPosts.length,
    };
}

export async function refreshFeed(userId: string): Promise<FeedResponse> {
    return generateFeed({ userId, limit: 20 });
}

export async function loadMoreFeed(
    userId: string,
    cursor: string
): Promise<FeedResponse> {
    return generateFeed({ userId, cursor, limit: 20 });
}

// Helper functions (mock implementations)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getUserPreferences(_userId: string): Promise<{ mealTypes?: string[]; tags?: string[] }> {
    // Mock - would fetch from backend
    return {
        mealTypes: ['lunch', 'dinner'],
        tags: ['다이어트', '건강식'],
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getFollowingList(_userId: string): Promise<string[]> {
    // Mock - would fetch from backend
    return ['user_2', 'user_3', 'user_5'];
}

async function fetchCandidatePosts(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter?: FeedRequest['filter']
): Promise<Post[]> {
    // Mock posts - would fetch from backend
    const mockPosts: Post[] = [
        {
            id: 'post_1',
            author: {
                id: 'user_2',
                name: '건강왕',
                avatar: '',
                level: 15,
                badges: [],
            },
            content: '오늘 점심은 샐러드로 가볍게!',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            mealType: 'lunch',
            likes: 45,
            comments: 8,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isLiked: false,
        },
        {
            id: 'post_2',
            author: {
                id: 'user_3',
                name: '단백질러버',
                avatar: '',
                level: 22,
                badges: [],
            },
            content: '운동 후 단백질 보충!',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            mealType: 'snack',
            likes: 89,
            comments: 12,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isLiked: true,
        },
    ];

    return mockPosts;
}

// Feed Analytics
export async function trackFeedInteraction(
    userId: string,
    postId: string,
    interactionType: 'view' | 'like' | 'comment' | 'share' | 'save'
): Promise<void> {
    // Track interaction for algorithm improvement
    console.log(`Feed interaction: ${userId} ${interactionType} ${postId}`);
}

// Export service
export const feedService = {
    generateFeed,
    refreshFeed,
    loadMoreFeed,
    trackFeedInteraction,
    FEED_WEIGHTS,
};

export default feedService;
