'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '@/store';
import { getFollowers, getFollowing } from '@/data/mockFollows';
import FollowButton from './FollowButton';

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    type: 'followers' | 'following';
}

export default function FollowListModal({
    isOpen,
    onClose,
    userId,
    type
}: FollowListModalProps) {
    const { setActiveTab, setSelectedUserId } = useUIStore();

    const users = type === 'followers'
        ? getFollowers(userId)
        : getFollowing(userId);

    const title = type === 'followers' ? '팔로워' : '팔로잉';

    const handleUserClick = (targetUserId: string) => {
        onClose();
        setSelectedUserId(targetUserId);
        setActiveTab('userProfile');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[70vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <h2 className="text-lg font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* User List */}
                        <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                            {users.length === 0 ? (
                                <div className="py-12 text-center text-gray-500">
                                    {type === 'followers'
                                        ? '아직 팔로워가 없어요'
                                        : '아직 팔로잉하는 사람이 없어요'}
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                                        >
                                            <button
                                                onClick={() => handleUserClick(user.id)}
                                                className="flex items-center gap-3 flex-1 text-left"
                                            >
                                                {/* Avatar */}
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>

                                                {/* Info */}
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.nickname}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Lv.{user.level} {user.title}
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Follow Button (don't show for current user) */}
                                            {user.id !== 'u_001' && (
                                                <FollowButton userId={user.id} size="sm" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
