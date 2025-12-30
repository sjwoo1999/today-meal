'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ExternalLink, Filter, Search, Navigation } from 'lucide-react';
import {
    MOCK_RESTAURANTS,
    DEFAULT_LOCATION,
    type MockRestaurant,
    type FoodCategory
} from '@/data';
import StaticMap from '@/components/common/StaticMap';

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

// Sort options
type SortOption = 'distance' | 'rating' | 'name';

export default function NearbyRestaurants() {
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const [selectedRestaurant, setSelectedRestaurant] = useState<MockRestaurant | null>(null);
    const [hoveredRestaurantId, setHoveredRestaurantId] = useState<string | undefined>(undefined);

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
            } else if (sortBy === 'rating') {
                return (b.rating || 0) - (a.rating || 0);
            } else {
                return a.name.localeCompare(b.name);
            }
        });

    const handleRestaurantClick = (restaurant: MockRestaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const handleMapMarkerClick = (restaurant: MockRestaurant) => {
        setSelectedRestaurant(restaurant);
        setHoveredRestaurantId(restaurant.id);
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-coral-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-coral-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">내 주변 식당</h1>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Navigation className="w-3 h-3" />
                                <span className="truncate max-w-[200px]">{DEFAULT_LOCATION.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {filteredRestaurants.length}개 식당
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="식당명 또는 메뉴 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                ${selectedCategory === cat.id
                                    ? 'bg-coral-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Map Section - Fixed */}
                <div className="w-1/2 p-4 bg-gray-50 flex-shrink-0">
                    <StaticMap
                        restaurants={filteredRestaurants.slice(0, 10)}
                        selectedRestaurantId={hoveredRestaurantId || selectedRestaurant?.id}
                        onRestaurantClick={handleMapMarkerClick}
                        className="h-full rounded-xl shadow-sm"
                    />
                </div>

                {/* Restaurant List Section - Scrollable */}
                <div className="w-1/2 flex flex-col border-l border-gray-200 h-full">
                    {/* Sort Options */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">정렬:</span>
                        {(['distance', 'rating', 'name'] as SortOption[]).map((option) => (
                            <button
                                key={option}
                                onClick={() => setSortBy(option)}
                                className={`text-sm px-2 py-1 rounded-lg transition-colors
                                    ${sortBy === option
                                        ? 'bg-coral-50 text-coral-600 font-medium'
                                        : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {option === 'distance' ? '거리순' : option === 'rating' ? '평점순' : '이름순'}
                            </button>
                        ))}
                    </div>

                    {/* Restaurant Cards */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurant, index) => (
                                <motion.div
                                    key={restaurant.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer
                                        ${selectedRestaurant?.id === restaurant.id
                                            ? 'border-coral-300 ring-2 ring-coral-100'
                                            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
                                    onClick={() => handleRestaurantClick(restaurant)}
                                    onMouseEnter={() => setHoveredRestaurantId(restaurant.id)}
                                    onMouseLeave={() => setHoveredRestaurantId(undefined)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">{restaurant.name}</span>
                                                {restaurant.priceRange && (
                                                    <span className="text-xs text-gray-400">{restaurant.priceRange}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                    {restaurant.category.map(c =>
                                                        CATEGORIES.find(cat => cat.id === c)?.emoji
                                                    ).join(' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <MapPin className="w-3.5 h-3.5 text-coral-500" />
                                            <span className="text-coral-600 font-medium">{restaurant.distance}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-3">{restaurant.address}</p>

                                    {/* Menu Items */}
                                    {restaurant.menuItems && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {restaurant.menuItems.slice(0, 3).map((menu, i) => (
                                                <span key={i} className="text-xs bg-sage-50 text-sage-700 px-2 py-1 rounded-lg">
                                                    {menu}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        {restaurant.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={restaurant.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-xs text-coral-600 hover:text-coral-700"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                지도 보기
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <MapPin className="w-12 h-12 mb-3 opacity-50" />
                                <p>검색 결과가 없습니다</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
