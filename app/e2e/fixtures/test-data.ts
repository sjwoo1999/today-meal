/**
 * OneMealToday E2E Test Fixtures
 * Shared test data and mock states
 */

// Test user data
export const TEST_USER = {
  id: 'test_user_1',
  name: '테스트 사용자',
  email: 'test@example.com',
  password: 'TestP@ss123',
  goal: 'lose' as const,
  tdee: 1800,
  gamification: {
    xp: 1500,
    level: 5,
    streak: 7,
  },
};

// Viewport configurations matching JSON spec
export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

// Mock posts for feed (declared before MOCK_STORES to avoid hoisting issues)
export const MOCK_POSTS = [
  {
    id: 'post_1',
    authorId: 'user_2',
    authorName: '건강러버',
    authorAvatar: '/avatars/user2.jpg',
    title: '오늘 점심 샐러드',
    content: '건강하게 먹었어요!',
    imageUrl: '/images/salad.jpg',
    likes: 42,
    comments: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post_2',
    authorId: 'user_3',
    authorName: '다이어터',
    authorAvatar: '/avatars/user3.jpg',
    title: '고단백 식단',
    content: '단백질 충전 완료',
    imageUrl: '/images/protein.jpg',
    likes: 28,
    comments: 3,
    createdAt: new Date().toISOString(),
  },
];

// Mock squads (declared before MOCK_STORES to avoid hoisting issues)
export const MOCK_SQUADS = [
  {
    id: 'squad_1',
    name: '다이어트 챌린저스',
    description: '함께 건강하게 체중 감량해요',
    memberCount: 128,
    isJoined: true,
  },
  {
    id: 'squad_2',
    name: '단백질 러버스',
    description: '고단백 식단 공유',
    memberCount: 89,
    isJoined: false,
  },
];

// Mock store states
export const MOCK_STORES = {
  useUserStore: {
    authenticated: {
      user: TEST_USER,
      isAuthenticated: true,
    },
    unauthenticated: {
      user: null,
      isAuthenticated: false,
    },
  },
  useUIStore: {
    default: {
      activeTab: 'home',
      showXPPopup: false,
      celebrationModal: null,
    },
  },
  useFeedStore: {
    default: {
      posts: [],
      feedState: 'idle',
    },
    loading: {
      posts: [],
      feedState: 'loading',
    },
    loaded: {
      posts: MOCK_POSTS,
      feedState: 'loaded',
    },
    error: {
      posts: [],
      feedState: 'error',
    },
  },
  usePointStore: {
    default: {
      balance: { available: 1500, pending: 0, total: 1500 },
    },
    rich: {
      balance: { available: 5000, pending: 0, total: 5000 },
    },
    poor: {
      balance: { available: 10, pending: 0, total: 10 },
    },
  },
  useSquadStore: {
    default: {
      mySquads: [],
      currentSquad: null,
    },
    withSquads: {
      mySquads: MOCK_SQUADS,
      currentSquad: null,
    },
  },
  useChallengeStore: {
    default: {
      activeChallenges: [],
      currentChallenge: null,
    },
  },
};

// Mock shop items
export const MOCK_SHOP_ITEMS = [
  {
    id: 'badge_1',
    name: '초보 기록러',
    category: 'badge',
    price: 100,
    description: '첫 기록을 시작한 당신에게',
  },
  {
    id: 'badge_2',
    name: '7일 연속 달성',
    category: 'badge',
    price: 500,
    description: '일주일 연속 기록 달성',
  },
  {
    id: 'skin_1',
    name: '봄 테마',
    category: 'skin',
    price: 1000,
    description: '벚꽃 테마 스킨',
  },
];

// Test selectors - based on data-testid attributes from JSON spec
export const SELECTORS = {
  // Auth
  kakaoLogin: '[data-testid="kakao-login"]',
  naverLogin: '[data-testid="naver-login"]',
  googleLogin: '[data-testid="google-login"]',
  signupLink: '[data-testid="signup-link"]',
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  signupButton: '[data-testid="signup-button"]',

  // Onboarding
  stepIndicator: '[data-testid="step-indicator"]',
  goalLose: '[data-testid="goal-lose"]',
  goalMaintain: '[data-testid="goal-maintain"]',
  goalGain: '[data-testid="goal-gain"]',
  nextButton: '[data-testid="next-button"]',
  skipButton: '[data-testid="skip-button"]',
  genderMale: '[data-testid="gender-male"]',
  genderFemale: '[data-testid="gender-female"]',
  heightInput: '[data-testid="height-input"]',
  weightInput: '[data-testid="weight-input"]',
  ageInput: '[data-testid="age-input"]',
  activityModerate: '[data-testid="activity-moderate"]',

  // Home
  calorieProgress: '[data-testid="calorie-progress"]',
  proteinProgress: '[data-testid="protein-progress"]',
  dailyQuests: '[data-testid="daily-quests"]',
  hankiMascot: '[data-testid="hanki-mascot"]',
  recordMealButton: '[data-testid="record-meal-button"]',

  // Feed
  storyBar: '[data-testid="story-bar"]',
  hotPosts: '[data-testid="hot-posts"]',
  hotPostCard: '[data-testid="hot-post-card"]',
  refreshButton: '[data-testid="refresh-button"]',
  pointDisplay: '[data-testid="point-display"]',
  notificationBadge: '[data-testid="notification-badge"]',

  // Record
  cameraButton: '[data-testid="camera-button"]',
  galleryButton: '[data-testid="gallery-button"]',
  aiAnalyzing: '[data-testid="ai-analyzing"]',
  recognitionResult: '[data-testid="recognition-result"]',
  completeRecord: '[data-testid="complete-record"]',
  xpPopup: '[data-testid="xp-popup"]',

  // Squad
  tabMy: '[data-testid="tab-my"]',
  tabDiscover: '[data-testid="tab-discover"]',
  tabChallenges: '[data-testid="tab-challenges"]',
  squadSearch: '[data-testid="squad-search"]',
  squadCard: '[data-testid="squad-card"]',
  createSquadButton: '[data-testid="create-squad-button"]',

  // Shop
  userPoints: '[data-testid="user-points"]',
  categoryBadge: '[data-testid="category-badge"]',
  shopItem: '[data-testid="shop-item"]',
  purchaseButton: '[data-testid="purchase-button"]',
  purchaseSuccess: '[data-testid="purchase-success"]',
  insufficientPoints: '[data-testid="insufficient-points"]',

  // Profile
  profileAvatar: '[data-testid="profile-avatar"]',
  profileName: '[data-testid="profile-name"]',
  profileLevel: '[data-testid="profile-level"]',
  settingsButton: '[data-testid="settings-button"]',

  // Common
  bottomNav: '[data-testid="bottom-nav"]',
  sidebar: '[data-testid="sidebar"]',
  loadingSkeleton: '[data-testid="loading-skeleton"]',
  emptyState: '[data-testid="empty-state"]',
  errorState: '[data-testid="error-state"]',
  retryButton: '[data-testid="retry-button"]',
};

// Helper function to navigate to specific tab
export function getTabSelector(tabKey: string): string {
  return `[data-testid="nav-${tabKey}"]`;
}

// Helper to check if on desktop layout
export function isDesktopViewport(width: number): boolean {
  return width >= 1280;
}

// Helper to check if on tablet layout
export function isTabletViewport(width: number): boolean {
  return width >= 768 && width < 1280;
}

// Helper to check if on mobile layout
export function isMobileViewport(width: number): boolean {
  return width < 768;
}
