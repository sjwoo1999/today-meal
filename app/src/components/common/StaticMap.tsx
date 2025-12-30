'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { DEFAULT_LOCATION, type MockRestaurant } from '@/data';

interface StaticMapProps {
    restaurants: MockRestaurant[];
    selectedRestaurantId?: string;
    onRestaurantClick?: (restaurant: MockRestaurant) => void;
    className?: string;
}

// Convert distance string to relative position (simplified mock positioning)
const getMarkerPosition = (distance: string, index: number): { top: string; left: string } => {
    const dist = parseInt(distance) || 200;
    const angle = (index * 72 + 30) * (Math.PI / 180); // Spread markers in a circle
    const radius = Math.min(35, dist / 15); // Scale radius based on distance

    return {
        top: `${50 - radius * Math.cos(angle)}%`,
        left: `${50 + radius * Math.sin(angle)}%`,
    };
};

export default function StaticMap({
    restaurants,
    selectedRestaurantId,
    onRestaurantClick,
    className = ''
}: StaticMapProps) {
    // Open all restaurants in Kakao Map
    const handleOpenInMap = () => {
        // Create multi-destination URL for Kakao Map
        const baseUrl = 'https://map.kakao.com/link/map/';
        const destination = `${DEFAULT_LOCATION.name},${DEFAULT_LOCATION.latitude},${DEFAULT_LOCATION.longitude}`;
        window.open(`${baseUrl}${encodeURIComponent(destination)}`, '_blank');
    };

    return (
        <div className={`relative bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl overflow-hidden ${className}`}>
            {/* Map Background Pattern - Simulating a map */}
            <div className="absolute inset-0 opacity-30">
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }} />
                {/* Roads simulation */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-300 transform -translate-x-1/2" />
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-200" />
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-200" />
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-200" />
            </div>

            {/* Location Label */}
            <div className="absolute top-3 left-3 right-3 z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-coral-500" />
                    <span className="text-xs font-medium text-text-primary truncate">
                        {DEFAULT_LOCATION.name}
                    </span>
                </div>
            </div>

            {/* Center Marker (Current Location) */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <div className="relative">
                    <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    {/* Pulse animation */}
                    <motion.div
                        className="absolute inset-0 bg-coral-400 rounded-full"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </motion.div>

            {/* Restaurant Markers */}
            {restaurants.map((restaurant, index) => {
                const position = getMarkerPosition(restaurant.distance, index);
                const isSelected = selectedRestaurantId === restaurant.id;

                return (
                    <motion.button
                        key={restaurant.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 
                            ${isSelected ? 'z-30' : ''}`}
                        style={{ top: position.top, left: position.left }}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        onClick={() => onRestaurantClick?.(restaurant)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className={`relative ${isSelected ? 'scale-125' : ''} transition-transform`}>
                            {/* Marker Pin */}
                            <div className={`w-8 h-10 flex flex-col items-center justify-start
                                ${isSelected ? 'text-coral-500' : 'text-sage-600'}`}>
                                <MapPin className="w-8 h-8 fill-current drop-shadow-md" />
                            </div>
                            {/* Number Badge */}
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full 
                                flex items-center justify-center text-xs font-bold
                                ${isSelected
                                    ? 'bg-coral-500 text-white'
                                    : 'bg-white text-sage-700 border border-sage-300'}`}>
                                {index + 1}
                            </div>
                            {/* Restaurant Name Tooltip */}
                            {isSelected && (
                                <motion.div
                                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1
                                        bg-white rounded-lg shadow-lg px-2 py-1 whitespace-nowrap z-40"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="text-xs font-medium text-text-primary">
                                        {restaurant.name}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {restaurant.distance}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-coral-500 rounded-full" />
                                <span className="text-text-muted">현재 위치</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-sage-600" />
                                <span className="text-text-muted">음식점</span>
                            </div>
                        </div>
                        <button
                            onClick={handleOpenInMap}
                            className="flex items-center gap-1 text-xs text-coral-600 hover:text-coral-700 font-medium"
                        >
                            <ExternalLink className="w-3 h-3" />
                            지도에서 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
