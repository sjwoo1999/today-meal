'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Coins, Award, Palette, Zap, Gift, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useUIStore, useUserStore } from '@/store';
import { mockShopItems, getShopItemsByCategory, type ShopItem } from '@/data/mockShopItems';
import { usePoints, useInventory, useViewState } from '@/hooks/useServiceStore';
import { ShopStateContainer } from '@/components/common';

type Category = 'all' | 'badge' | 'skin' | 'boost' | 'gift';

interface CategoryTab {
    id: Category;
    label: string;
    icon: React.ReactNode;
}

const categories: CategoryTab[] = [
    { id: 'all', label: '전체', icon: <Coins className="w-4 h-4" /> },
    { id: 'badge', label: '배지', icon: <Award className="w-4 h-4" /> },
    { id: 'skin', label: '스킨', icon: <Palette className="w-4 h-4" /> },
    { id: 'boost', label: '부스터', icon: <Zap className="w-4 h-4" /> },
    { id: 'gift', label: '기프트', icon: <Gift className="w-4 h-4" /> },
];

const rarityColors: Record<ShopItem['rarity'], string> = {
    common: 'bg-gray-100 text-gray-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
    legendary: 'bg-amber-100 text-amber-600',
};

const rarityLabels: Record<ShopItem['rarity'], string> = {
    common: '일반',
    rare: '레어',
    epic: '에픽',
    legendary: '전설',
};

