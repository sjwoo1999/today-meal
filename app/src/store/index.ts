import { create } from 'zustand';
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
    activeTab: 'feed' | 'boards' | 'record' | 'tools' | 'profile' | 'planner' | 'dashboard' | 'calendar' | 'community' | 'home' | 'league' | 'quests' | 'analysis';
    setLoading: (loading: boolean) => void;
    showXP: (amount: number, reason: string) => void;
    hideXP: () => void;
    triggerCelebration: (type: string) => void;
    hideCelebration: () => void;
    setActiveTab: (tab: UIState['activeTab']) => void;
}

// User Store
export const useUserStore = create<UserState>((set, get) => ({
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
}));

// Hanki Store
export const useHankiStore = create<HankiState>((set) => ({
    emotion: 'default',
    message: '오늘도 왔구나! 한끼 기다렸어 🍚',
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
export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    showXPPopup: { show: false, amount: 0, reason: '' },
    showCelebration: { show: false, type: '' },
    activeTab: 'feed',

    setLoading: (loading) => set({ isLoading: loading }),

    showXP: (amount, reason) => set({ showXPPopup: { show: true, amount, reason } }),

    hideXP: () => set({ showXPPopup: { show: false, amount: 0, reason: '' } }),

    triggerCelebration: (type) => set({ showCelebration: { show: true, type } }),

    hideCelebration: () => set({ showCelebration: { show: false, type: '' } }),

    setActiveTab: (tab) => set({ activeTab: tab }),
}));

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

export const usePersonalizationStore = create<PersonalizationState>((set, get) => ({
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
}));

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
