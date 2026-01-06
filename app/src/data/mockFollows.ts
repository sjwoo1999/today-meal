// Mock Follow Relationships
import { SimpleUser } from '@/types';
import { MOCK_USERS } from './mockUsers';

export interface FollowRelationship {
    followerId: string;
    followingId: string;
    createdAt: Date;
}

// Mock follow relationships
export const mockFollowRelationships: FollowRelationship[] = [
    // Current user (u_001) follows these users
    { followerId: 'u_001', followingId: 'u_002', createdAt: new Date('2024-11-01') },
    { followerId: 'u_001', followingId: 'u_003', createdAt: new Date('2024-11-05') },
    { followerId: 'u_001', followingId: 'u_005', createdAt: new Date('2024-11-10') },

    // These users follow current user (u_001)
    { followerId: 'u_004', followingId: 'u_001', createdAt: new Date('2024-10-20') },
    { followerId: 'u_006', followingId: 'u_001', createdAt: new Date('2024-10-25') },
    { followerId: 'u_007', followingId: 'u_001', createdAt: new Date('2024-11-02') },
    { followerId: 'u_008', followingId: 'u_001', createdAt: new Date('2024-11-15') },

    // Other relationships
    { followerId: 'u_002', followingId: 'u_005', createdAt: new Date('2024-09-01') },
    { followerId: 'u_003', followingId: 'u_002', createdAt: new Date('2024-09-15') },
    { followerId: 'u_005', followingId: 'u_008', createdAt: new Date('2024-10-01') },
    { followerId: 'u_006', followingId: 'u_002', createdAt: new Date('2024-10-10') },
];

// Get followers of a user
export function getFollowers(userId: string): SimpleUser[] {
    const followerIds = mockFollowRelationships
        .filter(rel => rel.followingId === userId)
        .map(rel => rel.followerId);

    return MOCK_USERS.filter(user => followerIds.includes(user.id));
}

// Get users that a user is following
export function getFollowing(userId: string): SimpleUser[] {
    const followingIds = mockFollowRelationships
        .filter(rel => rel.followerId === userId)
        .map(rel => rel.followingId);

    return MOCK_USERS.filter(user => followingIds.includes(user.id));
}

// Check if user A follows user B
export function isFollowing(followerId: string, followingId: string): boolean {
    return mockFollowRelationships.some(
        rel => rel.followerId === followerId && rel.followingId === followingId
    );
}

// Get follower count
export function getFollowerCount(userId: string): number {
    return mockFollowRelationships.filter(rel => rel.followingId === userId).length;
}

// Get following count
export function getFollowingCount(userId: string): number {
    return mockFollowRelationships.filter(rel => rel.followerId === userId).length;
}