export default function ShopPage() {
    const { setActiveTab } = useUIStore();
    const { user } = useUserStore();

    // Use integrated hooks
    const {
        balance,
        fetchBalance,
    } = usePoints();

    const {
        hasItem,
        purchaseItem,
    } = useInventory();

    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [purchaseResult, setPurchaseResult] = useState<'success' | 'fail' | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Using balance from pointService
    const userPoints = balance?.available ?? 0;

    const filteredItems = activeCategory === 'all'
        ? mockShopItems
        : getShopItemsByCategory(activeCategory);

    // Calculate view state
    const viewState = useViewState(filteredItems, isLoading, error);

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                if (user?.id) {
                    await fetchBalance(user.id);
                }
                // Simulate loading delay for shop items
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                setError(err instanceof Error ? err : new Error('상점을 불러오는데 실패했습니다'));
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user?.id, fetchBalance]);

    const handlePurchase = useCallback(async (item: ShopItem) => {
        if (!user?.id) return;

        const isOwned = hasItem(item.id);
        if (userPoints >= item.price && !isOwned) {
            setIsPurchasing(true);
            try {
                // Use inventory purchase integration
                const result = await purchaseItem(user.id, {
                    id: `inv_${item.id}`,
                    itemId: item.id,
                    name: item.name,
                    type: item.category === 'skin' ? 'theme' : item.category as 'badge' | 'item' | 'consumable',
                    imageUrl: item.emoji,
                    price: item.price,
                });

                if (result.success) {
                    setPurchaseResult('success');
                    setTimeout(() => {
                        setPurchaseResult(null);
                        setSelectedItem(null);
                    }, 2000);
                } else {
                    setPurchaseResult('fail');
                    setTimeout(() => setPurchaseResult(null), 2000);
                }
            } catch {
                setPurchaseResult('fail');
                setTimeout(() => setPurchaseResult(null), 2000);
            } finally {
                setIsPurchasing(false);
            }
        } else if (userPoints < item.price) {
            setPurchaseResult('fail');
            setTimeout(() => setPurchaseResult(null), 2000);
        }
    }, [user?.id, userPoints, hasItem, purchaseItem]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-6">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold">포인트 상점</h1>
                </div>

                {/* Points Balance */}
                <div className="bg-white/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm">보유 포인트</p>
                            <div className="flex items-center gap-2 mt-1" data-testid="user-points">
                                <Coins className="w-6 h-6 text-amber-200" />
                                <span className="text-3xl font-bold">{userPoints.toLocaleString()}</span>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-white text-amber-600 rounded-full font-medium text-sm"
                        >
                            포인트 적립하기
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-3 bg-white border-b sticky top-0 z-10">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            data-testid={`category-${cat.id}`}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                activeCategory === cat.id
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            <div className="px-4 py-4">
                <ShopStateContainer
                    state={viewState}
                    onRetry={() => user?.id && fetchBalance(user.id)}
                >
                    <div className="grid grid-cols-2 gap-3" data-testid="shop-grid">
                        {filteredItems.map((item) => {
                            const isOwned = hasItem(item.id);
                            const canAfford = userPoints >= item.price;

                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    whileTap={{ scale: 0.98 }}
                                    data-testid={isOwned ? 'owned-item' : 'shop-item'}
                                    data-price={item.price}
                                    data-category={item.category}
                                    className={`relative bg-white rounded-2xl p-4 text-left shadow-sm ${
                                        isOwned ? 'opacity-60' : ''
                                    }`}
                                >
                                    {/* Limited Badge */}
                                    {item.isLimited && (
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                            한정
                                        </div>
                                    )}

                                    {/* Item Emoji */}
                                    <div className="text-4xl mb-3">{item.emoji}</div>

                                    {/* Rarity Badge */}
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${rarityColors[item.rarity]}`}>
                                        {rarityLabels[item.rarity]}
                                    </span>

                                    {/* Name */}
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h3>

                                    {/* Price */}
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-4 h-4 text-amber-500" />
                                        <span className={`font-bold ${canAfford ? 'text-gray-900' : 'text-red-500'}`}>
                                            {item.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Owned Badge */}
                                    {isOwned && (
                                        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                                <Check className="w-5 h-5" />
                                                보유중
                                            </div>
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </ShopStateContainer>
            </div>

            {/* Item Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-lg p-6"
                            data-testid="item-detail-modal"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                                data-testid="modal-close"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            {/* Item Details */}
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${rarityColors[selectedItem.rarity]}`}>
                                    {rarityLabels[selectedItem.rarity]}
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="item-name">{selectedItem.name}</h2>
                                <p className="text-gray-500 text-sm">{selectedItem.description}</p>
                            </div>

                            {/* Stock Info */}
                            {selectedItem.isLimited && selectedItem.stock && (
                                <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    한정 수량 {selectedItem.stock}개 남음
                                </div>
                            )}

                            {/* Price & Purchase */}
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">가격</p>
                                    <div className="flex items-center gap-1" data-testid="item-price">
                                        <Coins className="w-5 h-5 text-amber-500" />
                                        <span className="text-xl font-bold">{selectedItem.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">보유 포인트</p>
                                    <span className={`text-xl font-bold ${userPoints >= selectedItem.price ? 'text-gray-900' : 'text-red-500'}`}>
                                        {userPoints.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Purchase Button */}
                            {hasItem(selectedItem.id) ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl bg-gray-200 text-gray-500 font-bold"
                                    data-testid="purchase-button"
                                >
                                    이미 보유 중
                                </button>
                            ) : purchaseResult === 'success' ? (
                                <motion.button
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="w-full py-4 rounded-xl bg-green-500 text-white font-bold flex items-center justify-center gap-2"
                                    data-testid="purchase-success"
                                >
                                    <Check className="w-5 h-5" />
                                    구매 완료!
                                </motion.button>
                            ) : purchaseResult === 'fail' ? (
                                <button className="w-full py-4 rounded-xl bg-red-500 text-white font-bold" data-testid="insufficient-points">
                                    포인트가 부족해요
                                </button>
                            ) : isPurchasing ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl bg-amber-400 text-white font-bold flex items-center justify-center gap-2"
                                    data-testid="purchase-button"
                                >
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    구매 중...
                                </button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePurchase(selectedItem)}
                                    disabled={userPoints < selectedItem.price}
                                    data-testid="purchase-button"
                                    className={`w-full py-4 rounded-xl font-bold ${
                                        userPoints >= selectedItem.price
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {userPoints >= selectedItem.price ? '구매하기' : '포인트 부족'}
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
