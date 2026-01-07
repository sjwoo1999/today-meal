'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import {
    ConvenienceProduct,
    getHighProteinLowCalProducts,
    searchProductsByTag,
    filterProductsByNutrition
} from '@/lib/purchase/productDatabase';
import { useState, useEffect } from 'react';

interface RecommendedProductsProps {
    title?: string;
    type?: 'high-protein' | 'post-workout' | 'low-calorie' | 'custom';
    customProducts?: ConvenienceProduct[];
    maxItems?: number;
    showViewAll?: boolean;
    onViewAll?: () => void;
    compact?: boolean;
}

export function RecommendedProducts({
    title = '추천 상품',
    type = 'high-protein',
    customProducts,
    maxItems = 4,
    showViewAll = true,
    onViewAll,
    compact = false
}: RecommendedProductsProps) {
    const [products, setProducts] = useState<ConvenienceProduct[]>([]);

    useEffect(() => {
        let recommended: ConvenienceProduct[];

        if (customProducts) {
            recommended = customProducts;
        } else {
            switch (type) {
                case 'high-protein':
                    recommended = getHighProteinLowCalProducts(maxItems);
                    break;
                case 'post-workout':
                    recommended = searchProductsByTag('운동후').slice(0, maxItems);
                    if (recommended.length < maxItems) {
                        const proteinDrinks = searchProductsByTag('프로틴');
                        recommended = [...recommended, ...proteinDrinks].slice(0, maxItems);
                    }
                    break;
                case 'low-calorie':
                    recommended = filterProductsByNutrition({ maxCalories: 200 }).slice(0, maxItems);
                    break;
                default:
                    recommended = getHighProteinLowCalProducts(maxItems);
            }
        }

        setProducts(recommended);
    }, [type, customProducts, maxItems]);

    if (products.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-gray-900">{title}</h3>
                </div>
                {showViewAll && onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700"
                    >
                        더보기
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* 상품 그리드 */}
            {compact ? (
                <div className="space-y-2">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} compact />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* 타입별 하단 CTA */}
            {type === 'post-workout' && (
                <div className="mt-4 p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-sm text-purple-700">
                        💪 운동 후 30분 이내 단백질 섭취가 가장 효과적이에요!
                    </p>
                </div>
            )}
        </motion.div>
    );
}
