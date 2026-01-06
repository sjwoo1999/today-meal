import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    User,
    HankiEmotion,
    MealRecord,
    DailyNutrition,
    ReversePlan,
    Quest,
    Badge,
    LEVEL_DATA,
    STREAK_MILESTONES,
    LevelInfo,
    // v2.0 Personalization types
    ConditionLevel,
    MoodType,
    CompanionType,
    ScheduleEvent,
    UserContext,
    UserPattern,
    HankiSuggestion,
    HankiChatMessage,
} from '@/types';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    addXP: (amount: number, reason: string) => { leveledUp: boolean; newLevel?: number };
    incrementStreak: () => void;
    resetStreak: () => void;
    useStreakFreeze: () => boolean;
    addBadge: (badge: Badge) => void;
}

interface HankiState {
    emotion: HankiEmotion;
    message: string;
    evolutionStage: 1 | 2 | 3 | 4;
    setEmotion: (emotion: HankiEmotion, message: string) => void;
    updateEvolutionStage: (level: number) => void;
}

interface NutritionState {
    todayNutrition: DailyNutrition | null;
    mealRecords: MealRecord[];
    reversePlan: ReversePlan | null;
    setTodayNutrition: (nutrition: DailyNutrition) => void;
    addMealRecord: (record: MealRecord) => void;
    setReversePlan: (plan: ReversePlan | null) => void;
    updateReversePlanStatus: (status: ReversePlan['status']) => void;
}

interface QuestState {
    dailyQuests: Quest[];
    setDailyQuests: (quests: Quest[]) => void;
    completeQuest: (questId: string) => void;
}

interface UIState {
    isLoading: boolean;
    showXPPopup: { show: boolean; amount: number; reason: string };
    showCelebration: { show: boolean; type: string };
    activeTab: 'feed' | 'boards' | 'record' | 'tools' | 'profile' | 'planner' | 'dashboard' | 'calendar' | 'community' | 'home' | 'league' | 'quests' | 'analysis' | 'nearby' | 'squad' | 'coach' | 'shop' | 'settings' | 'userProfile';
    selectedUserId: string | null;
    setLoading: (loading: boolean) => void;
    showXP: (amount: number, reason: string) => void;
    hideXP: () => void;
    triggerCelebration: (type: string) => void;
    hideCelebration: () => void;
    setActiveTab: (tab: UIState['activeTab']) => void;
    setSelectedUserId: (userId: string | null) => void;
}

// User Store
export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),

            addXP: (amount) => {
        const { user } = get();
        if (!user) return { leveledUp: false };

        const newXP = user.gamification.xp + amount;
        const currentLevel = user.gamification.level;

        // Find new level
        let newLevel = currentLevel;
        for (const levelInfo of LEVEL_DATA) {
            if (newXP >= levelInfo.requiredXP) {
                newLevel = levelInfo.level;
            }
        }

        const leveledUp = newLevel > currentLevel;

        set({
            user: {
                ...user,
                gamification: {
                    ...user.gamification,
                    xp: newXP,
                    level: newLevel,
                    weeklyXP: user.gamification.weeklyXP + amount,
                }
            }
        });

        return { leveledUp, newLevel: leveledUp ? newLevel : undefined };
    },

    incrementStreak: () => {
        const { user } = get();
        if (!user) return;

        const newStreak = user.gamification.streak + 1;
        const longestStreak = Math.max(user.gamification.longestStreak, newStreak);

        // Check for streak milestones
        const milestone = STREAK_MILESTONES.find(m => m.days === newStreak);

        set({
            user: {
                ...user,
                gamification: {
                    ...user.gamification,
                    streak: newStreak,
                    longestStreak,
                    streakFreezes: milestone?.freezeReward
                        ? Math.min(user.gamification.streakFreezes + 1, 3)
                        : user.gamification.streakFreezes,
                }
            }
        });
    },

    resetStreak: () => {
        const { user } = get();
        if (!user) return;

        set({
            user: {
                ...user,
                gamification: {
                    ...user.gamification,
                    streak: 0,
                }
            }
        });
    },

    useStreakFreeze: () => {
        const { user } = get();
        if (!user || user.gamification.streakFreezes <= 0) return false;

        set({
            user: {
                ...user,
                gamification: {
                    ...user.gamification,
                    streakFreezes: user.gamification.streakFreezes - 1,
                }
            }
        });

        return true;
    },

    addBadge: (badge) => {
        const { user } = get();
        if (!user) return;

        set({
            user: {
                ...user,
                gamification: {
                    ...user.gamification,
                    badges: [...user.gamification.badges, badge],
                }
            }
        });
    },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Hanki Store
