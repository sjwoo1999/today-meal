'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Mobile Components
import BottomNav from '@/components/BottomNav';
import HomePage from '@/components/HomePage';
import RecordPage from '@/components/RecordPage';
import ReversePlanner from '@/components/ReversePlanner';
import LeaguePage from '@/components/LeaguePage';
import ProfilePage from '@/components/ProfilePage';
import { XPPopup, CelebrationModal } from '@/components/Gamification';
import { CommunityPage } from '@/components/community';

// PC Components
import Sidebar from '@/components/pc/Sidebar';
import Header from '@/components/pc/Header';
import HankiWidget from '@/components/pc/HankiWidget';
import PCDashboard from '@/components/pc/Dashboard';
import CalendarView from '@/components/pc/CalendarView';
import PCReversePlanner from '@/components/pc/ReversePlanner';

export default function ResponsiveApp() {
    const { activeTab } = useUIStore();

    // Initialize keyboard shortcuts for PC
    useKeyboardShortcuts();

    // Render mobile page based on active tab
    const renderMobilePage = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage key="home" />;
            case 'record':
                return <RecordPage key="record" />;
            case 'planner':
                return <ReversePlanner key="planner" dailyCalorieGoal={1800} dailyProteinGoal={120} />;
            case 'league':
                return <LeaguePage key="league" />;
            case 'community':
                return <CommunityPage key="community" />;
            case 'profile':
                return <ProfilePage key="profile" />;
            default:
                return <HomePage key="home" />;
        }
    };

    // Render PC page based on active tab
    const renderPCPage = () => {
        switch (activeTab) {
            case 'home':
                return <PCDashboard key="home" />;
            case 'dashboard':
                return <PCDashboard key="dashboard" />;
            case 'record':
                return <RecordPage key="record" />;
            case 'planner':
                return <PCReversePlanner key="planner" />;
            case 'calendar':
                return <CalendarView key="calendar" />;
            case 'league':
                return <LeaguePage key="league" />;
            case 'community':
                return <CommunityPage key="community" />;
            case 'quests':
                return <PCDashboard key="quests" />; // Quests shown in dashboard
            case 'analysis':
                return <PCDashboard key="analysis" />; // Would be analysis page
            case 'profile':
                return <ProfilePage key="profile" />;
            default:
                return <PCDashboard key="home" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Global UI Components */}
            <XPPopup />
            <CelebrationModal />

            {/* Mobile Layout */}
            <div className="lg:hidden">
                <AnimatePresence mode="wait">
                    <motion.main
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderMobilePage()}
                    </motion.main>
                </AnimatePresence>
                <BottomNav />
            </div>

            {/* PC Layout */}
            <div className="hidden lg:flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header */}
                    <Header />

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {renderPCPage()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {/* Hanki Widget (PC only) */}
                <HankiWidget />
            </div>
        </div>
    );
}
