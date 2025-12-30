// Add more tabs for PC
export interface UIState {
    isLoading: boolean;
    showXPPopup: { show: boolean; amount: number; reason: string };
    showCelebration: { show: boolean; type: string };
    activeTab: 'feed' | 'boards' | 'record' | 'tools' | 'profile' | 'planner' | 'dashboard' | 'calendar' | 'community' | 'home' | 'league' | 'quests' | 'analysis' | 'nearby';
    setLoading: (loading: boolean) => void;
    showXP: (amount: number, reason: string) => void;
    hideXP: () => void;
    triggerCelebration: (type: string) => void;
    hideCelebration: () => void;
    setActiveTab: (tab: UIState['activeTab']) => void;
}
