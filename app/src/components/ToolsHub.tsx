'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, PieChart, MessageSquare,
    ChevronRight, Target, BarChart3, MapPin
} from 'lucide-react';
import { useUIStore } from '@/store';
import { UIState } from '@/types/ui';
import HankiChat from '@/components/HankiChat';

interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    badge?: string;
}

const TOOLS: Tool[] = [
    {
        id: 'planner',
        title: '역추산 플래너',
        description: '저녁 먹고 싶은 거 정하면 아침/점심 추천!',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        badge: '⭐ 인기',
    },
    {
        id: 'dashboard',
        title: '영양 대시보드',
        description: '오늘 먹은 칼로리/단백질 한눈에',
        icon: PieChart,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        id: 'analysis',
        title: '주간/월간 분석',
        description: '내 식습관 트렌드 확인',
        icon: BarChart3,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        id: 'hanki',
        title: '한끼 AI 상담',
        description: '뭐 먹을지 고민될 때 물어봐!',
        icon: MessageSquare,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        badge: 'AI',
    },
    {
        id: 'nearby',
        title: '주변 식당 찾기',
        description: '내 위치 기반 맛집 추천',
        icon: MapPin,
        color: 'text-coral-600',
        bgColor: 'bg-coral-50',
        badge: '🗺️ NEW',
    },
];

const QUICK_ACTIONS = [
    { id: 'water', emoji: '💧', label: '물 기록', count: '5/8' },
    { id: 'weight', emoji: '⚖️', label: '체중 기록', count: '오늘' },
    { id: 'exercise', emoji: '🏃', label: '운동 기록', count: '-' },
];

function ToolCard({ tool }: { tool: Tool }) {
    const Icon = tool.icon;

    return (
        <motion.button
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{tool.title}</h3>
                        {tool.badge && (
                            <span className="px-2 py-0.5 bg-coral-100 text-coral-600 text-xs font-medium rounded-full">
                                {tool.badge}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-3" />
            </div>
        </motion.button>
    );
}

export default function ToolsHub() {
    const { setActiveTab } = useUIStore();
    const [showHanki, setShowHanki] = useState(false);

    const handleToolClick = (toolId: string) => {
        switch (toolId) {
            case 'planner':
                setActiveTab('planner' as UIState['activeTab']);
                break;
            case 'dashboard':
            case 'analysis':
                // 같은 대시보드로 이동 (추후 분리 가능)
                setActiveTab('planner' as UIState['activeTab']);
                break;
            case 'hanki':
                setShowHanki(true);
                break;
            case 'nearby':
                setActiveTab('nearby' as UIState['activeTab']);
                break;
        }
    };

    // 한끼 AI 채팅 화면
    if (showHanki) {
        return <HankiChat onClose={() => setShowHanki(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">🔧 도구</h1>
                <p className="text-sm text-gray-500">식단 관리에 필요한 모든 것</p>
            </div>

            {/* 퀵 액션 */}
            <div className="px-4 py-4">
                <h2 className="font-bold text-gray-900 mb-3">빠른 기록</h2>
                <div className="flex gap-3">
                    {QUICK_ACTIONS.map(action => (
                        <motion.button
                            key={action.id}
                            className="flex-1 bg-white rounded-xl p-3 border border-gray-100 text-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">{action.emoji}</span>
                            <p className="text-xs text-gray-600 mt-1">{action.label}</p>
                            <p className="text-xs font-medium text-coral-600">{action.count}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* 메인 도구 */}
            <div className="px-4 py-2">
                <h2 className="font-bold text-gray-900 mb-3">도구 모음</h2>
                <div className="space-y-3">
                    {TOOLS.map(tool => (
                        <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="cursor-pointer">
                            <ToolCard tool={tool} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 오늘의 통계 */}
            <div className="px-4 py-4">
                <div className="bg-gradient-to-br from-coral-50 to-green-50 rounded-2xl p-4 border border-coral-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">오늘의 목표</h3>
                            <p className="text-sm text-gray-600">1,450 / 1,800 kcal</p>
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-coral-400 to-coral-600 h-2 rounded-full"
                            style={{ width: '80%' }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        저녁까지 <span className="font-bold text-coral-600">350 kcal</span> 남음
                    </p>
                </div>
            </div>
        </div>
    );
}
