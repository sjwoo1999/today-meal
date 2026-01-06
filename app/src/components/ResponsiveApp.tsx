'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Auth Flow
import { AuthFlow } from '@/components/auth';

// Mobile Components
import BottomNav from '@/components/BottomNav';
import HomePage from '@/components/HomePage';
import FeedPage from '@/components/FeedPage';
import RecordPage from '@/components/RecordPage';
import ReversePlanner from '@/components/ReversePlanner';
import ProfilePage from '@/components/ProfilePage';
import ToolsHub from '@/components/ToolsHub';
import NearbyRestaurantsMobile from '@/components/NearbyRestaurantsMobile';
import SquadPage from '@/components/SquadPage';
import { XPPopup, CelebrationModal } from '@/components/Gamification';
import { CommunityPage } from '@/components/community';
import { CoachPage } from '@/components/coach';
import { ShopPage } from '@/components/shop';
import { SettingsPage } from '@/components/settings';
import { UserProfilePage } from '@/components/profile';

// PC Layout Components (3-column layout)
import PCLayout from '@/components/layout/PCLayout';

// Legacy PC Components (for specific pages)
import CalendarView from '@/components/pc/CalendarView';
import PCReversePlanner from '@/components/pc/ReversePlanner';
import NearbyRestaurants from '@/components/pc/NearbyRestaurants';

export default function ResponsiveApp() {
    const { activeTab } = useUIStore();
    const { isTablet, isDesktopOrLarger } = useBreakpoint();

    // Initialize keyboard shortcuts for PC (handled in PCLayout for desktop)
    useKeyboardShortcuts();

    // Render mobile page based on active tab
    const renderMobilePage = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage key="home" />;
            case 'feed':
                return <FeedPage key="feed" />;
            case 'boards':
                return <CommunityPage key="boards" />;
            case 'record':
                return <RecordPage key="record" />;
            case 'squad':
                return <SquadPage key="squad" />;
            case 'coach':
                return <CoachPage key="coach" />;
            case 'shop':
                return <ShopPage key="shop" />;
            case 'settings':
                return <SettingsPage key="settings" />;
            case 'tools':
                return <ToolsHub key="tools" />;
            case 'planner':
                return <ReversePlanner key="planner" dailyCalorieGoal={1800} dailyProteinGoal={120} />;
            case 'nearby':
                return <NearbyRestaurantsMobile key="nearby" />;
            case 'profile':
                return <ProfilePage key="profile" />;
            case 'userProfile':
                return <UserProfilePage key="userProfile" />;
            default:
                return <FeedPage key="feed" />;
        }
    };

    // Render PC page based on active tab
    const renderPCPage = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage key="home" />;
            case 'feed':
                return <FeedPage key="feed" />;
            case 'boards':
            case 'community':
                return <CommunityPage key="boards" />;
            case 'record':
                return <RecordPage key="record" />;
            case 'squad':
                return <SquadPage key="squad" />;
            case 'coach':
                return <CoachPage key="coach" />;
            case 'shop':
                return <ShopPage key="shop" />;
            case 'settings':
                return <SettingsPage key="settings" />;
            case 'tools':
            case 'dashboard':
                return <ToolsHub key="tools" />;
            case 'planner':
                return <PCReversePlanner key="planner" />;
            case 'calendar':
                return <CalendarView key="calendar" />;
            case 'nearby':
                return <NearbyRestaurants key="nearby" />;
            case 'profile':
                return <ProfilePage key="profile" />;
            case 'userProfile':
                return <UserProfilePage key="userProfile" />;
            default:
                return <FeedPage key="feed" />;
        }
    };

    // Render content based on platform
    const renderContent = () => {
        // Desktop: Use 3-column PCLayout
        if (isDesktopOrLarger) {
            return (
                <PCLayout showRightPanel={true}>
                    {renderPCPage()}
                </PCLayout>
            );
        }

        // Tablet: Use simplified layout (no right panel, mobile-like with bottom nav)
        if (isTablet) {
            return (
                <>
                    <AnimatePresence mode="wait">
                        <motion.main
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="pb-20"
                        >
                            {renderMobilePage()}
                        </motion.main>
                    </AnimatePresence>
                    <BottomNav />
                </>
            );
        }

        // Mobile: Standard mobile layout
        return (
            <>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="pb-20"
                    >
                        {renderMobilePage()}
                    </motion.main>
                </AnimatePresence>
                <BottomNav />
            </>
        );
    };

    return (
        <AuthFlow>
            <div className="min-h-screen bg-gray-50">
                {/* Global UI Components */}
                <XPPopup />
                <CelebrationModal />

                {/* Responsive Content */}
                {renderContent()}
            </div>
        </AuthFlow>
    );
}
