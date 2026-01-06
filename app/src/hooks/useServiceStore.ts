/**
 * Service-Store Integration Hooks
 *
 * Bridges the gap between service layer and Zustand stores,
 * providing unified interfaces for UI components.
 */

import { useCallback, useEffect, useState } from 'react';
import {
    useFeedStore,
    useChallengeStore,
    usePointStore,
    useInventoryStore,
    useSquadStore,
    useNotificationStore,
    useUIStore,
} from '@/store';

// Services
import { feedService } from '@/services/feedService';
import { pointService, type PointSource } from '@/services/pointService';
import { challengeService } from '@/services/challengeService';
import { notificationService } from '@/services/notificationService';

// Types
import type { ViewState } from '@/components/common';

/**
 * Convert service/store state to ViewState for StateContainer
 */
export function useViewState<T>(
    data: T | null | undefined,
    isLoading: boolean,
    error: Error | null | string | undefined
): ViewState {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!data || (Array.isArray(data) && data.length === 0)) return 'empty';
    return 'success';
}

/**
 * Feed Hook - Integrates feedService with useFeedStore
 */
export function useFeed() {
    const {
        posts,
        feedState,
        hasMore,
        cursor,
        filter,
        setPosts,
        appendPosts,
        setFeedState,
        setHasMore,
        setCursor,
        setFilter,
        toggleLike,
        incrementComments,
        clearFeed,
    } = useFeedStore();

    const [error, setError] = useState<Error | null>(null);

    const loadFeed = useCallback(async (userId: string) => {
        try {
            setError(null);
            setFeedState('loading');
            const response = await feedService.generateFeed({ userId, filter });
            setPosts(response.posts);
            setHasMore(response.hasMore);
            setCursor(response.nextCursor || null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('피드를 불러오는데 실패했습니다'));
            setFeedState('error');
        }
    }, [filter, setPosts, setFeedState, setHasMore, setCursor]);

    const refreshFeed = useCallback(async (userId: string) => {
        try {
            setError(null);
            setFeedState('refreshing');
            const response = await feedService.refreshFeed(userId);
            setPosts(response.posts);
            setHasMore(response.hasMore);
            setCursor(response.nextCursor || null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('피드 새로고침에 실패했습니다'));
            setFeedState('error');
        }
    }, [setPosts, setFeedState, setHasMore, setCursor]);

    const loadMore = useCallback(async (userId: string) => {
        if (!hasMore || feedState === 'loadingMore' || !cursor) return;

        try {
            setFeedState('loadingMore');
            const response = await feedService.loadMoreFeed(userId, cursor);
            appendPosts(response.posts);
            setHasMore(response.hasMore);
            setCursor(response.nextCursor || null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('더 불러오기에 실패했습니다'));
            setFeedState('error');
        }
    }, [hasMore, feedState, cursor, appendPosts, setFeedState, setHasMore, setCursor]);

    const handleLike = useCallback(async (userId: string, postId: string) => {
        toggleLike(postId);
        await feedService.trackFeedInteraction(userId, postId, 'like');
    }, [toggleLike]);

    const viewState = useViewState(posts, feedState === 'loading', error);

    return {
        // State
        posts,
        feedState,
        hasMore,
        filter,
        error,
        viewState,
        // Actions
        loadFeed,
        refreshFeed,
        loadMore,
        handleLike,
        incrementComments,
        setFilter,
        clearFeed,
    };
}

/**
 * Points Hook - Integrates pointService with usePointStore
 */
