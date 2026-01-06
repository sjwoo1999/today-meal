'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Mail, Apple, MessageCircle } from 'lucide-react';
import HankiMascot from '../HankiMascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import LoginDesktopLayout from './LoginDesktopLayout';

interface LoginPageProps {
    onLoginSuccess: () => void;
    onGoToSignup: () => void;
}

export default function LoginPage({ onLoginSuccess, onGoToSignup }: LoginPageProps) {
    const { login, isLoading } = useAuthStore();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isDesktopOrLarger } = useBreakpoint();

    const handleSocialLogin = async (provider: 'kakao' | 'apple' | 'google') => {
        await login(provider);
        onLoginSuccess();
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login('email');
        onLoginSuccess();
    };

    // PC 레이아웃
    if (isDesktopOrLarger) {
        return (
            <LoginDesktopLayout
                email={email}
                password={password}
                showEmailForm={showEmailForm}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onShowEmailForm={() => setShowEmailForm(true)}
                onEmailLogin={handleEmailLogin}
                onSocialLogin={handleSocialLogin}
                onGoToSignup={onGoToSignup}
            />
        );
    }

    // 모바일 레이아웃
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col p-6">
            {/* Header with mascot */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center pt-12 mb-8"
            >
                <HankiMascot size="md" />
                <h1 className="text-2xl font-bold text-gray-900 mt-4">
                    오늘<span className="text-green-500">한끼</span>에 오신 걸 환영해요!
                </h1>
                <p className="text-gray-500 mt-2 text-center">
                    건강한 식단 관리를 함께 시작해요
                </p>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-6"
            >
                {/* Kakao Login */}
                <button
                    onClick={() => handleSocialLogin('kakao')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4
                             bg-[#FEE500] text-[#191919] font-semibold rounded-xl
                             hover:brightness-95 transition-all active:scale-[0.98]
                             disabled:opacity-50"
                >
                    <MessageCircle className="w-5 h-5" />
                    카카오로 시작하기
                </button>

                {/* Apple Login */}
                <button
                    onClick={() => handleSocialLogin('apple')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4
                             bg-black text-white font-semibold rounded-xl
                             hover:bg-gray-900 transition-all active:scale-[0.98]
                             disabled:opacity-50"
                >
                    <Apple className="w-5 h-5" />
                    Apple로 시작하기
                </button>

                {/* Google Login */}
                <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4
                             bg-white text-gray-700 font-semibold rounded-xl
                             border border-gray-200 hover:bg-gray-50 transition-all
                             active:scale-[0.98] disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google로 시작하기
                </button>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">또는</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email Login */}
            {!showEmailForm ? (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowEmailForm(true)}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4
                             bg-gray-100 text-gray-700 font-semibold rounded-xl
                             hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                    <Mail className="w-5 h-5" />
                    이메일로 로그인
                </motion.button>
            ) : (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleEmailLogin}
                    className="space-y-4"
                >
                    <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                    />
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                </motion.form>
            )}

            {/* Sign up link */}
            <div className="mt-auto pt-8 text-center">
                <p className="text-gray-500">
                    아직 계정이 없으신가요?{' '}
                    <button
                        onClick={onGoToSignup}
                        className="text-green-500 font-semibold hover:underline"
                    >
                        회원가입
                    </button>
                </p>
            </div>
        </div>
    );
}
