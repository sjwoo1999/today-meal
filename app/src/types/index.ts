// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'trainer';
    profile: UserProfile;
    gamification: GamificationData;
    createdAt: Date;
}

// Simple User for mock data
export interface SimpleUser {
    id: string;
    name: string;
    nickname: string;
    email: string;
    level: number;
    xp: number;
    streak: number;
    title: string;
    profileImage?: string;
    role: 'member' | 'trainer';
    createdAt: Date;
}

export interface UserProfile {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number; // cm
    weight?: number; // kg
    targetWeight?: number;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    dailyCalorieGoal: number;
    dailyProteinGoal: number;
    dailyCarbGoal: number;
    dailyFatGoal: number;
    allergies: string[];
    preferences: string[];
    dislikedFoods: string[];
    livingArea: string; // 생활권
    workArea?: string;
}

export interface GamificationData {
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    streakFreezes: number;
    badges: Badge[];
    league: LeagueTier;
    weeklyXP: number;
}

// Mascot Types
export type HankiEmotion =
    | 'default'
    | 'happy'
    | 'excited'
    | 'cheering'
    | 'worried'
    | 'sad'
    | 'upset'
    | 'touched';

export interface HankiState {
    emotion: HankiEmotion;
    message: string;
    evolutionStage: 1 | 2 | 3 | 4;
}

// Food & Nutrition Types
export interface FoodItem {
    id: string;
    name: string;
    nameKr: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    category: string;
    imageUrl?: string;
}

export interface MealRecord {
    id: string;
    userId: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    imageUrl?: string;
    note?: string;
    recordedAt: Date;
    xpEarned: number;
}

export interface DailyNutrition {
    date: string;
    calories: { current: number; goal: number };
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fat: { current: number; goal: number };
    meals: MealRecord[];
    isGoalAchieved: boolean;
}

// Reverse Meal Planner Types
export interface ReversePlan {
    id: string;
    userId: string;
    date: string;
    dinnerChoice: FoodItem;
    breakfastRecommendation: MealRecommendation;
    lunchRecommendation: MealRecommendation;
    dinnerBudget: NutritionBudget;
    status: 'planned' | 'in_progress' | 'completed' | 'failed';
    createdAt: Date;
}

export interface MealRecommendation {
    foods: FoodItem[];
    totalCalories: number;
    totalProtein: number;
    locations?: RestaurantLocation[];
    alternatives?: FoodItem[][];
}

export interface NutritionBudget {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface RestaurantLocation {
    name: string;
    address: string;
    distance: string;
    mapUrl: string;
}

// Gamification Types
export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
    category: 'streak' | 'achievement' | 'special';
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    type: 'easy' | 'challenge';
    xpReward: number;
    isCompleted: boolean;
    progress?: number;
    maxProgress?: number;
}

export interface LeagueRanking {
    rank: number;
    userId: string;
    userName: string;
    weeklyXP: number;
    league: LeagueTier;
    isCurrentUser?: boolean;
}

// Level System
export interface LevelInfo {
    level: number;
    title: string;
    requiredXP: number;
    nextLevelXP: number;
}

export const LEVEL_DATA: LevelInfo[] = [
    { level: 1, title: '첫 숟가락', requiredXP: 0, nextLevelXP: 100 },
    { level: 2, title: '식단 새싹', requiredXP: 100, nextLevelXP: 300 },
    { level: 3, title: '균형 루키', requiredXP: 300, nextLevelXP: 600 },
    { level: 4, title: '영양 탐험가', requiredXP: 600, nextLevelXP: 1000 },
    { level: 5, title: '한끼 마스터', requiredXP: 1000, nextLevelXP: 1500 },
    { level: 6, title: '헬시 히어로', requiredXP: 1500, nextLevelXP: 2100 },
    { level: 7, title: '뉴트리션 프로', requiredXP: 2100, nextLevelXP: 2800 },
    { level: 8, title: '식단 챔피언', requiredXP: 2800, nextLevelXP: 3600 },
    { level: 9, title: '웰니스 레전드', requiredXP: 3600, nextLevelXP: 4500 },
    { level: 10, title: '한끼의 절친', requiredXP: 4500, nextLevelXP: 5500 },
];

// Streak Milestones
export const STREAK_MILESTONES = [
    { days: 3, badge: '시작이 반', xp: 30 },
    { days: 7, badge: '일주일 완식', xp: 50, freezeReward: 1 },
    { days: 14, badge: '2주 챌린저', xp: 80 },
    { days: 30, badge: '한달 마스터', xp: 200, specialReward: 'hanki_skin' },
    { days: 100, badge: '백일의 기적', xp: 500 },
];

