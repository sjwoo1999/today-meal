'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/pc/Sidebar';
import Header from '@/components/pc/Header';
import HankiWidget from '@/components/pc/HankiWidget';
import BottomNav from '@/components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { XPPopup, CelebrationModal } from '@/components/Gamification';

interface ResponsiveLayoutProps {
    children: ReactNode;
    pageKey?: string;
}

export default function ResponsiveLayout({ children, pageKey = 'page' }: ResponsiveLayoutProps) {
    return (
        <div className="min-h-screen">
            {/* Global UI Components */}
            <XPPopup />
            <CelebrationModal />

            {/* Mobile Layout */}
            <div className="lg:hidden bg-cream max-w-lg mx-auto min-h-screen shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.main
                        key={pageKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
                <BottomNav />
            </div>

            {/* PC Layout */}
            <div className="hidden lg:flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header */}
                    <Header />

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-4 lg:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pageKey}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="max-w-6xl mx-auto bg-white rounded-xl shadow-soft p-6"
                            >
                                {children}
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