export const useHankiStore = create<HankiState>((set) => ({
    emotion: 'default',
    message: '',
    evolutionStage: 1,

    setEmotion: (emotion, message) => set({ emotion, message }),

    updateEvolutionStage: (level) => {
        let stage: 1 | 2 | 3 | 4 = 1;
        if (level >= 7) stage = 4;
        else if (level >= 4) stage = 3;
        else if (level >= 2) stage = 2;
        set({ evolutionStage: stage });
    },
}));

// Nutrition Store
export const useNutritionStore = create<NutritionState>((set, get) => ({
    todayNutrition: null,
    mealRecords: [],
    reversePlan: null,

    setTodayNutrition: (nutrition) => set({ todayNutrition: nutrition }),

    addMealRecord: (record) => {
        const { mealRecords, todayNutrition } = get();
        const newRecords = [...mealRecords, record];

        // Update today's nutrition
        if (todayNutrition) {
            const updatedNutrition: DailyNutrition = {
                ...todayNutrition,
                calories: {
                    ...todayNutrition.calories,
                    current: todayNutrition.calories.current + record.totalCalories,
                },
                protein: {
                    ...todayNutrition.protein,
                    current: todayNutrition.protein.current + record.totalProtein,
                },
                carbs: {
                    ...todayNutrition.carbs,
                    current: todayNutrition.carbs.current + record.totalCarbs,
                },
                fat: {
                    ...todayNutrition.fat,
                    current: todayNutrition.fat.current + record.totalFat,
                },
                meals: [...todayNutrition.meals, record],
            };

            // Check if goal achieved
            updatedNutrition.isGoalAchieved =
                updatedNutrition.calories.current >= updatedNutrition.calories.goal * 0.9 &&
                updatedNutrition.calories.current <= updatedNutrition.calories.goal * 1.1;

            set({ mealRecords: newRecords, todayNutrition: updatedNutrition });
        } else {
            set({ mealRecords: newRecords });
        }
    },

    setReversePlan: (plan) => set({ reversePlan: plan }),

    updateReversePlanStatus: (status) => {
        const { reversePlan } = get();
        if (reversePlan) {
            set({ reversePlan: { ...reversePlan, status } });
        }
    },
}));

// Quest Store
export const useQuestStore = create<QuestState>((set, get) => ({
    dailyQuests: [],

    setDailyQuests: (quests) => set({ dailyQuests: quests }),

    completeQuest: (questId) => {
        const { dailyQuests } = get();
        set({
            dailyQuests: dailyQuests.map(q =>
                q.id === questId ? { ...q, isCompleted: true } : q
            ),
        });
    },
}));

// UI Store
export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isLoading: false,
            showXPPopup: { show: false, amount: 0, reason: '' },
            showCelebration: { show: false, type: '' },
            activeTab: 'feed',
            selectedUserId: null,

            setLoading: (loading) => set({ isLoading: loading }),

            showXP: (amount, reason) => set({ showXPPopup: { show: true, amount, reason } }),

            hideXP: () => set({ showXPPopup: { show: false, amount: 0, reason: '' } }),

            triggerCelebration: (type) => set({ showCelebration: { show: true, type } }),

            hideCelebration: () => set({ showCelebration: { show: false, type: '' } }),

            setActiveTab: (tab) => set({ activeTab: tab }),

            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ activeTab: state.activeTab }), // Only persist activeTab
        }
    )
);

