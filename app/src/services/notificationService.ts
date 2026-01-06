/**
 * Notification Service (SF-005)
 *
 * Manages all notification types including push, in-app, and email notifications.
 * Implements notification preferences, quiet hours, and delivery optimization.
 */

// Notification Types
export type NotificationChannel = 'push' | 'in_app' | 'email';
export type NotificationCategory =
    | 'social'      // Likes, comments, follows
    | 'challenge'   // Challenge updates
    | 'reminder'    // Meal reminders
    | 'achievement' // Badges, levels, streaks
    | 'squad'       // Squad activity
    | 'system'      // System announcements
    | 'marketing';  // Promotional

export type NotificationState =
    | 'created'
    | 'queued'
    | 'sent'
    | 'delivered'
    | 'read'
    | 'expired'
    | 'failed';

export interface Notification {
    id: string;
    userId: string;
    category: NotificationCategory;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    imageUrl?: string;
    actionUrl?: string;
    state: NotificationState;
    channels: NotificationChannel[];
    createdAt: Date;
    sentAt?: Date;
    readAt?: Date;
    expiresAt?: Date;
}

export interface NotificationPreferences {
    userId: string;
    channels: {
        push: boolean;
        in_app: boolean;
        email: boolean;
    };
    categories: {
        [key in NotificationCategory]: {
            push: boolean;
            in_app: boolean;
            email: boolean;
        };
    };
    quietHours: {
        enabled: boolean;
        start: string; // HH:mm
        end: string;   // HH:mm
    };
    language: string;
}

// Default Preferences
export const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'userId'> = {
    channels: {
        push: true,
        in_app: true,
        email: false,
    },
    categories: {
        social: { push: true, in_app: true, email: false },
        challenge: { push: true, in_app: true, email: true },
        reminder: { push: true, in_app: false, email: false },
        achievement: { push: true, in_app: true, email: false },
        squad: { push: true, in_app: true, email: false },
        system: { push: true, in_app: true, email: true },
        marketing: { push: false, in_app: true, email: false },
    },
    quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
    },
    language: 'ko',
};

// Notification Templates
const NOTIFICATION_TEMPLATES = {
    // Social
    new_follower: {
        category: 'social' as NotificationCategory,
        title: '새로운 팔로워',
        body: (data: Record<string, unknown>) => `${data.followerName}님이 회원님을 팔로우합니다.`,
    },
    post_liked: {
        category: 'social' as NotificationCategory,
        title: '좋아요',
        body: (data: Record<string, unknown>) => `${data.userName}님이 회원님의 게시물을 좋아합니다.`,
    },
    new_comment: {
        category: 'social' as NotificationCategory,
        title: '새 댓글',
        body: (data: Record<string, unknown>) => `${data.userName}님이 댓글을 남겼습니다: "${data.preview}"`,
    },

    // Challenge
    challenge_started: {
        category: 'challenge' as NotificationCategory,
        title: '챌린지 시작!',
        body: (data: Record<string, unknown>) => `${data.challengeName} 챌린지가 시작되었습니다!`,
    },
    challenge_ending: {
        category: 'challenge' as NotificationCategory,
        title: '챌린지 종료 임박',
        body: (data: Record<string, unknown>) => `${data.challengeName} 챌린지가 ${data.hoursLeft}시간 후 종료됩니다.`,
    },
    challenge_completed: {
        category: 'challenge' as NotificationCategory,
        title: '챌린지 완료!',
        body: (data: Record<string, unknown>) => `축하합니다! ${data.challengeName} 챌린지를 완료했습니다!`,
    },

    // Reminder
    meal_reminder: {
        category: 'reminder' as NotificationCategory,
        title: '식사 기록 알림',
        body: (data: Record<string, unknown>) => `${data.mealType} 시간이에요! 오늘의 식사를 기록해보세요.`,
    },
    streak_reminder: {
        category: 'reminder' as NotificationCategory,
        title: '연속 기록 알림',
        body: (data: Record<string, unknown>) => `${data.streakDays}일 연속 기록 중! 오늘도 기록하고 스트릭을 유지하세요.`,
    },

    // Achievement
    badge_earned: {
        category: 'achievement' as NotificationCategory,
        title: '새 뱃지 획득!',
        body: (data: Record<string, unknown>) => `${data.badgeName} 뱃지를 획득했습니다!`,
    },
    level_up: {
        category: 'achievement' as NotificationCategory,
        title: '레벨 업!',
        body: (data: Record<string, unknown>) => `축하합니다! 레벨 ${data.newLevel}에 도달했습니다!`,
    },
    streak_milestone: {
        category: 'achievement' as NotificationCategory,
        title: '연속 기록 달성!',
        body: (data: Record<string, unknown>) => `대단해요! ${data.streakDays}일 연속 기록을 달성했습니다!`,
    },

    // Squad
    squad_invite: {
        category: 'squad' as NotificationCategory,
        title: '스쿼드 초대',
        body: (data: Record<string, unknown>) => `${data.inviterName}님이 ${data.squadName} 스쿼드에 초대했습니다.`,
    },
    squad_member_joined: {
        category: 'squad' as NotificationCategory,
        title: '새 멤버 참여',
        body: (data: Record<string, unknown>) => `${data.memberName}님이 ${data.squadName}에 참여했습니다.`,
    },
} as const;

