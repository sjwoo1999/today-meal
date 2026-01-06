/**
 * Challenge Lifecycle Service (SF-004)
 *
 * Manages the complete lifecycle of challenges from creation to completion.
 * Implements state machine pattern for challenge status management.
 */

import type { Challenge, ChallengeParticipant, ChallengeType, ChallengeStatus } from '@/types';

// Re-export ChallengeStatus as ChallengeState for service layer terminology
export type ChallengeState = ChallengeStatus;

// Re-export for convenience
export type { ChallengeType, ChallengeStatus };

export interface ChallengeConfig {
    type: ChallengeType;
    goal: number;
    unit: string;
    duration: number; // days
    minParticipants?: number;
    maxParticipants?: number;
    entryFee?: number; // points
    prizePool?: number;
    rules: string[];
}

export interface ChallengeProgress {
    participantId: string;
    challengeId: string;
    currentValue: number;
    targetValue: number;
    percentage: number;
    lastUpdated: Date;
    dailyProgress: { date: string; value: number }[];
}

export interface ChallengeResult {
    challengeId: string;
    rankings: {
        rank: number;
        participantId: string;
        userName: string;
        finalValue: number;
        reward: number;
    }[];
    totalParticipants: number;
    completionRate: number;
    calculatedAt: Date;
}

// State Transitions
const STATE_TRANSITIONS: Record<ChallengeState, ChallengeState[]> = {
    draft: ['upcoming', 'cancelled'],
    upcoming: ['active', 'cancelled'],
    active: ['calculating', 'cancelled'],
    calculating: ['completed'],
    completed: ['archived'],
    archived: [],
    cancelled: ['archived'],
};

// Main Service Functions
export function canTransitionTo(current: ChallengeState, target: ChallengeState): boolean {
    return STATE_TRANSITIONS[current]?.includes(target) ?? false;
}

export async function createChallenge(
    creatorId: string,
    squadId: string,
    config: ChallengeConfig,
    metadata: {
        title: string;
        description: string;
        emoji: string;
        startDate: Date;
        endDate: Date;
    }
): Promise<Challenge> {
    const challenge: Challenge = {
        id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        squadId,
        title: metadata.title,
        description: metadata.description,
        emoji: metadata.emoji,
        type: config.type,
        goal: config.goal,
        unit: config.unit,
        startDate: metadata.startDate,
        endDate: metadata.endDate,
        participants: 0,
        progress: 0,
        status: 'draft' as ChallengeState,
        createdBy: creatorId,
        rewards: {
            first: Math.floor((config.prizePool || 500) * 0.5),
            second: Math.floor((config.prizePool || 500) * 0.3),
            third: Math.floor((config.prizePool || 500) * 0.2),
            participation: 10,
        },
    };

    return challenge;
}

export async function publishChallenge(challengeId: string): Promise<Challenge | null> {
    // Transition from draft to upcoming
    const challenge = await getChallenge(challengeId);
    if (!challenge) return null;

    if (!canTransitionTo(challenge.status as ChallengeState, 'upcoming')) {
        throw new Error(`Cannot publish challenge in ${challenge.status} state`);
    }

    return { ...challenge, status: 'upcoming' };
}

export async function startChallenge(challengeId: string): Promise<Challenge | null> {
    // Transition from upcoming to active
    const challenge = await getChallenge(challengeId);
    if (!challenge) return null;

    if (!canTransitionTo(challenge.status as ChallengeState, 'active')) {
        throw new Error(`Cannot start challenge in ${challenge.status} state`);
    }

    return { ...challenge, status: 'active' };
}

export async function joinChallenge(
    challengeId: string,
    _userId: string
): Promise<ChallengeParticipant | null> {
    const challenge = await getChallenge(challengeId);
    if (!challenge) return null;

    if (challenge.status !== 'upcoming' && challenge.status !== 'active') {
        throw new Error('Challenge is not accepting participants');
    }

    const participant: ChallengeParticipant = {
        id: `participant_${Date.now()}`,
        challengeId,
        userId: _userId,
        userName: 'User Name', // Would fetch from user service
        joinedAt: new Date(),
        progress: 0,
        goal: challenge.goal,
        rank: 0,
        dailyRecord: [],
    };

    return participant;
}

