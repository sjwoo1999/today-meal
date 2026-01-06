'use client';

import { useEffect, useCallback } from 'react';
import SquadListPage from '@/components/squad/SquadListPage';
import BottomNav from '@/components/BottomNav';
import { useUIStore } from '@/store';

export default function SquadRoute() {
    const { setActiveTab } = useUIStore();

    useEffect(() => {
        setActiveTab('squad');
    }, [setActiveTab]);

    const handleSquadSelect = useCallback((squadId: string) => {
        console.log('Selected squad:', squadId);
        // TODO: Navigate to squad detail page
    }, []);

    const handleChallengeSelect = useCallback((challengeId: string) => {
        console.log('Selected challenge:', challengeId);
        // TODO: Navigate to challenge detail page
    }, []);

    return (
        <>
            <SquadListPage
                onSquadSelect={handleSquadSelect}
                onChallengeSelect={handleChallengeSelect}
            />
            <BottomNav />
        </>
    );
}