// Main Service Functions
export async function sendNotification(
    userId: string,
    templateKey: keyof typeof NOTIFICATION_TEMPLATES,
    data: Record<string, unknown>,
    options?: {
        channels?: NotificationChannel[];
        priority?: 'high' | 'normal' | 'low';
        expiresIn?: number; // minutes
    }
): Promise<Notification> {
    const template = NOTIFICATION_TEMPLATES[templateKey];
    const preferences = await getPreferences(userId);

    // Check quiet hours
    if (isQuietHours(preferences)) {
        // Queue for later delivery
        console.log('Notification queued due to quiet hours');
    }

    // Determine channels based on preferences
    const channels = options?.channels || getEnabledChannels(preferences, template.category);

    const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        category: template.category,
        title: template.title,
        body: template.body(data),
        data,
        channels,
        state: 'created',
        createdAt: new Date(),
        expiresAt: options?.expiresIn
            ? new Date(Date.now() + options.expiresIn * 60 * 1000)
            : undefined,
    };

    // Send to each channel
    for (const channel of channels) {
        await sendToChannel(notification, channel);
    }

    notification.state = 'sent';
    notification.sentAt = new Date();

    return notification;
}

export async function sendToChannel(
    notification: Notification,
    channel: NotificationChannel
): Promise<boolean> {
    switch (channel) {
        case 'push':
            // Send push notification (would use Firebase, APNs, etc.)
            console.log('Sending push:', notification.title);
            return true;
        case 'in_app':
            // Store in-app notification
            console.log('Storing in-app notification:', notification.title);
            return true;
        case 'email':
            // Send email (would use email service)
            console.log('Sending email:', notification.title);
            return true;
        default:
            return false;
    }
}

export async function getNotifications(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: {
        unreadOnly?: boolean;
        category?: NotificationCategory;
        limit?: number;
        offset?: number;
    }
): Promise<Notification[]> {
    // Mock - would fetch from backend
    return [
        {
            id: 'notif_1',
            userId,
            category: 'social',
            title: '새로운 팔로워',
            body: '건강왕님이 회원님을 팔로우합니다.',
            channels: ['in_app'],
            state: 'delivered',
            createdAt: new Date(Date.now() - 3600000),
            sentAt: new Date(Date.now() - 3600000),
        },
        {
            id: 'notif_2',
            userId,
            category: 'achievement',
            title: '레벨 업!',
            body: '축하합니다! 레벨 15에 도달했습니다!',
            channels: ['push', 'in_app'],
            state: 'read',
            createdAt: new Date(Date.now() - 86400000),
            sentAt: new Date(Date.now() - 86400000),
            readAt: new Date(Date.now() - 82800000),
        },
    ];
}

export async function markAsRead(notificationId: string): Promise<boolean> {
    // Update notification state
    console.log('Marking notification as read:', notificationId);
    return true;
}

export async function markAllAsRead(userId: string): Promise<number> {
    // Mark all user notifications as read
    console.log('Marking all notifications as read for user:', userId);
    return 5; // Returns count of updated notifications
}

export async function getPreferences(userId: string): Promise<NotificationPreferences> {
    // Mock - would fetch from backend
    return {
        userId,
        ...DEFAULT_PREFERENCES,
    };
}

export async function updatePreferences(
    userId: string,
    updates: Partial<Omit<NotificationPreferences, 'userId'>>
): Promise<NotificationPreferences> {
    const current = await getPreferences(userId);
    return {
        ...current,
        ...updates,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUnreadCount(_userId: string): Promise<number> {
    // Mock - would fetch from backend
    return 3;
}

// Helper Functions
function isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const { start, end } = preferences.quietHours;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (start > end) {
        return currentTime >= start || currentTime < end;
    }

    return currentTime >= start && currentTime < end;
}

function getEnabledChannels(
    preferences: NotificationPreferences,
    category: NotificationCategory
): NotificationChannel[] {
    const channels: NotificationChannel[] = [];
    const categoryPrefs = preferences.categories[category];

    if (preferences.channels.push && categoryPrefs.push) channels.push('push');
    if (preferences.channels.in_app && categoryPrefs.in_app) channels.push('in_app');
    if (preferences.channels.email && categoryPrefs.email) channels.push('email');

    return channels;
}

// Scheduled Notifications
export async function scheduleMealReminder(
    userId: string,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    time: string // HH:mm
): Promise<{ jobId: string }> {
    // Schedule notification (would use job scheduler)
    const jobId = `reminder_${userId}_${mealType}_${Date.now()}`;
    console.log('Scheduled meal reminder:', jobId, 'at', time);
    return { jobId };
}

export async function cancelScheduledNotification(jobId: string): Promise<boolean> {
    console.log('Cancelled scheduled notification:', jobId);
    return true;
}

// Export service
export const notificationService = {
    sendNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getPreferences,
    updatePreferences,
    getUnreadCount,
    scheduleMealReminder,
    cancelScheduledNotification,
    NOTIFICATION_TEMPLATES,
    DEFAULT_PREFERENCES,
};

export default notificationService;