// XP Actions
export const XP_ACTIONS = {
    MEAL_RECORD: 10,
    REVERSE_PLAN_CREATE: 10,
    REVERSE_PLAN_COMPLETE: 30,
    DAILY_GOAL_ACHIEVED: 25,
    WEEKLY_GOAL_ACHIEVED: 100,
    STREAK_7_DAYS: 50,
    STREAK_30_DAYS: 200,
    FIRST_RECORD: 20,
    PROFILE_COMPLETE: 30,
    QUEST_EASY: 10,
    QUEST_CHALLENGE: 25,
    ALL_QUESTS_COMPLETE: 15,
} as const;

// League Colors
export const LEAGUE_COLORS: Record<LeagueTier, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
};

export interface TrainerMember {
    id: string;
    name: string;
    email: string;
    profile: UserProfile;
    gamification: GamificationData;
    lastRecordDate?: Date;
    daysWithoutRecord: number;
    weeklyRecordRate: number;
    reversePlanUsageRate: number;
    isAtRisk: boolean;
}

// ========================================
// Hyper-Personalization Types (v2.0)
// ========================================

// 오늘 컨디션 레벨
export type ConditionLevel = 'tired' | 'okay' | 'energetic';

// 감정 상태
export type MoodType = 'stressed' | 'neutral' | 'happy' | 'sad' | 'excited';

// 동행인 타입
export type CompanionType = 'alone' | 'colleague' | 'family' | 'friend' | 'date';

// 일정 이벤트 타입
export interface ScheduleEvent {
    id: string;
    title: string;
    type: 'meeting' | 'dining' | 'workout' | 'other';
    time: Date;
    isDiningEvent: boolean; // 회식, 외식 등
}

// 날씨 정보
export interface WeatherInfo {
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'cold' | 'hot';
}

// 사용자 맥락 정보
export interface UserContext {
    todayCondition?: ConditionLevel;
    todayMood?: MoodType;
    companion?: CompanionType;
    todaySchedule: ScheduleEvent[];
    weather?: WeatherInfo;
    checkedInAt?: Date;
    lastMealTime?: Date;
}

// 학습된 사용자 패턴
export interface UserPattern {
    preferredMeals: string[]; // 자주 선택하는 메뉴
    skippedMeals: string[]; // 스킵하는 메뉴
    averageMealTimes: {
        breakfast?: string; // "08:30" 형식
        lunch?: string;
        dinner?: string;
    };
    weekdayPatterns: Record<number, string[]>; // 요일별 선호 메뉴 (0=일요일)
    calorieAdherence: number; // 목표 대비 실제 섭취 비율 (0.8 ~ 1.2)
}

// 한끼 AI Agent 제안
export interface HankiSuggestion {
    id: string;
    type: 'meal_time' | 'nutrition_balance' | 'schedule_alert' | 'streak_celebration' | 'comfort';
    title: string;
    message: string;
    actions: {
        label: string;
        action: 'navigate' | 'dismiss' | 'snooze';
        target?: string;
    }[];
    priority: 'low' | 'medium' | 'high';
    triggeredAt: Date;
    isDismissed: boolean;
}

// 한끼 대화 메시지
export interface HankiChatMessage {
    id: string;
    type: 'hanki' | 'user';
    content: string;
    timestamp: Date;
    quickReplies?: string[];
}

// ==========================================
// 커뮤니티 게시판 타입 (v2.0)
// ==========================================

// 게시판 카테고리
export type BoardCategory =
    | 'hot'       // 🔥 인기글
    | 'free'      // 💬 자유게시판
    | 'info'      // 🥗 다이어트 정보
    | 'fitness'   // 💪 운동+식단
    | 'recipe'    // 🍳 레시피 공유
    | 'review'    // 🏪 식당/제품 후기
    | 'qna'       // ❓ 질문게시판
    | 'challenge' // 🎉 인증게시판
    | 'notice';   // 📢 공지/이벤트

// 게시판 정보
export interface BoardInfo {
    id: BoardCategory;
    name: string;
    emoji: string;
    description: string;
}

// 게시글
export interface CommunityPost {
    id: string;
    boardId: BoardCategory;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    authorLevel: number;
    authorTitle: string;
    authorStreak?: number;
    createdAt: Date;
    updatedAt?: Date;
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    scrapCount: number;
    isHot: boolean;
    isPinned: boolean;
    images?: string[];
    hashtags?: string[];
    // Q&A 전용
    isSolved?: boolean;
    acceptedAnswerId?: string;
}

// 댓글
export interface Comment {
    id: string;
    postId: string;
    parentId?: string; // 대댓글용
    authorId: string;
    authorName: string;
    authorLevel: number;
    content: string;
    createdAt: Date;
    likeCount: number;
    isAuthor: boolean; // 글쓴이 여부
    isAccepted?: boolean; // Q&A 채택 답변
    isBest?: boolean; // 베스트 댓글
}

