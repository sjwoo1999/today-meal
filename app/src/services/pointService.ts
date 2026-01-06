/**
 * Point Transaction Service (SF-001)
 *
 * Handles all point-related transactions including earning, spending, expiration, and refunds.
 * Implements state machine pattern for transaction lifecycle management.
 */

// Transaction Types
export type TransactionType = 'earn' | 'spend' | 'expire' | 'refund';
export type PointSource =
    | 'meal_record'
    | 'challenge'
    | 'streak'
    | 'purchase'
    | 'referral'
    | 'daily_login'
    | 'achievement'
    | 'squad_bonus';

// State Machine
export type PointTransactionState = 'idle' | 'processing' | 'success' | 'failed' | 'rollback';

export interface PointTransaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    source: PointSource;
    timestamp: Date;
    metadata: Record<string, unknown>;
    state: PointTransactionState;
    description?: string;
    relatedEntityId?: string; // challengeId, orderId, etc.
}

export interface PointBalance {
    userId: string;
    total: number;
    available: number;
    pending: number;
    expiringSoon: number; // Points expiring within 30 days
    lastUpdated: Date;
}

// Point Earning Rules
export const POINT_RULES = {
    meal_record: {
        base: 10,
        withPhoto: 5,
        withNutrition: 3,
        firstOfDay: 10,
    },
    streak: {
        day3: 20,
        day7: 50,
        day14: 100,
        day30: 200,
    },
    challenge: {
        participation: 10,
        dailyGoal: 15,
        completion: 100,
        winner: 500,
    },
    social: {
        firstFollow: 10,
        receiveLike: 1,
        receiveComment: 2,
    },
    daily_login: 5,
    referral: 100,
} as const;

// Service Functions
export async function createTransaction(
    userId: string,
    type: TransactionType,
    amount: number,
    source: PointSource,
    metadata: Record<string, unknown> = {}
): Promise<PointTransaction> {
    const transaction: PointTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        amount,
        source,
        timestamp: new Date(),
        metadata,
        state: 'processing',
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));

    // Transition to success state
    transaction.state = 'success';

    return transaction;
}

export async function earnPoints(
    userId: string,
    source: PointSource,
    multiplier: number = 1,
    metadata: Record<string, unknown> = {}
): Promise<PointTransaction> {
    let baseAmount = 0;

    switch (source) {
        case 'meal_record':
            baseAmount = POINT_RULES.meal_record.base;
            if (metadata.hasPhoto) baseAmount += POINT_RULES.meal_record.withPhoto;
            if (metadata.hasNutrition) baseAmount += POINT_RULES.meal_record.withNutrition;
            if (metadata.firstOfDay) baseAmount += POINT_RULES.meal_record.firstOfDay;
            break;
        case 'daily_login':
            baseAmount = POINT_RULES.daily_login;
            break;
        case 'referral':
            baseAmount = POINT_RULES.referral;
            break;
        case 'challenge':
            baseAmount = POINT_RULES.challenge.participation;
            break;
        default:
            baseAmount = 10;
    }

    const amount = Math.floor(baseAmount * multiplier);
    return createTransaction(userId, 'earn', amount, source, metadata);
}

export async function spendPoints(
    userId: string,
    amount: number,
    source: PointSource,
    metadata: Record<string, unknown> = {}
): Promise<PointTransaction | null> {
    // Check balance first
    const balance = await getBalance(userId);

    if (balance.available < amount) {
        return null; // Insufficient balance
    }

    return createTransaction(userId, 'spend', amount, source, metadata);
}

export async function getBalance(userId: string): Promise<PointBalance> {
    // Mock balance - would fetch from backend
    return {
        userId,
        total: 1250,
        available: 1200,
        pending: 50,
        expiringSoon: 100,
        lastUpdated: new Date(),
    };
}

export async function getTransactionHistory(
    userId: string,
    options: {
        type?: TransactionType;
        source?: PointSource;
        limit?: number;
        offset?: number;
        startDate?: Date;
        endDate?: Date;
    } = {}
): Promise<PointTransaction[]> {
    // Mock history - would fetch from backend
    const mockTransactions: PointTransaction[] = [
        {
            id: 'txn_1',
            userId,
            type: 'earn',
            amount: 28,
            source: 'meal_record',
            timestamp: new Date(Date.now() - 3600000),
            metadata: { hasPhoto: true, hasNutrition: true },
            state: 'success',
            description: '점심 기록 완료',
        },
        {
            id: 'txn_2',
            userId,
            type: 'earn',
            amount: 50,
            source: 'streak',
            timestamp: new Date(Date.now() - 86400000),
            metadata: { streakDays: 7 },
            state: 'success',
            description: '7일 연속 기록 달성!',
        },
        {
            id: 'txn_3',
            userId,
            type: 'spend',
            amount: 200,
            source: 'purchase',
            timestamp: new Date(Date.now() - 172800000),
            metadata: { itemId: 'item_1', itemName: '프리미엄 테마' },
            state: 'success',
            description: '프리미엄 테마 구매',
        },
    ];

    return mockTransactions.slice(0, options.limit || 10);
}

export async function processStreakBonus(userId: string, streakDays: number): Promise<PointTransaction | null> {
    let bonus = 0;

    if (streakDays >= 30) bonus = POINT_RULES.streak.day30;
    else if (streakDays >= 14) bonus = POINT_RULES.streak.day14;
    else if (streakDays >= 7) bonus = POINT_RULES.streak.day7;
    else if (streakDays >= 3) bonus = POINT_RULES.streak.day3;
    else return null;

    return createTransaction(userId, 'earn', bonus, 'streak', { streakDays });
}

// Export service object for convenient access
export const pointService = {
    createTransaction,
    earnPoints,
    spendPoints,
    getBalance,
    getTransactionHistory,
    processStreakBonus,
    POINT_RULES,
};

export default pointService;