// Helper function to get level info
export function getLevelInfo(xp: number): LevelInfo {
    let currentLevel = LEVEL_DATA[0];
    for (const level of LEVEL_DATA) {
        if (xp >= level.requiredXP) {
            currentLevel = level;
        }
    }
    return currentLevel;
}

// Helper function to calculate XP progress
export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
    const levelInfo = getLevelInfo(xp);
    const nextLevel = LEVEL_DATA.find(l => l.level === levelInfo.level + 1);

    if (!nextLevel) {
        return { current: xp, needed: levelInfo.requiredXP, percentage: 100 };
    }

    const current = xp - levelInfo.requiredXP;
    const needed = nextLevel.requiredXP - levelInfo.requiredXP;
    const percentage = Math.min((current / needed) * 100, 100);

    return { current, needed, percentage };
}

// ========================================
// v2.0 Personalization Store
// ========================================

interface PersonalizationState {
    userContext: UserContext;
    userPattern: UserPattern;
    hasCheckedInToday: boolean;
    showMorningCheckIn: boolean;

    // Actions
    setCondition: (condition: ConditionLevel) => void;
    setMood: (mood: MoodType) => void;
    setCompanion: (companion: CompanionType) => void;
    addScheduleEvent: (event: ScheduleEvent) => void;
    removeScheduleEvent: (eventId: string) => void;
    completeMorningCheckIn: () => void;
    dismissMorningCheckIn: () => void;
    updatePatternFromMeal: (mealName: string, liked: boolean) => void;
}

export const usePersonalizationStore = create<PersonalizationState>()(
    persist(
        (set, get) => ({
            userContext: {
                todaySchedule: [],
            },
            userPattern: {
                preferredMeals: [],
                skippedMeals: [],
                averageMealTimes: {},
                weekdayPatterns: {},
                calorieAdherence: 1.0,
            },
            hasCheckedInToday: false,
            showMorningCheckIn: true, // Show by default on first load

            setCondition: (condition) => set((state) => ({
        userContext: { ...state.userContext, todayCondition: condition },
    })),

    setMood: (mood) => set((state) => ({
        userContext: { ...state.userContext, todayMood: mood },
    })),

    setCompanion: (companion) => set((state) => ({
        userContext: { ...state.userContext, companion },
    })),

    addScheduleEvent: (event) => set((state) => ({
        userContext: {
            ...state.userContext,
            todaySchedule: [...state.userContext.todaySchedule, event],
        },
    })),

    removeScheduleEvent: (eventId) => set((state) => ({
        userContext: {
            ...state.userContext,
            todaySchedule: state.userContext.todaySchedule.filter(e => e.id !== eventId),
        },
    })),

    completeMorningCheckIn: () => set({
        hasCheckedInToday: true,
        showMorningCheckIn: false,
        userContext: {
            ...get().userContext,
            checkedInAt: new Date(),
        },
    }),

    dismissMorningCheckIn: () => set({
        showMorningCheckIn: false,
    }),

    updatePatternFromMeal: (mealName, liked) => set((state) => {
        const { preferredMeals, skippedMeals } = state.userPattern;
        if (liked && !preferredMeals.includes(mealName)) {
            return {
                userPattern: {
                    ...state.userPattern,
                    preferredMeals: [...preferredMeals, mealName].slice(-20), // Keep last 20
                },
            };
        } else if (!liked && !skippedMeals.includes(mealName)) {
            return {
                userPattern: {
                    ...state.userPattern,
                    skippedMeals: [...skippedMeals, mealName].slice(-20),
                },
            };
        }
        return state;
    }),
        }),
        {
            name: 'personalization-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userPattern: state.userPattern,
                hasCheckedInToday: state.hasCheckedInToday,
            }),
        }
    )
);

// ========================================
// v2.0 Hanki AI Agent Store
// ========================================

