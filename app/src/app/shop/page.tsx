'use client';

import { useEffect } from 'react';
import { ShopPage } from '@/components/shop';
import BottomNav from '@/components/BottomNav';
import { useUIStore } from '@/store';

export default function ShopRoute() {
    const { setActiveTab } = useUIStore();

    useEffect(() => {
        setActiveTab('shop');
    }, [setActiveTab]);

    return (
        <>
            <ShopPage />
            <BottomNav />
        </>
    );
}
