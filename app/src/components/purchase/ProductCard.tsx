'use client';

import { ExternalLink, ShoppingCart, Heart } from 'lucide-react';
import { ConvenienceProduct, getStoreById } from '@/lib/purchase/productDatabase';
import { openStoreApp } from '@/lib/purchase/deepLinkUtils';
import { useState } from 'react';

interface ProductCardProps {
    product: ConvenienceProduct;
    onAddToFavorites?: (product: ConvenienceProduct) => void;
    compact?: boolean;
}

export function ProductCard({ product, onAddToFavorites, compact = false }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const store = getStoreById(product.storeId);

    const handlePurchase = () => {
        openStoreApp(product.storeId, product.id);
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        onAddToFavorites?.(product);
    };

    if (compact) {
        return (
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {product.category === 'protein' ? '🍗' :
                            product.category === 'salad' ? '🥗' :
                                product.category === 'drink' ? '🥤' :
                                    product.category === 'snack' ? '🍫' :
                                        product.category === 'meal' ? '🍱' : '💊'}
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">{product.nameKr}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{store?.name}</span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">P {product.nutrition.protein}g</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                    <button
                        onClick={handlePurchase}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* 이미지 */}
            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-5xl">
                    {product.category === 'protein' ? '🍗' :
                        product.category === 'salad' ? '🥗' :
                            product.category === 'drink' ? '🥤' :
                                product.category === 'snack' ? '🍫' :
                                    product.category === 'meal' ? '🍱' : '💊'}
                </span>

                {/* 스토어 배지 */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-lg text-xs font-medium text-gray-700">
                    {store?.name}
                </div>

                {/* 즐겨찾기 */}
                <button
                    onClick={handleFavorite}
                    className={'absolute top-2 right-2 p-1.5 rounded-full transition-colors ' +
                        (isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500')}
                >
                    <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* 정보 */}
            <div className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.nameKr}</h3>

                {/* 영양 정보 */}
                <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        {product.nutrition.calories}kcal
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        P {product.nutrition.protein}g
                    </span>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                    ))}
                </div>

                {/* 가격 및 구매 */}
                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">{product.price.toLocaleString()}원</span>
                    <button
                        onClick={handlePurchase}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        구매
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
