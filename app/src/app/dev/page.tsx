'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home, Newspaper, Camera, Users, User, ShoppingBag,
    MessageCircle, Wrench, RefreshCw, Trash2,
    Wifi, WifiOff, AlertTriangle, Monitor, Tablet, Smartphone
} from 'lucide-react';
import { DevNetworkControl, NetworkPresets, NetworkPreset } from '@/utils/delay';

// 페이지 목록
const PAGES = [
    { path: '/', name: '홈', icon: Home, description: '메인 대시보드' },
    { path: '/feed', name: '피드', icon: Newspaper, description: '커뮤니티 피드' },
    { path: '/record', name: '기록', icon: Camera, description: '식사 기록' },
    { path: '/squad', name: '스쿼드', icon: Users, description: '스쿼드 목록' },
    { path: '/shop', name: '포인트샵', icon: ShoppingBag, description: '포인트 상점' },
    { path: '/trainer', name: 'AI 코치', icon: MessageCircle, description: 'AI 코치 채팅' },
    { path: '/community', name: '커뮤니티', icon: Users, description: '게시판' },
    { path: '/onboarding', name: '온보딩', icon: Wrench, description: '신규 유저 온보딩' },
];

// 뷰포트 프리셋
const VIEWPORTS = [
    { name: 'Mobile', width: 375, height: 812, icon: Smartphone },
    { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
    { name: 'Desktop', width: 1440, height: 900, icon: Monitor },
];

// 스토어 키 목록
const STORE_KEYS = [
    'user-storage',
    'ui-storage',
    'auth-storage',
    'personalization-storage',
];

export default function DevDashboard() {
    const router = useRouter();
    const [networkStatus, setNetworkStatus] = useState({
        delayEnabled: false,
        errorEnabled: false,
        preset: 'normal' as NetworkPreset,
    });

    // 초기 상태 로드
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setNetworkStatus(DevNetworkControl.getStatus());
        }
    }, []);

    // localStorage 초기화
    const clearAllStorage = () => {
        STORE_KEYS.forEach(key => localStorage.removeItem(key));
        window.location.reload();
    };

    // 신규 사용자 상태로 초기화
    const setNewUserState = () => {
        clearAllStorage();
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                isAuthenticated: false,
                currentUser: null,
                onboardingComplete: false,
            },
            version: 0,
        }));
        router.push('/onboarding');
    };

    // 기존 사용자 상태로 설정
    const setExperiencedUserState = () => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                isAuthenticated: true,
                currentUser: {
                    id: 'dev_user',
                    name: '개발자 테스트',
                    email: 'dev@test.com',
                    gamification: { xp: 2500, level: 7, streak: 15 },
                },
                onboardingComplete: true,
            },
            version: 0,
        }));
        localStorage.setItem('user-storage', JSON.stringify({
            state: {
                user: {
                    id: 'dev_user',
                    name: '개발자 테스트',
                    email: 'dev@test.com',
                    gamification: {
                        xp: 2500,
                        level: 7,
                        streak: 15,
                        longestStreak: 30,
                        streakFreezes: 2,
                        badges: [],
                        league: 'gold',
                        weeklyXP: 350,
                    },
                    profile: {
                        dailyCalorieGoal: 2000,
                        dailyProteinGoal: 150,
                        dailyCarbGoal: 250,
                        dailyFatGoal: 67,
                    },
                },
            },
            version: 0,
        }));
        window.location.reload();
    };

    // 네트워크 시뮬레이션 토글
    const toggleNetworkDelay = () => {
        if (networkStatus.delayEnabled) {
            DevNetworkControl.disableDelay();
        } else {
            DevNetworkControl.enableDelay();
        }
        setNetworkStatus(DevNetworkControl.getStatus());
    };

    const toggleRandomError = () => {
        if (networkStatus.errorEnabled) {
            DevNetworkControl.disableRandomError();
        } else {
            DevNetworkControl.enableRandomError();
        }
        setNetworkStatus(DevNetworkControl.getStatus());
    };

    const setNetworkPreset = (preset: NetworkPreset) => {
        DevNetworkControl.setPreset(preset);
        setNetworkStatus({ ...networkStatus, preset });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        🧪 개발자 테스트 대시보드
                    </h1>
                    <p className="text-gray-600 mt-2">
                        직접 페이지에 접근하고 상태를 관리하여 실제 사용자 환경을 테스트하세요.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 페이지 네비게이션 */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            📱 페이지 바로가기
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {PAGES.map(page => {
                                const Icon = page.icon;
                                return (
                                    <button
                                        key={page.path}
                                        onClick={() => router.push(page.path)}
                                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors text-left group"
                                    >
                                        <Icon className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                                        <div>
                                            <p className="font-medium text-gray-900 group-hover:text-green-600">{page.name}</p>
                                            <p className="text-xs text-gray-500">{page.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 상태 관리 */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            🔄 상태 관리
                        </h2>
                        <div className="space-y-3">
                            <button
                                onClick={clearAllStorage}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                                localStorage 전체 초기화
                            </button>
                            <button
                                onClick={setNewUserState}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                신규 사용자 상태로 설정
                            </button>
                            <button
                                onClick={setExperiencedUserState}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                            >
                                <User className="w-5 h-5" />
                                기존 사용자 상태로 설정 (Lv.7, 2500XP)
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-sm text-gray-700 mb-2">저장된 스토어 키:</h3>
                            <div className="flex flex-wrap gap-2">
                                {STORE_KEYS.map(key => (
                                    <span
                                        key={key}
                                        className={`text-xs px-2 py-1 rounded ${
                                            typeof window !== 'undefined' && localStorage.getItem(key)
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {key}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 네트워크 시뮬레이션 */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            🌐 네트워크 시뮬레이션
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    {networkStatus.delayEnabled ? (
                                        <Wifi className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <WifiOff className="w-5 h-5 text-gray-400" />
                                    )}
                                    <span className="font-medium">네트워크 지연</span>
                                </div>
                                <button
                                    onClick={toggleNetworkDelay}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                                        networkStatus.delayEnabled
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {networkStatus.delayEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className={`w-5 h-5 ${networkStatus.errorEnabled ? 'text-yellow-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">랜덤 에러 (5%)</span>
                                </div>
                                <button
                                    onClick={toggleRandomError}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                                        networkStatus.errorEnabled
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {networkStatus.errorEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">네트워크 속도 프리셋:</p>
                                <div className="flex gap-2">
                                    {(Object.keys(NetworkPresets) as NetworkPreset[]).map(preset => (
                                        <button
                                            key={preset}
                                            onClick={() => setNetworkPreset(preset)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                networkStatus.preset === preset
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-gray-600 border'
                                            }`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 뷰포트 테스트 */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            📐 뷰포트 테스트
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            F12 → 반응형 모드(Ctrl+Shift+M)에서 아래 사이즈 적용
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {VIEWPORTS.map(viewport => {
                                const Icon = viewport.icon;
                                return (
                                    <div
                                        key={viewport.name}
                                        className="p-4 bg-gray-50 rounded-lg text-center"
                                    >
                                        <Icon className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                        <p className="font-medium text-gray-900">{viewport.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {viewport.width} × {viewport.height}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>팁:</strong> Chrome DevTools에서 디바이스 모드를 사용하면 터치 이벤트와 모바일 뷰포트를 정확하게 테스트할 수 있습니다.
                            </p>
                        </div>
                    </section>
                </div>

                {/* 푸터 */}
                <footer className="mt-8 text-center text-sm text-gray-500">
                    <p>오늘한끼 v2.0 - 개발자 테스트 대시보드</p>
                    <p className="mt-1">
                        프로덕션 빌드에서는 이 페이지가 표시되지 않습니다.
                    </p>
                </footer>
            </div>
        </div>
    );
}