interface HankiAgentState {
    suggestions: HankiSuggestion[];
    chatHistory: HankiChatMessage[];
    isProactiveMode: boolean;
    isChatOpen: boolean;

    // Actions
    addSuggestion: (suggestion: Omit<HankiSuggestion, 'id' | 'triggeredAt' | 'isDismissed'>) => void;
    dismissSuggestion: (suggestionId: string) => void;
    clearOldSuggestions: () => void;
    addChatMessage: (type: 'hanki' | 'user', content: string, quickReplies?: string[]) => void;
    clearChat: () => void;
    toggleProactiveMode: () => void;
    toggleChat: () => void;
}

export const useHankiAgentStore = create<HankiAgentState>((set) => ({
    suggestions: [],
    chatHistory: [],
    isProactiveMode: true,
    isChatOpen: false,

    addSuggestion: (suggestion) => set((state) => ({
        suggestions: [
            ...state.suggestions,
            {
                ...suggestion,
                id: `sug_${Date.now()}`,
                triggeredAt: new Date(),
                isDismissed: false,
            },
        ],
    })),

    dismissSuggestion: (suggestionId) => set((state) => ({
        suggestions: state.suggestions.map(s =>
            s.id === suggestionId ? { ...s, isDismissed: true } : s
        ),
    })),

    clearOldSuggestions: () => set((state) => ({
        suggestions: state.suggestions.filter(s => {
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return s.triggeredAt > hourAgo && !s.isDismissed;
        }),
    })),

    addChatMessage: (type, content, quickReplies) => set((state) => ({
        chatHistory: [
            ...state.chatHistory,
            {
                id: `msg_${Date.now()}`,
                type,
                content,
                timestamp: new Date(),
                quickReplies,
            },
        ],
    })),

    clearChat: () => set({ chatHistory: [] }),

    toggleProactiveMode: () => set((state) => ({
        isProactiveMode: !state.isProactiveMode,
    })),

    toggleChat: () => set((state) => ({
        isChatOpen: !state.isChatOpen,
    })),
}));

// ========================================
// Auth Store
// ========================================

export type OnboardingGoal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface OnboardingData {
    goal: OnboardingGoal;
    bodyInfo: {
        height: number;
        weight: number;
        targetWeight?: number;
        age: number;
        gender: 'male' | 'female' | 'other';
    };
    activityLevel: ActivityLevel;
    tags: {
        allergies: string[];
        preferences: string[];
        dislikes: string[];
    };
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    currentUser: User | null;
    onboardingComplete: boolean;
    onboardingStep: 1 | 2 | 3 | 4;
    onboardingData: Partial<OnboardingData>;

    // Actions
    login: (provider: 'kakao' | 'apple' | 'google' | 'email') => Promise<void>;
    logout: () => void;
    setOnboardingStep: (step: 1 | 2 | 3 | 4) => void;
    updateOnboardingData: (data: Partial<OnboardingData>) => void;
    completeOnboarding: () => void;
    skipOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isLoading: false,
            currentUser: null,
            onboardingComplete: false,
            onboardingStep: 1,
            onboardingData: {},

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            login: async (provider) => {
        set({ isLoading: true });

        // Simulate API call (provider would be used in real implementation)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user creation
        const mockUser: User = {
            id: 'user_1',
            name: '한끼 유저',
            email: 'user@example.com',
            role: 'member',
            profile: {
                dailyCalorieGoal: 2000,
                dailyProteinGoal: 150,
                dailyCarbGoal: 250,
                dailyFatGoal: 67,
                allergies: [],
                preferences: [],
                dislikedFoods: [],
                livingArea: '서울',
            },
            gamification: {
                xp: 0,
                level: 1,
                streak: 0,
                longestStreak: 0,
                streakFreezes: 1,
                badges: [],
                league: 'bronze',
                weeklyXP: 0,
            },
            createdAt: new Date(),
        };

        set({
            isAuthenticated: true,
            isLoading: false,
            currentUser: mockUser,
        });
    },

    logout: () => {
        set({
            isAuthenticated: false,
            currentUser: null,
            onboardingComplete: false,
            onboardingStep: 1,
            onboardingData: {},
        });
        // "/" 경로로 리다이렉트 (클라이언트 사이드)
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },

    setOnboardingStep: (step) => set({ onboardingStep: step }),

    updateOnboardingData: (data) => set((state) => ({
        onboardingData: { ...state.onboardingData, ...data },
    })),

    completeOnboarding: () => {
        const { currentUser, onboardingData } = get();
        if (currentUser && onboardingData) {
            // Update user profile with onboarding data
            const updatedUser: User = {
                ...currentUser,
                profile: {
                    ...currentUser.profile,
                    height: onboardingData.bodyInfo?.height,
                    weight: onboardingData.bodyInfo?.weight,
                    targetWeight: onboardingData.bodyInfo?.targetWeight,
                    age: onboardingData.bodyInfo?.age,
                    gender: onboardingData.bodyInfo?.gender,
                    activityLevel: onboardingData.activityLevel,
                    allergies: onboardingData.tags?.allergies || [],
                    preferences: onboardingData.tags?.preferences || [],
                    dislikedFoods: onboardingData.tags?.dislikes || [],
                },
            };
            set({
                currentUser: updatedUser,
                onboardingComplete: true,
            });
        }
    },

    skipOnboarding: () => set({ onboardingComplete: true }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                currentUser: state.currentUser,
                onboardingComplete: state.onboardingComplete,
            }),
        }
    )
);

