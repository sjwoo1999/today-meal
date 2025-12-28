'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Bookmark } from 'lucide-react';
import { CommunityPost } from '@/types';
import MyPosts from './MyPosts';
import MyComments from './MyComments';
import MyScraps from './MyScraps';
import PostDetail from '@/components/community/PostDetail';

type TabType = 'posts' | 'comments' | 'scraps';

interface ProfileTabsProps {
    userId: string;
}

const TABS = [
    { id: 'posts' as TabType, label: '작성글', icon: FileText },
    { id: 'comments' as TabType, label: '댓글', icon: MessageSquare },
    { id: 'scraps' as TabType, label: '스크랩', icon: Bookmark },
];

export default function ProfileTabs({ userId }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

    // 게시글 클릭 핸들러
    const handlePostClick = (post: CommunityPost) => {
        setSelectedPost(post);
    };

    // 게시글 상세에서 뒤로가기
    if (selectedPost) {
        return (
            <PostDetail
                post={selectedPost}
                onBack={() => setSelectedPost(null)}
            />
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <MyPosts userId={userId} onPostClick={handlePostClick} />;
            case 'comments':
                return <MyComments userId={userId} onPostClick={handlePostClick} />;
            case 'scraps':
                return <MyScraps userId={userId} onPostClick={handlePostClick} />;
            default:
                return null;
        }
    };

    return (
        <div className="mt-4">
            {/* 탭 헤더 */}
            <div className="flex border-b border-gray-200 bg-white">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 relative
                                ${isActive ? 'text-coral-600' : 'text-gray-500'}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="profileTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral-500"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 탭 컨텐츠 */}
            <div className="bg-gray-50 min-h-[300px]">
                {renderContent()}
            </div>
        </div>
    );
}