// 커뮤니티 유저 프로필
export interface CommunityUserProfile {
    userId: string;
    nickname: string;
    level: number;
    levelTitle: string;
    streak: number;
    postCount: number;
    commentCount: number;
    totalLikes: number;
    acceptedAnswers?: number;
    badges: string[];
}

// 게시판 목록
export const BOARD_LIST: BoardInfo[] = [
    { id: 'hot', name: 'HOT 게시판', emoji: '🔥', description: '인기글 모음' },
    { id: 'free', name: '자유게시판', emoji: '💬', description: '잡담, 일상' },
    { id: 'info', name: '다이어트 정보', emoji: '🥗', description: '팁, 노하우' },
    { id: 'fitness', name: '운동+식단', emoji: '💪', description: '헬스, PT 관련' },
    { id: 'recipe', name: '레시피 공유', emoji: '🍳', description: '건강 요리' },
    { id: 'review', name: '식당/제품 후기', emoji: '🏪', description: '리뷰' },
    { id: 'qna', name: '질문게시판', emoji: '❓', description: 'Q&A' },
    { id: 'challenge', name: '인증게시판', emoji: '🎉', description: '성공후기, 바디체크' },
    { id: 'notice', name: '공지/이벤트', emoji: '📢', description: '공지사항' },
];

// 인기글 시간 필터
export type HotTimeFilter = 'realtime' | 'daily' | 'weekly';

// 정렬 옵션
export type PostSortOption = 'latest' | 'popular' | 'comments' | 'views';

// Type aliases for compatibility
export type BoardType = BoardCategory;
export type CommunityComment = Comment;

// ==========================================
// Post (Feed) 타입
// ==========================================

export interface PostAuthor {
    id: string;
    name: string;
    avatar: string;
    level: number;
    badges: string[];
}

export interface Post {
    id: string;
    author: PostAuthor;
    content: string;
    image?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    likes: number;
    comments: number;
    createdAt: string;
    isLiked: boolean;
}

// ==========================================
// Squad & Challenge 타입 (v2.0)
// ==========================================

export type SquadCategory = 'diet' | 'muscle' | 'healthy' | 'local' | 'challenge';

export interface Squad {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    memberCount: number;
    maxMembers: number;
    isPrivate: boolean;
    activeChallenges: number;
    ownerId: string;
    ownerName: string;
    tags: string[];
    createdAt: Date;
    weeklyXP: number;
    category?: SquadCategory;
}

export interface SquadMember {
    id: string;
    squadId: string;
    userId: string;
    userName: string;
    profileImage?: string;
    role: 'owner' | 'admin' | 'member';
    weeklyXP: number;
    streak: number;
    joinedAt: Date;
}

export type ChallengeType =
    | 'streak'          // Maintain streak for N days
    | 'calorie'         // Stay within calorie range
    | 'protein'         // Meet protein goal
    | 'record'          // Record N meals
    | 'steps'           // Steps challenge
    | 'meal_count'      // Record N meals (alias for record)
    | 'calorie_target'  // Stay within calorie range (alias for calorie)
    | 'protein_goal'    // Meet protein goal (alias for protein)
    | 'community'       // Social challenges
    | 'custom';         // Custom rules
export type ChallengeStatus =
    | 'draft'       // Created, not published
    | 'upcoming'    // Published, not started
    | 'active'      // In progress
    | 'calculating' // End period, calculating results
    | 'completed'   // Results finalized
    | 'archived'    // Historical (30+ days after completion)
    | 'cancelled';  // Cancelled before completion

export interface Challenge {
    id: string;
    squadId: string;
    title: string;
    description: string;
    emoji?: string;
    type: ChallengeType;
    goal: number;
    unit: string;
    startDate: Date;
    endDate: Date;
    status: ChallengeStatus;
    participants: number;
    progress?: number;
    createdBy?: string;
    rewards?: {
        first: number;
        second: number;
        third: number;
        participation: number;
    };
    prizes?: ChallengePrize[];
    imageUrl?: string;
}

export interface ChallengePrize {
    rank: number;
    reward: string;
    points?: number;
}

export interface ChallengeParticipant {
    id: string;
    challengeId?: string;
    userId: string;
    userName: string;
    profileImage?: string;
    progress: number;
    goal: number;
    rank: number;
    streak?: number;
    joinedAt?: Date;
    dailyRecord?: { date: string; verified: boolean; value?: number }[];
    lastVerifiedAt?: Date;
}

export interface ChallengeVerification {
    id: string;
    challengeId: string;
    userId: string;
    userName: string;
    profileImage?: string;
    imageUrl: string;
    caption?: string;
    progress: number;
    reactions: { fire: number; thumbsUp: number; heart: number };
    verifiedAt: Date;
}
