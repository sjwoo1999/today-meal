'use client';

import { useUIStore } from '@/store';

interface ClickableAuthorProps {
    userId: string;
    name: string;
    className?: string;
    children?: React.ReactNode;
}

export default function ClickableAuthor({
    userId,
    name,
    className = '',
    children
}: ClickableAuthorProps) {
    const { setActiveTab, setSelectedUserId } = useUIStore();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedUserId(userId);
        setActiveTab('userProfile');
    };

    return (
        <button
            onClick={handleClick}
            className={`hover:underline text-left font-medium ${className}`}
        >
            {children || name}
        </button>
    );
}