// ========================================
// Follow Store
// ========================================

interface FollowState {
    following: string[];
    followers: string[];
    isFollowing: (userId: string) => boolean;
    toggleFollow: (userId: string) => void;
    getFollowerCount: (userId: string) => number;
    getFollowingCount: (userId: string) => number;
}

// Mock follow relationships for initial data
const initialFollowing = ['u_002', 'u_003', 'u_005'];
const initialFollowers = ['u_004', 'u_006', 'u_007', 'u_008'];

export const useFollowStore = create<FollowState>((set, get) => ({
    following: initialFollowing,
    followers: initialFollowers,

    isFollowing: (userId) => get().following.includes(userId),

    toggleFollow: (userId) => set((state) => ({
        following: state.following.includes(userId)
            ? state.following.filter(id => id !== userId)
            : [...state.following, userId]
    })),

    getFollowerCount: (userId) => {
        // Mock counts based on user ID
        const mockCounts: Record<string, number> = {
            'u_001': get().followers.length,
            'u_002': 156,
            'u_003': 42,
            'u_004': 89,
            'u_005': 234,
            'u_006': 67,
            'u_007': 45,
            'u_008': 123,
            'u_009': 28,
            'u_010': 15,
        };
        return mockCounts[userId] ?? 0;
    },

    getFollowingCount: (userId) => {
        // Mock counts based on user ID
        const mockCounts: Record<string, number> = {
            'u_001': get().following.length,
            'u_002': 78,
            'u_003': 34,
            'u_004': 56,
            'u_005': 112,
            'u_006': 45,
            'u_007': 23,
            'u_008': 89,
            'u_009': 67,
            'u_010': 12,
        };
        return mockCounts[userId] ?? 0;
    },
}));

// ========================================
// Story Store
// ========================================

