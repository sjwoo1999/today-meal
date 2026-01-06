'use client';

import { useState } from 'react';
import { mockStories, type Story } from '@/data/mockStories';
import StoryAvatar from './StoryAvatar';
import StoryViewer from './StoryViewer';
import CreateStoryModal from './CreateStoryModal';

export default function StoryBar() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleStoryClick = (story: Story) => {
        setSelectedStory(story);
        setViewedStories(prev => new Set([...Array.from(prev), story.id]));
    };

    const handleCloseViewer = () => {
        setSelectedStory(null);
    };

    const handleNextStory = () => {
        if (!selectedStory) return;
        const currentIndex = mockStories.findIndex(s => s.id === selectedStory.id);
        if (currentIndex < mockStories.length - 1) {
            const nextStory = mockStories[currentIndex + 1];
            setSelectedStory(nextStory);
            setViewedStories(prev => new Set([...Array.from(prev), nextStory.id]));
        } else {
            handleCloseViewer();
        }
    };

    const handlePrevStory = () => {
        if (!selectedStory) return;
        const currentIndex = mockStories.findIndex(s => s.id === selectedStory.id);
        if (currentIndex > 0) {
            const prevStory = mockStories[currentIndex - 1];
            setSelectedStory(prevStory);
        }
    };

    // Sort stories: unviewed first
    const sortedStories = [...mockStories].sort((a, b) => {
        const aViewed = viewedStories.has(a.id) || a.viewed;
        const bViewed = viewedStories.has(b.id) || b.viewed;
        if (aViewed && !bViewed) return 1;
        if (!aViewed && bViewed) return -1;
        return 0;
    });

    return (
        <>
            <div className="bg-white border-b border-gray-100 py-3">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4">
                    {/* Add Story Button */}
                    <StoryAvatar
                        isAddStory
                        onClick={() => setShowCreateModal(true)}
                    />

                    {/* User Stories */}
                    {sortedStories.map(story => (
                        <StoryAvatar
                            key={story.id}
                            story={{
                                ...story,
                                viewed: viewedStories.has(story.id) || story.viewed,
                            }}
                            onClick={() => handleStoryClick(story)}
                        />
                    ))}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {selectedStory && (
                <StoryViewer
                    story={selectedStory}
                    onClose={handleCloseViewer}
                    onNext={handleNextStory}
                    onPrev={handlePrevStory}
                    hasNext={mockStories.findIndex(s => s.id === selectedStory.id) < mockStories.length - 1}
                    hasPrev={mockStories.findIndex(s => s.id === selectedStory.id) > 0}
                />
            )}

            {/* Create Story Modal */}
            <CreateStoryModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </>
    );
}
