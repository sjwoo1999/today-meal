'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useUIStore } from '@/store';

interface ShortcutAction {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    description: string;
    action: () => void;
}

export function useKeyboardShortcuts() {
    const { setActiveTab } = useUIStore();

    const shortcuts: ShortcutAction[] = useMemo(() => [
        { key: 'n', description: '새 기록 추가', action: () => setActiveTab('record') },
        { key: 'r', description: '역추산 플래너', action: () => setActiveTab('planner') },
        { key: 'd', description: '대시보드', action: () => setActiveTab('dashboard') },
        { key: 'h', description: '홈', action: () => setActiveTab('home') },
        { key: 'q', description: '퀘스트', action: () => setActiveTab('quests') },
        { key: 'l', description: '리그', action: () => setActiveTab('league') },
        { key: 'c', description: '캘린더', action: () => setActiveTab('calendar') },
        { key: 'p', description: '프로필', action: () => setActiveTab('profile') },
    ], [setActiveTab]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Ignore if user is typing in input/textarea
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            return;
        }

        // Find matching shortcut
        const shortcut = shortcuts.find(s => {
            const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
            const ctrlMatch = s.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
            const shiftMatch = s.shift ? event.shiftKey : !event.shiftKey;
            return keyMatch && ctrlMatch && shiftMatch;
        });

        if (shortcut) {
            event.preventDefault();
            shortcut.action();
        }

        // Special: / for search focus
        if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="검색"]') as HTMLInputElement;
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Special: ? for help
        if (event.key === '?' && event.shiftKey) {
            event.preventDefault();
            console.log('Opening shortcuts help...');
        }

        // Special: Escape to close modals
        if (event.key === 'Escape') {
            console.log('Closing modals...');
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return shortcuts;
}

// Shortcut data for help display
export const KEYBOARD_SHORTCUTS = [
    { key: 'N', action: '새 기록 추가' },
    { key: 'R', action: '역추산 플래너' },
    { key: 'D', action: '대시보드' },
    { key: 'H', action: '홈' },
    { key: 'C', action: '캘린더' },
    { key: 'Q', action: '퀘스트' },
    { key: 'L', action: '리그' },
    { key: 'P', action: '프로필' },
    { key: '/', action: '음식 검색' },
    { key: '?', action: '단축키 도움말' },
    { key: 'Esc', action: '모달 닫기' },
    { key: 'Ctrl+V', action: '이미지 붙여넣기' },
    { key: 'Ctrl+Enter', action: '저장' },
    { key: '↑ ↓', action: '메뉴 선택' },
    { key: '← →', action: '날짜 이동' },
];
