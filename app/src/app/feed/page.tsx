'use client';

import { useEffect } from 'react';
import FeedPage from '@/components/FeedPage';
import BottomNav from '@/components/BottomNav';
import { useUIStore } from '@/store';

export default function FeedRoute() {
    const { setActiveTab } = useUIStore();

    useEffect(() => {
        setActiveTab('feed');
    }, [setActiveTab]);

    return (
        <>
            <FeedPage />
            <BottomNav />
        </>
    );
}