interface CreateStoryData {
    imageUrl: string;
    caption?: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface Story {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    imageUrl: string;
    caption?: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    createdAt: Date;
    expiresAt: Date;
    reactions: { yummy: number; healthy: number; support: number };
    viewed: boolean;
}

interface StoryState {
    stories: Story[];
    myStories: Story[];
    addStory: (data: CreateStoryData) => Story;
    deleteStory: (storyId: string) => void;
    hasActiveStory: () => boolean;
    markAsViewed: (storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
    stories: [],
    myStories: [],

    addStory: (data) => {
        const newStory: Story = {
            id: `story_${Date.now()}`,
            userId: 'u_001',
            userName: '나',
            userAvatar: undefined,
            imageUrl: data.imageUrl,
            caption: data.caption,
            mealType: data.mealType,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            reactions: { yummy: 0, healthy: 0, support: 0 },
            viewed: false,
        };
        set((state) => ({
            stories: [newStory, ...state.stories],
            myStories: [newStory, ...state.myStories],
        }));
        return newStory;
    },

    deleteStory: (storyId) => set((state) => ({
        stories: state.stories.filter(s => s.id !== storyId),
        myStories: state.myStories.filter(s => s.id !== storyId),
    })),

    hasActiveStory: () => {
        const { myStories } = get();
        const now = new Date();
        return myStories.some(s => s.expiresAt > now);
    },

    markAsViewed: (storyId) => set((state) => ({
        stories: state.stories.map(s =>
            s.id === storyId ? { ...s, viewed: true } : s
        ),
    })),
}));

// ========================================
// Feed Store (SF-002)
// ========================================

import type { Post } from '@/types';
import type { FeedState } from '@/services/feedService';

interface FeedStoreState {
    posts: Post[];
    feedState: FeedState;
    hasMore: boolean;
    cursor: string | null;
    filter: {
        mealType?: string[];
        timeRange?: 'today' | 'week' | 'month' | 'all';
        onlyFollowing?: boolean;
    };

    // Actions
    setPosts: (posts: Post[]) => void;
    appendPosts: (posts: Post[]) => void;
    setFeedState: (state: FeedState) => void;
    setHasMore: (hasMore: boolean) => void;
    setCursor: (cursor: string | null) => void;
    setFilter: (filter: FeedStoreState['filter']) => void;
    toggleLike: (postId: string) => void;
    incrementComments: (postId: string) => void;
    clearFeed: () => void;
}

export const useFeedStore = create<FeedStoreState>((set) => ({
    posts: [],
    feedState: 'loading',
    hasMore: true,
    cursor: null,
    filter: {},

    setPosts: (posts) => set({ posts, feedState: 'loaded' }),

    appendPosts: (posts) => set((state) => ({
        posts: [...state.posts, ...posts],
        feedState: 'loaded',
    })),

    setFeedState: (feedState) => set({ feedState }),

    setHasMore: (hasMore) => set({ hasMore }),

    setCursor: (cursor) => set({ cursor }),

    setFilter: (filter) => set({ filter }),

    toggleLike: (postId) => set((state) => ({
        posts: state.posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                }
                : post
        ),
    })),

    incrementComments: (postId) => set((state) => ({
        posts: state.posts.map(post =>
            post.id === postId
                ? { ...post, comments: post.comments + 1 }
                : post
        ),
    })),

    clearFeed: () => set({
        posts: [],
        feedState: 'loading',
        hasMore: true,
        cursor: null,
    }),
}));

// ========================================
// Challenge Store (SF-004)
// ========================================

import type { Challenge } from '@/types';
import type { ChallengeProgress } from '@/services/challengeService';

interface ChallengeStoreState {
    activeChallenges: Challenge[];
    myChallenges: Challenge[];
    currentChallenge: Challenge | null;
    progress: Record<string, ChallengeProgress>; // challengeId -> progress
    isLoading: boolean;

