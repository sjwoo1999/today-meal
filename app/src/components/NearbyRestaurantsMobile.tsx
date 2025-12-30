'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ExternalLink, Search, Navigation, ChevronLeft, X } from 'lucide-react';
import {
    MOCK_RESTAURANTS,
    DEFAULT_LOCATION,
    type MockRestaurant,
    type FoodCategory
} from '@/data';
import StaticMap from '@/components/common/StaticMap';
import { useUIStore } from '@/store';

// Category filters
const CATEGORIES: { id: FoodCategory | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: '전체', emoji: '🍽️' },
    { id: 'snack', label: '분식', emoji: '🍙' },
    { id: 'korean', label: '한식', emoji: '🍚' },
    { id: 'western', label: '양식', emoji: '🍝' },
    { id: 'japanese', label: '일식', emoji: '🍣' },
    { id: 'chinese', label: '중식', emoji: '🥟' },
    { id: 'cafe', label: '카페', emoji: '☕' },
    { id: 'pub', label: '술집', emoji: '🍺' },
];

type SortOption = 'distance' | 'rating';

export default function NearbyRestaurantsMobile() {
    const { setActiveTab } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const [selectedRestaurant, setSelectedRestaurant] = useState<MockRestaurant | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter and sort restaurants
    const filteredRestaurants = MOCK_RESTAURANTS
        .filter(r => {
            const matchesCategory = selectedCategory === 'all' || r.category.includes(selectedCategory);
            const matchesSearch = searchQuery === '' ||
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.menuItems?.some(m => m.includes(searchQuery));
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'distance') {
                return parseInt(a.distance) - parseInt(b.distance);
            } else {
                return (b.rating || 0) - (a.rating || 0);
            }
        });

    const handleRestaurantClick = (restaurant: MockRestaurant) => {
        setSelectedRestaurant(restaurant);
        setShowDetail(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white p-4 pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => setActiveTab('tools')}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">내 주변 식당</h1>
                        <div className="flex items-center gap-1 text-sm text-coral-100">
                            <Navigation className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{DEFAULT_LOCATION.name}</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="식당명 또는 메뉴 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>
            </div>

            {/* Map - Fixed Height */}
            <div className="px-4 -mt-3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <StaticMap
                        restaurants={filteredRestaurants.slice(0, 8)}
                        selectedRestaurantId={selectedRestaurant?.id}
                        onRestaurantClick={handleRestaurantClick}
                        className="h-44"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="px-4 py-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                ${selectedCategory === cat.id
                                    ? 'bg-coral-500 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort & Count */}
            <div className="px-4 flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{filteredRestaurants.length}개 식당</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('distance')}
                        className={`text-xs px-2 py-1 rounded-lg ${sortBy === 'distance' ? 'bg-coral-50 text-coral-600 font-medium' : 'text-gray-500'}`}
                    >
                        거리순
                    </button>
                    <button
                        onClick={() => setSortBy('rating')}
                        className={`text-xs px-2 py-1 rounded-lg ${sortBy === 'rating' ? 'bg-coral-50 text-coral-600 font-medium' : 'text-gray-500'}`}
                    >
                        평점순
                    </button>
                </div>
            </div>

            {/* Restaurant List */}
            <div className="px-4 space-y-3">
                {filteredRestaurants.map((restaurant, index) => (
                    <motion.div
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
                        onClick={() => handleRestaurantClick(restaurant)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{restaurant.name}</span>
                                    {restaurant.priceRange && (
                                        <span className="text-xs text-gray-400">{restaurant.priceRange}</span>
                                    )}
                                </div>
                                {restaurant.tags && restaurant.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {restaurant.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-xs bg-coral-50 text-coral-600 px-1.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 text-sm">
                                    <MapPin className="w-3.5 h-3.5 text-coral-500" />
                                    <span className="text-coral-600 font-medium">{restaurant.distance}</span>
                                </div>
                                {restaurant.rating && (
                                    <div className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-xs text-gray-600">{restaurant.rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {restaurant.menuItems && (
                            <div className="flex flex-wrap gap-1">
                                {restaurant.menuItems.slice(0, 3).map((menu, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                        {menu.split(' ')[0]}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Restaurant Detail Sheet */}
            <AnimatePresence>
                {showDetail && selectedRestaurant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowDetail(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Handle */}
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedRestaurant.address}</p>
                                </div>
                                <button onClick={() => setShowDetail(false)} className="p-2">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-coral-500" />
                                    <span className="text-sm font-medium">{selectedRestaurant.distance}</span>
                                </div>
                                {selectedRestaurant.rating && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-medium">{selectedRestaurant.rating}</span>
                                    </div>
                                )}
                                {selectedRestaurant.priceRange && (
                                    <span className="text-sm text-gray-500">{selectedRestaurant.priceRange}</span>
                                )}
                            </div>

                            {/* Description */}
                            {selectedRestaurant.description && (
                                <p className="text-sm text-gray-600 mb-4">{selectedRestaurant.description}</p>
                            )}

                            {/* Tags */}
                            {selectedRestaurant.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedRestaurant.tags.map((tag, i) => (
                                        <span key={i} className="text-xs bg-coral-50 text-coral-600 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Menu */}
                            {selectedRestaurant.menuItems && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">메뉴</h3>
                                    <div className="space-y-1">
                                        {selectedRestaurant.menuItems.map((menu, i) => (
                                            <div key={i} className="text-sm text-gray-600 py-1 border-b border-gray-100">
                                                {menu}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Operating Hours */}
                            {selectedRestaurant.operatingHours && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">영업시간</h3>
                                    <p className="text-sm text-gray-600">{selectedRestaurant.operatingHours}</p>
                                </div>
                            )}

                            {/* Action Button */}
                            <a
                                href={selectedRestaurant.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-coral-500 text-white py-3 rounded-xl font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                카카오맵에서 보기
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