export async function recordProgress(
    challengeId: string,
    userId: string,
    value: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _metadata?: Record<string, unknown>
): Promise<ChallengeProgress> {
    const today = new Date().toISOString().split('T')[0];

    // Get current progress
    const currentProgress = await getProgress(challengeId, userId);

    const newProgress: ChallengeProgress = {
        participantId: userId,
        challengeId,
        currentValue: currentProgress.currentValue + value,
        targetValue: currentProgress.targetValue,
        percentage: Math.min(((currentProgress.currentValue + value) / currentProgress.targetValue) * 100, 100),
        lastUpdated: new Date(),
        dailyProgress: [
            ...currentProgress.dailyProgress,
            { date: today, value },
        ],
    };

    return newProgress;
}

export async function endChallenge(challengeId: string): Promise<ChallengeResult> {
    const challenge = await getChallenge(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    if (!canTransitionTo(challenge.status as ChallengeState, 'calculating')) {
        throw new Error(`Cannot end challenge in ${challenge.status} state`);
    }

    // Calculate results
    const participants = await getChallengeParticipants(challengeId);
    const rankings = participants
        .sort((a, b) => b.progress - a.progress)
        .map((p, index) => ({
            rank: index + 1,
            participantId: p.userId,
            userName: p.userName,
            finalValue: p.progress,
            reward: index === 0 ? challenge.rewards?.first || 0 :
                    index === 1 ? challenge.rewards?.second || 0 :
                    index === 2 ? challenge.rewards?.third || 0 :
                    challenge.rewards?.participation || 0,
        }));

    const completionRate = participants.filter(p => p.progress >= challenge.goal).length / participants.length;

    return {
        challengeId,
        rankings,
        totalParticipants: participants.length,
        completionRate,
        calculatedAt: new Date(),
    };
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
    // Mock - would fetch from backend
    return {
        id: challengeId,
        squadId: 'squad_1',
        title: '7일 아침 챌린지',
        description: '7일간 매일 아침 식사 기록하기',
        emoji: '🌅',
        type: 'meal_count',
        goal: 7,
        unit: '끼',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 15,
        progress: 45,
        status: 'active',
        rewards: {
            first: 500,
            second: 300,
            third: 200,
            participation: 50,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getChallengeParticipants(_challengeId: string): Promise<ChallengeParticipant[]> {
    // Mock - would fetch from backend
    return [
        {
            id: 'p1',
            userId: 'user_1',
            userName: '건강왕',
            joinedAt: new Date(),
            progress: 85,
            goal: 100,
            rank: 1,
            dailyRecord: [],
        },
        {
            id: 'p2',
            userId: 'user_2',
            userName: '다이어터',
            joinedAt: new Date(),
            progress: 70,
            goal: 100,
            rank: 2,
            dailyRecord: [],
        },
    ];
}

export async function getProgress(_challengeId: string, userId: string): Promise<ChallengeProgress> {
    // Mock - would fetch from backend
    return {
        participantId: userId,
        challengeId: _challengeId,
        currentValue: 4,
        targetValue: 7,
        percentage: 57,
        lastUpdated: new Date(),
        dailyProgress: [
            { date: '2026-01-01', value: 1 },
            { date: '2026-01-02', value: 1 },
            { date: '2026-01-03', value: 1 },
            { date: '2026-01-04', value: 1 },
        ],
    };
}

// Automatic state management
export async function checkAndUpdateChallengeStates(): Promise<void> {
    // This would run as a cron job to update challenge states
    const now = new Date();

    // Check upcoming challenges that should start
    // Check active challenges that should end
    // Archive old completed challenges
    console.log('Challenge states checked at:', now);
}

// Export service
export const challengeService = {
    createChallenge,
    publishChallenge,
    startChallenge,
    joinChallenge,
    recordProgress,
    endChallenge,
    getChallenge,
    getChallengeParticipants,
    getProgress,
    canTransitionTo,
    checkAndUpdateChallengeStates,
    STATE_TRANSITIONS,
};

export default challengeService;