    // Actions
    setActiveChallenges: (challenges: Challenge[]) => void;
    setMyChallenges: (challenges: Challenge[]) => void;
    setCurrentChallenge: (challenge: Challenge | null) => void;
    updateProgress: (challengeId: string, progress: ChallengeProgress) => void;
    joinChallenge: (challengeId: string) => void;
    leaveChallenge: (challengeId: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useChallengeStore = create<ChallengeStoreState>((set) => ({
    activeChallenges: [],
    myChallenges: [],
    currentChallenge: null,
    progress: {},
    isLoading: false,

    setActiveChallenges: (activeChallenges) => set({ activeChallenges }),

    setMyChallenges: (myChallenges) => set({ myChallenges }),

    setCurrentChallenge: (currentChallenge) => set({ currentChallenge }),

    updateProgress: (challengeId, progress) => set((state) => ({
        progress: { ...state.progress, [challengeId]: progress },
    })),

    joinChallenge: (challengeId) => set((state) => {
        const challenge = state.activeChallenges.find(c => c.id === challengeId);
        if (challenge && !state.myChallenges.some(c => c.id === challengeId)) {
            return {
                myChallenges: [...state.myChallenges, challenge],
            };
        }
        return state;
    }),

    leaveChallenge: (challengeId) => set((state) => ({
        myChallenges: state.myChallenges.filter(c => c.id !== challengeId),
    })),

    setLoading: (isLoading) => set({ isLoading }),
}));

// ========================================
// Point Store (SF-001)
// ========================================

import type { PointBalance, PointTransaction } from '@/services/pointService';

interface PointStoreState {
    balance: PointBalance | null;
    transactions: PointTransaction[];
    isLoading: boolean;
    pendingReward: { amount: number; reason: string } | null;

    // Actions
    setBalance: (balance: PointBalance) => void;
    setTransactions: (transactions: PointTransaction[]) => void;
    addTransaction: (transaction: PointTransaction) => void;
    updateBalance: (amount: number, type: 'earn' | 'spend') => void;
    setLoading: (loading: boolean) => void;
    setPendingReward: (reward: { amount: number; reason: string } | null) => void;
    claimReward: () => void;
}

export const usePointStore = create<PointStoreState>((set, get) => ({
    balance: {
        userId: 'user_1',
        total: 1250,
        available: 1200,
        pending: 50,
        expiringSoon: 100,
        lastUpdated: new Date(),
    },
    transactions: [],
    isLoading: false,
    pendingReward: null,

    setBalance: (balance) => set({ balance }),

    setTransactions: (transactions) => set({ transactions }),

    addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions],
    })),

    updateBalance: (amount, type) => set((state) => {
        if (!state.balance) return state;
        const change = type === 'earn' ? amount : -amount;
        return {
            balance: {
                ...state.balance,
                total: state.balance.total + change,
                available: state.balance.available + change,
                lastUpdated: new Date(),
            },
        };
    }),

    setLoading: (isLoading) => set({ isLoading }),

    setPendingReward: (pendingReward) => set({ pendingReward }),

    claimReward: () => {
        const { pendingReward } = get();
        if (pendingReward) {
            set((state) => ({
                balance: state.balance ? {
                    ...state.balance,
                    total: state.balance.total + pendingReward.amount,
                    available: state.balance.available + pendingReward.amount,
                } : null,
                pendingReward: null,
            }));
        }
    },
}));

// ========================================
// Inventory Store
// ========================================

interface InventoryItem {
    id: string;
    itemId: string;
    name: string;
    type: 'theme' | 'badge' | 'item' | 'consumable';
    imageUrl: string;
    purchasedAt: Date;
    quantity: number;
    isEquipped: boolean;
}

interface InventoryStoreState {
    items: InventoryItem[];
    equippedTheme: string | null;
    equippedBadge: string | null;

