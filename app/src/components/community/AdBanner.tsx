'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export type AdSize = 'banner' | 'card' | 'native' | 'interstitial';
export type AdPosition = 'feed' | 'detail-top' | 'detail-middle' | 'sidebar';

interface AdBannerProps {
    size?: AdSize;
    position?: AdPosition;
    className?: string;
}

// 광고 목업 데이터
const AD_CONTENT = {
    banner: [
        { title: '🏋️ 프로틴 할인 이벤트', desc: '첫 구매 30% OFF', brand: 'ProteinShop' },
        { title: '🥗 간편 샐러드 구독', desc: '매일 신선하게 배달', brand: 'FreshBox' },
        { title: '📱 스마트 체중계', desc: '앱 연동 체성분 분석', brand: 'FitScale' },
    ],
    card: [
        {
            title: '다이어트 도시락 추천',
            desc: '칼로리 계산 걱정 없이 맛있게!',
            brand: '오늘의도시락',
            image: '🍱'
        },
        {
            title: '단백질 쉐이크 BEST',
            desc: '헬스인들이 선택한 맛',
            brand: '프로틴마켓',
            image: '🥤'
        },
    ],
    native: [
        {
            title: '식단일기 작성 꿀팁',
            desc: '한끼 앱으로 쉽게 기록하는 방법',
            isSponsored: true,
        }
    ],
};

export default function AdBanner({ size = 'banner', className = '' }: AdBannerProps) {
    // 클라이언트에서만 랜덤 인덱스 결정 (hydration 에러 방지)
    const [bannerIndex, setBannerIndex] = useState(0);
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
        setBannerIndex(Math.floor(Math.random() * AD_CONTENT.banner.length));
        setCardIndex(Math.floor(Math.random() * AD_CONTENT.card.length));
    }, []);

    // 배너형 광고 (리스트 사이)
    if (size === 'banner') {
        const ad = AD_CONTENT.banner[bannerIndex];
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 ${className}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">AD</span>
                            <span className="text-xs text-gray-500">{ad.brand}</span>
                        </div>
                        <p className="font-medium text-gray-800">{ad.title}</p>
                        <p className="text-sm text-gray-600">{ad.desc}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                        자세히
                    </button>
                </div>
            </motion.div>
        );
    }

    // 카드형 광고 (게시글 상세 중간)
    if (size === 'card') {
        const ad = AD_CONTENT.card[cardIndex];
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${className}`}
            >
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 flex items-center justify-center">
                    <span className="text-5xl">{ad.image}</span>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">광고</span>
                        <span className="text-xs text-gray-500">{ad.brand}</span>
                    </div>
                    <p className="font-bold text-gray-900 mb-1">{ad.title}</p>
                    <p className="text-sm text-gray-600 mb-3">{ad.desc}</p>
                    <button className="w-full py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                        확인하기
                    </button>
                </div>
            </motion.div>
        );
    }

    // 네이티브형 광고 (피드에 자연스럽게)
    if (size === 'native') {
        const ad = AD_CONTENT.native[0];
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded font-medium">Sponsored</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{ad.title}</h3>
                <p className="text-sm text-gray-600">{ad.desc}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>👀 12.3K</span>
                    <span>💬 234</span>
                </div>
            </motion.div>
        );
    }

    return null;
}

// 광고 위치 가이드라인 주석
// - feed: 게시글 목록 3개마다 사이에 배치
// - detail-top: 게시글 상세 본문 상단
// - detail-middle: 게시글 상세 댓글 섹션 전
// - sidebar: PC 우측 사이드바
