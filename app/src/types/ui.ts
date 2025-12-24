// Add more tabs for PC
export interface UIState {
    isLoading: boolean;
    showXPPopup: { show: boolean; amount: number; reason: string };
    showCelebration: { show: boolean; type: string };
    activeTab: 'home' | 'record' | 'planner' | 'league' | 'profile' | 'dashboard' | 'calendar' | 'quests' | 'analysis' | 'community';
    setLoading: (loading: boolean) => void;
    showXP: (amount: number, reason: string) => void;
    hideXP: () => void;
    triggerCelebration: (type: string) => void;
    hideCelebration: () => void;
    setActiveTab: (tab: UIState['activeTab']) => void;
}