export function usePoints() {
    const {
        balance,
        transactions,
        isLoading,
        pendingReward,
        setBalance,
        setTransactions,
        addTransaction,
        updateBalance,
        setLoading,
        setPendingReward,
        claimReward,
    } = usePointStore();

    const { showXP } = useUIStore();
    const [error, setError] = useState<Error | null>(null);

    const fetchBalance = useCallback(async (userId: string) => {
        try {
            setError(null);
            setLoading(true);
            const balanceData = await pointService.getBalance(userId);
            setBalance(balanceData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('잔액 조회에 실패했습니다'));
        } finally {
            setLoading(false);
        }
    }, [setBalance, setLoading]);

    const fetchHistory = useCallback(async (userId: string, limit = 20) => {
        try {
            setError(null);
            setLoading(true);
            const history = await pointService.getTransactionHistory(userId, { limit });
            setTransactions(history);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('거래 내역 조회에 실패했습니다'));
        } finally {
            setLoading(false);
        }
    }, [setTransactions, setLoading]);

    const earnPoints = useCallback(async (
        userId: string,
        source: PointSource,
        metadata: Record<string, unknown> = {},
        showAnimation = true
    ) => {
        try {
            const transaction = await pointService.earnPoints(userId, source, 1, metadata);
            addTransaction(transaction);
            updateBalance(transaction.amount, 'earn');

            if (showAnimation) {
                showXP(transaction.amount, transaction.description || '포인트 획득!');
            }

            return transaction;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('포인트 적립에 실패했습니다'));
            return null;
        }
    }, [addTransaction, updateBalance, showXP]);

    const spendPoints = useCallback(async (
        userId: string,
        amount: number,
        source: PointSource,
        metadata: Record<string, unknown> = {}
    ) => {
        try {
            const transaction = await pointService.spendPoints(userId, amount, source, metadata);
            if (transaction) {
                addTransaction(transaction);
                updateBalance(amount, 'spend');
            }
            return transaction;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('포인트 사용에 실패했습니다'));
            return null;
        }
    }, [addTransaction, updateBalance]);

    const viewState = useViewState(balance, isLoading, error);

    return {
        // State
        balance,
        transactions,
        isLoading,
        pendingReward,
        error,
        viewState,
        // Actions
        fetchBalance,
        fetchHistory,
        earnPoints,
        spendPoints,
        setPendingReward,
        claimReward,
    };
}

/**
 * Challenge Hook - Integrates challengeService with useChallengeStore
 */
export function useChallenge() {
    const {
        activeChallenges,
        myChallenges,
        currentChallenge,
        progress,
        isLoading,
        setActiveChallenges,
        setMyChallenges,
        setCurrentChallenge,
        updateProgress,
        joinChallenge: storeJoinChallenge,
        leaveChallenge: storeLeaveChallenge,
        setLoading,
    } = useChallengeStore();

    const [error, setError] = useState<Error | null>(null);

    const fetchChallenge = useCallback(async (challengeId: string) => {
        try {
            setError(null);
            setLoading(true);
            const challenge = await challengeService.getChallenge(challengeId);
            setCurrentChallenge(challenge);
            return challenge;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('챌린지를 불러오는데 실패했습니다'));
            return null;
        } finally {
            setLoading(false);
        }
    }, [setCurrentChallenge, setLoading]);

    const fetchProgress = useCallback(async (challengeId: string, userId: string) => {
        try {
            const progressData = await challengeService.getProgress(challengeId, userId);
            updateProgress(challengeId, progressData);
            return progressData;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('진행 상황을 불러오는데 실패했습니다'));
            return null;
        }
    }, [updateProgress]);

    const joinChallenge = useCallback(async (challengeId: string, userId: string) => {
        try {
            setError(null);
            const participant = await challengeService.joinChallenge(challengeId, userId);
            if (participant) {
                storeJoinChallenge(challengeId);
            }
            return participant;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('챌린지 참가에 실패했습니다'));
            return null;
        }
    }, [storeJoinChallenge]);

    const recordProgress = useCallback(async (
        challengeId: string,
        userId: string,
        value: number
    ) => {
        try {
            const newProgress = await challengeService.recordProgress(challengeId, userId, value);
            updateProgress(challengeId, newProgress);
            return newProgress;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('진행 기록에 실패했습니다'));
            return null;
        }
    }, [updateProgress]);

    const viewState = useViewState(
        currentChallenge || activeChallenges,
        isLoading,
        error
    );

    return {
        // State
        activeChallenges,
        myChallenges,
        currentChallenge,
        progress,
        isLoading,
        error,
        viewState,
        // Actions
        fetchChallenge,
        fetchProgress,
        joinChallenge,
        leaveChallenge: storeLeaveChallenge,
        recordProgress,
        setActiveChallenges,
        setMyChallenges,
    };
}

/**
 * Squad Hook - Uses useSquadStore with useChallengeStore integration
 */
export function useSquad() {
    const {
        mySquads,
        currentSquad,
        members,
        isLoading,
        setMySquads,
        setCurrentSquad,
        setMembers,
        addSquad,
        leaveSquad,
        updateSquad,
        setLoading,
    } = useSquadStore();

    const { activeChallenges } = useChallengeStore();
    const [error] = useState<Error | null>(null);

    // Get challenges for current squad
    const squadChallenges = currentSquad
        ? activeChallenges.filter(c => c.squadId === currentSquad.id)
        : [];

    const viewState = useViewState(mySquads, isLoading, error);

    return {
        // State
        mySquads,
        currentSquad,
        members,
        squadChallenges,
        isLoading,
        error,
        viewState,
        // Actions
        setMySquads,
        setCurrentSquad,
        setMembers,
        addSquad,
        leaveSquad,
        updateSquad,
        setLoading,
    };
}

