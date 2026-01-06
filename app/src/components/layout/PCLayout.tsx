'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface PCLayoutProps {
    children: ReactNode;
    showRightPanel?: boolean;
}

export default function PCLayout({ children, showRightPanel = true }: PCLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [rightPanelVisible, setRightPanelVisible] = useState(showRightPanel);

    // Enable keyboard shortcuts on desktop
    useKeyboardShortcuts();

    const sidebarWidth = sidebarCollapsed ? 80 : 280;
    const rightPanelWidth = rightPanelVisible ? 320 : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <main
                className="transition-all duration-300"
                style={{
                    marginLeft: sidebarWidth,
                    marginRight: rightPanelWidth,
                }}
            >
                <div className="min-h-screen">
                    {/* Header */}
                    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                        <div className="flex items-center justify-between h-16 px-6">
                            <div>
                                {/* Breadcrumb or page title can go here */}
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Toggle right panel button */}
                                <button
                                    onClick={() => setRightPanelVisible(!rightPanelVisible)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={rightPanelVisible ? '패널 숨기기' : '패널 보기'}
                                >
                                    {rightPanelVisible ? (
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Right Panel */}
            <AnimatePresence>
                {rightPanelVisible && (
                    <motion.div
                        initial={{ x: 320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 320, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <RightPanel
                            isVisible={rightPanelVisible}
                            onClose={() => setRightPanelVisible(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Help Modal (can be triggered with ?) */}
            {/* <KeyboardShortcutsModal /> */}
        </div>
    );
}

// Optional: Responsive Modal wrapper that adapts to platform
interface ResponsiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export function ResponsiveModal({ isOpen, onClose, children, title }: ResponsiveModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
                >
                    {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="p-6">{children}</div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
