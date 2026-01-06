'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Bell,
    Shield,
    Target,
    Moon,
    ChevronRight,
    LogOut,
    HelpCircle,
    MessageSquare,
    FileText,
    Info,
    Globe,
    Camera,
    Trash2,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';

interface SettingItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    type: 'link' | 'toggle' | 'select';
    value?: boolean | string;
    options?: string[];
}

interface SettingSection {
    title: string;
    items: SettingItem[];
}

export default function SettingsPage() {
    const { setActiveTab } = useUIStore();
    const { logout } = useAuthStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [settings, setSettings] = useState({
        pushNotification: true,
        mealReminder: true,
        socialNotification: false,
        darkMode: false,
        autoSave: true,
        publicProfile: true,
        showStreak: true,
        language: '한국어',
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const sections: SettingSection[] = [
        {
            title: '계정',
            items: [
                { id: 'profile', label: '프로필 수정', icon: <User className="w-5 h-5" />, type: 'link' },
                { id: 'password', label: '비밀번호 변경', icon: <Shield className="w-5 h-5" />, type: 'link' },
                { id: 'connected', label: '연결된 계정', description: '카카오, 구글', icon: <Globe className="w-5 h-5" />, type: 'link' },
            ],
        },
        {
            title: '목표 설정',
            items: [
                { id: 'calorie', label: '일일 칼로리 목표', description: '2,000 kcal', icon: <Target className="w-5 h-5" />, type: 'link' },
                { id: 'protein', label: '단백질 목표', description: '100g', icon: <Target className="w-5 h-5" />, type: 'link' },
                { id: 'weight', label: '목표 체중', description: '70kg', icon: <Target className="w-5 h-5" />, type: 'link' },
            ],
        },
        {
            title: '알림',
            items: [
                { id: 'push', label: '푸시 알림', icon: <Bell className="w-5 h-5" />, type: 'toggle', value: settings.pushNotification },
                { id: 'meal', label: '식사 리마인더', description: '매일 12:00, 19:00', icon: <Bell className="w-5 h-5" />, type: 'toggle', value: settings.mealReminder },
                { id: 'social', label: '소셜 알림', description: '좋아요, 댓글, 팔로우', icon: <Bell className="w-5 h-5" />, type: 'toggle', value: settings.socialNotification },
            ],
        },
        {
            title: '개인정보',
            items: [
                { id: 'public', label: '프로필 공개', icon: <User className="w-5 h-5" />, type: 'toggle', value: settings.publicProfile },
                { id: 'streak', label: '스트릭 공개', icon: <Target className="w-5 h-5" />, type: 'toggle', value: settings.showStreak },
                { id: 'export', label: '데이터 내보내기', icon: <FileText className="w-5 h-5" />, type: 'link' },
            ],
        },
        {
            title: '앱 설정',
            items: [
                { id: 'dark', label: '다크 모드', icon: <Moon className="w-5 h-5" />, type: 'toggle', value: settings.darkMode },
                { id: 'autosave', label: '자동 저장', icon: <Camera className="w-5 h-5" />, type: 'toggle', value: settings.autoSave },
                { id: 'language', label: '언어', description: settings.language, icon: <Globe className="w-5 h-5" />, type: 'link' },
                { id: 'cache', label: '캐시 삭제', icon: <Trash2 className="w-5 h-5" />, type: 'link' },
            ],
        },
        {
            title: '지원',
            items: [
                { id: 'help', label: '도움말', icon: <HelpCircle className="w-5 h-5" />, type: 'link' },
                { id: 'feedback', label: '피드백 보내기', icon: <MessageSquare className="w-5 h-5" />, type: 'link' },
                { id: 'terms', label: '이용약관', icon: <FileText className="w-5 h-5" />, type: 'link' },
                { id: 'privacy', label: '개인정보처리방침', icon: <Shield className="w-5 h-5" />, type: 'link' },
                { id: 'version', label: '버전 정보', description: 'v2.0.0', icon: <Info className="w-5 h-5" />, type: 'link' },
            ],
        },
    ];

    const getToggleKey = (id: string): keyof typeof settings | null => {
        const mapping: Record<string, keyof typeof settings> = {
            push: 'pushNotification',
            meal: 'mealReminder',
            social: 'socialNotification',
            dark: 'darkMode',
            autosave: 'autoSave',
            public: 'publicProfile',
            streak: 'showStreak',
        };
        return mapping[id] || null;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="flex items-center gap-3 px-4 py-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">설정</h1>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="px-4 py-4 space-y-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h2 className="text-sm font-medium text-gray-500 mb-2 px-1">{section.title}</h2>
                        <div className="bg-white rounded-2xl overflow-hidden divide-y">
                            {section.items.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => {
                                        if (item.type === 'toggle') {
                                            const key = getToggleKey(item.id);
                                            if (key) toggleSetting(key);
                                        }
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-500">{item.icon}</div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            {item.description && (
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {item.type === 'toggle' ? (
                                        <div
                                            className={`w-11 h-6 rounded-full relative transition-colors ${
                                                item.value ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        >
                                            <motion.div
                                                animate={{ x: item.value ? 20 : 2 }}
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                                            />
                                        </div>
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white rounded-2xl text-red-500 font-medium hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </motion.button>

                {/* Delete Account */}
                <button className="w-full text-center text-sm text-gray-400 py-2 hover:text-gray-600 transition-colors">
                    계정 삭제
                </button>

                {/* App Info */}
                <div className="text-center text-xs text-gray-400 pt-4">
                    <p>OneMealToday v2.0.0</p>
                    <p className="mt-1">Made with 💚 for healthy eating</p>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-sm"
                    >
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                로그아웃 하시겠습니까?
                            </h3>
                            <p className="text-sm text-gray-500">
                                로그아웃하면 다시 로그인해야 합니다.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowLogoutConfirm(false);
                                }}
                                className="flex-1 py-3 px-4 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