/**
 * Notifications Hook - Integrates notificationService with useNotificationStore
 */
export function useNotifications() {
    const {
        notifications,
        unreadCount,
        preferences,
        isLoading,
        setNotifications,
        markAsRead: storeMarkAsRead,
        markAllAsRead: storeMarkAllAsRead,
        setUnreadCount,
        setPreferences,
        updatePreference,
        setLoading,
        clearNotifications,
    } = useNotificationStore();

    const [error, setError] = useState<Error | null>(null);

    const fetchNotifications = useCallback(async (userId: string) => {
        try {
            setError(null);
            setLoading(true);
            const notifs = await notificationService.getNotifications(userId);
            setNotifications(notifs);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('알림을 불러오는데 실패했습니다'));
        } finally {
            setLoading(false);
        }
    }, [setNotifications, setLoading]);

    const fetchUnreadCount = useCallback(async (userId: string) => {
        try {
            const count = await notificationService.getUnreadCount(userId);
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }, [setUnreadCount]);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            storeMarkAsRead(notificationId);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('읽음 처리에 실패했습니다'));
        }
    }, [storeMarkAsRead]);

    const markAllAsRead = useCallback(async (userId: string) => {
        try {
            await notificationService.markAllAsRead(userId);
            storeMarkAllAsRead();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('전체 읽음 처리에 실패했습니다'));
        }
    }, [storeMarkAllAsRead]);

    const fetchPreferences = useCallback(async (userId: string) => {
        try {
            const prefs = await notificationService.getPreferences(userId);
            setPreferences(prefs);
        } catch (err) {
            console.error('Failed to fetch preferences:', err);
        }
    }, [setPreferences]);

    const viewState = useViewState(notifications, isLoading, error);

    return {
        // State
        notifications,
        unreadCount,
        preferences,
        isLoading,
        error,
        viewState,
        // Actions
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        fetchPreferences,
        updatePreference,
        clearNotifications,
    };
}

/**
 * Inventory Hook - Wrapper for useInventoryStore with purchase integration
 */
export function useInventory() {
    const {
        items,
        equippedTheme,
        equippedBadge,
        setItems,
        addItem,
        equipItem,
        unequipItem,
        useConsumable,
    } = useInventoryStore();

    const { balance, spendPoints } = usePoints();

    const purchaseItem = useCallback(async (
        userId: string,
        item: {
            id: string;
            itemId: string;
            name: string;
            type: 'theme' | 'badge' | 'item' | 'consumable';
            imageUrl: string;
            price: number;
        }
    ) => {
        // Check balance
        if (!balance || balance.available < item.price) {
            return { success: false, error: '포인트가 부족합니다' };
        }

        // Spend points
        const transaction = await spendPoints(userId, item.price, 'purchase', {
            itemId: item.itemId,
            itemName: item.name,
        });

        if (!transaction) {
            return { success: false, error: '결제에 실패했습니다' };
        }

        // Add to inventory
        addItem({
            id: `inv_${Date.now()}`,
            itemId: item.itemId,
            name: item.name,
            type: item.type,
            imageUrl: item.imageUrl,
        });

        return { success: true };
    }, [balance, spendPoints, addItem]);

    const hasItem = useCallback((itemId: string) => {
        return items.some(i => i.itemId === itemId);
    }, [items]);

    const getItemQuantity = useCallback((itemId: string) => {
        const item = items.find(i => i.itemId === itemId);
        return item?.quantity || 0;
    }, [items]);

    return {
        // State
        items,
        equippedTheme,
        equippedBadge,
        // Actions
        setItems,
        addItem,
        equipItem,
        unequipItem,
        useConsumable,
        purchaseItem,
        hasItem,
        getItemQuantity,
    };
}

/**
 * Auto-fetch hook for initial data loading
 */
export function useAutoFetch(userId: string | undefined) {
    const { fetchBalance } = usePoints();
    const { fetchUnreadCount } = useNotifications();

    useEffect(() => {
        if (userId) {
            fetchBalance(userId);
            fetchUnreadCount(userId);
        }
    }, [userId, fetchBalance, fetchUnreadCount]);
}
