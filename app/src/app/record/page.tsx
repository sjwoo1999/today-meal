'use client';

import { useEffect } from 'react';
import RecordPage from '@/components/RecordPage';
import BottomNav from '@/components/BottomNav';
import { useUIStore } from '@/store';

export default function RecordRoute() {
    const { setActiveTab } = useUIStore();

    useEffect(() => {
        setActiveTab('record');
    }, [setActiveTab]);

    return (
        <>
            <RecordPage />
            <BottomNav />
        </>
    );
}
