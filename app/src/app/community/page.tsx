'use client';

import { useState } from 'react';
import { CommunityMain, PostDetail, WritePost } from '@/components/community';
import { CommunityPost } from '@/types';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

export default function CommunityPage() {
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [showWritePost, setShowWritePost] = useState(false);

    const renderContent = () => {
        if (showWritePost) {
            return (
                <WritePost
                    onClose={() => setShowWritePost(false)}
                    onSubmit={(data) => {
                        console.log('새 글:', data);
                        setShowWritePost(false);
                    }}
                />
            );
        }

        if (selectedPost) {
            return (
                <PostDetail
                    post={selectedPost}
                    onBack={() => setSelectedPost(null)}
                />
            );
        }

        return (
            <CommunityMain
                onPostClick={(post) => setSelectedPost(post)}
                onWriteClick={() => setShowWritePost(true)}
            />
        );
    };

    return (
        <ResponsiveLayout pageKey={selectedPost ? `post-${selectedPost.id}` : showWritePost ? 'write' : 'list'}>
            {renderContent()}
        </ResponsiveLayout>
    );
}