    // Actions
    setItems: (items: InventoryItem[]) => void;
    addItem: (item: Omit<InventoryItem, 'purchasedAt' | 'quantity' | 'isEquipped'>) => void;
    equipItem: (itemId: string, type: 'theme' | 'badge') => void;
    unequipItem: (type: 'theme' | 'badge') => void;
    useConsumable: (itemId: string) => boolean;
}

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
    items: [],
    equippedTheme: null,
    equippedBadge: null,

    setItems: (items) => set({ items }),

    addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.itemId === item.itemId);
        if (existing) {
            return {
                items: state.items.map(i =>
                    i.itemId === item.itemId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            };
        }
        return {
            items: [...state.items, {
                ...item,
                purchasedAt: new Date(),
                quantity: 1,
                isEquipped: false,
            }],
        };
    }),

    equipItem: (itemId, type) => set((state) => ({
        items: state.items.map(i =>
            i.itemId === itemId
                ? { ...i, isEquipped: true }
                : i.type === type
                    ? { ...i, isEquipped: false }
                    : i
        ),
        equippedTheme: type === 'theme' ? itemId : state.equippedTheme,
        equippedBadge: type === 'badge' ? itemId : state.equippedBadge,
    })),

    unequipItem: (type) => set((state) => ({
        items: state.items.map(i =>
            i.type === type ? { ...i, isEquipped: false } : i
        ),
        equippedTheme: type === 'theme' ? null : state.equippedTheme,
        equippedBadge: type === 'badge' ? null : state.equippedBadge,
    })),

    useConsumable: (itemId) => {
        const { items } = get();
        const item = items.find(i => i.itemId === itemId && i.type === 'consumable');
        if (!item || item.quantity <= 0) return false;

        set((state) => ({
            items: state.items.map(i =>
                i.itemId === itemId
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
            ).filter(i => i.quantity > 0),
        }));
        return true;
    },
}));

// ========================================
// Squad Store
// ========================================

import type { Squad, SquadMember } from '@/types';

interface SquadStoreState {
    mySquads: Squad[];
    currentSquad: Squad | null;
    members: SquadMember[];
    isLoading: boolean;

    // Actions
    setMySquads: (squads: Squad[]) => void;
    setCurrentSquad: (squad: Squad | null) => void;
    setMembers: (members: SquadMember[]) => void;
    addSquad: (squad: Squad) => void;
    leaveSquad: (squadId: string) => void;
    updateSquad: (squadId: string, updates: Partial<Squad>) => void;
    setLoading: (loading: boolean) => void;
}

export const useSquadStore = create<SquadStoreState>((set) => ({
    mySquads: [],
    currentSquad: null,
    members: [],
    isLoading: false,

    setMySquads: (mySquads) => set({ mySquads }),

    setCurrentSquad: (currentSquad) => set({ currentSquad }),

    setMembers: (members) => set({ members }),

    addSquad: (squad) => set((state) => ({
        mySquads: [...state.mySquads, squad],
    })),

    leaveSquad: (squadId) => set((state) => ({
        mySquads: state.mySquads.filter(s => s.id !== squadId),
        currentSquad: state.currentSquad?.id === squadId ? null : state.currentSquad,
    })),

    updateSquad: (squadId, updates) => set((state) => ({
        mySquads: state.mySquads.map(s =>
            s.id === squadId ? { ...s, ...updates } : s
        ),
        currentSquad: state.currentSquad?.id === squadId
            ? { ...state.currentSquad, ...updates }
            : state.currentSquad,
    })),

    setLoading: (isLoading) => set({ isLoading }),
}));

// ========================================
// Notification Store (SF-005)
// ========================================

import type { Notification, NotificationPreferences } from '@/services/notificationService';
import { DEFAULT_PREFERENCES } from '@/services/notificationService';

interface NotificationStoreState {
    notifications: Notification[];
    unreadCount: number;
    preferences: NotificationPreferences;
    isLoading: boolean;

    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    setUnreadCount: (count: number) => void;
    setPreferences: (preferences: NotificationPreferences) => void;
    updatePreference: (key: keyof NotificationPreferences, value: unknown) => void;
    setLoading: (loading: boolean) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
    notifications: [],
    unreadCount: 0,
    preferences: { userId: 'user_1', ...DEFAULT_PREFERENCES },
    isLoading: false,

    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => n.state !== 'read').length,
    }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
    })),

    markAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === notificationId
                ? { ...n, state: 'read' as const, readAt: new Date() }
                : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({
            ...n,
            state: 'read' as const,
            readAt: new Date(),
        })),
        unreadCount: 0,
    })),

    setUnreadCount: (unreadCount) => set({ unreadCount }),

    setPreferences: (preferences) => set({ preferences }),

    updatePreference: (key, value) => set((state) => ({
        preferences: { ...state.preferences, [key]: value },
    })),

    setLoading: (isLoading) => set({ isLoading }),

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
