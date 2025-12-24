'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/components/HomePage';
import RecordPage from '@/components/RecordPage';
import ReversePlanner from '@/components/ReversePlanner';
import LeaguePage from '@/components/LeaguePage';
import ProfilePage from '@/components/ProfilePage';
import { XPPopup, CelebrationModal } from '@/components/Gamification';
import { CommunityPage } from '@/components/community';

export default function MemberApp() {
    const { activeTab } = useUIStore();

    const renderPage = () => {
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

    return (
        <div className="min-h-screen bg-white">
            {/* Global UI Components */}
            <XPPopup />
            <CelebrationModal />

            {/* Page Content */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderPage()}
                </motion.main>
            </AnimatePresence>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
