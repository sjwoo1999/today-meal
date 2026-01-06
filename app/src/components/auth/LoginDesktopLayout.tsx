'use client';

import { motion } from 'framer-motion';
import { Mail, Apple, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginDesktopLayoutProps {
    email: string;
    password: string;
    showEmailForm: boolean;
    isLoading: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onShowEmailForm: () => void;
    onEmailLogin: (e: React.FormEvent) => void;
    onSocialLogin: (provider: 'kakao' | 'apple' | 'google') => void;
    onGoToSignup: () => void;
}

export default function LoginDesktopLayout({
    email,
    password,
    showEmailForm,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onShowEmailForm,
    onEmailLogin,
    onSocialLogin,
    onGoToSignup,
}: LoginDesktopLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-green-500 via-green-600 to-blue-600 p-12 flex-col relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white" />
                    <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-white" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-12 relative z-10">
                    <span className="text-3xl">🍚</span>
                    <span className="font-bold text-2xl text-white">오늘한끼</span>
                </div>

                {/* Main Message */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                            건강한 식습관의<br />
                            시작, 오늘한끼
                        </h2>
                        <p className="text-green-100 text-lg mb-8">
                            AI 기반 식단 분석과 맞춤 코칭으로<br />
                            당신의 건강한 라이프스타일을 응원해요
                        </p>
                    </motion.div>

                    {/* Feature highlights */}
                    <div className="space-y-4">
                        {[
                            { icon: '📸', text: 'AI 사진 한 장으로 칼로리 분석' },
                            { icon: '🎯', text: '맞춤 목표 설정과 추적' },
                            { icon: '🏆', text: '챌린지와 스쿼드로 함께 도전' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 text-white/90"
                            >
                                <span className="text-2xl">{feature.icon}</span>
                                <span>{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-3/5 flex flex-col bg-white">
                {/* Header */}
                <header className="flex items-center justify-end p-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">
                        계정이 없으신가요?{' '}
                        <button
                            onClick={onGoToSignup}
                            className="text-green-500 font-semibold hover:underline"
                        >
                            회원가입
                        </button>
                    </span>
                </header>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                로그인
                            </h1>
                            <p className="text-gray-500 mb-8">
                                다시 만나서 반가워요! 오늘의 식단을 기록해볼까요?
                            </p>

                            {/* Social Login Buttons */}
                            <div className="space-y-3 mb-6">
                                {/* Kakao Login */}
                                <button
                                    onClick={() => onSocialLogin('kakao')}
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
                                    onClick={() => onSocialLogin('apple')}
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
                                    onClick={() => onSocialLogin('google')}
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
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-gray-400 text-sm">또는</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            {/* Email Login */}
                            {!showEmailForm ? (
                                <button
                                    onClick={onShowEmailForm}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4
                                             bg-gray-100 text-gray-700 font-semibold rounded-xl
                                             hover:bg-gray-200 transition-all active:scale-[0.98]"
                                >
                                    <Mail className="w-5 h-5" />
                                    이메일로 로그인
                                </button>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    onSubmit={onEmailLogin}
                                    className="space-y-4"
                                >
                                    <Input
                                        type="email"
                                        placeholder="이메일"
                                        value={email}
                                        onChange={(e) => onEmailChange(e.target.value)}
                                        className="w-full"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={(e) => onPasswordChange(e.target.value)}
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
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center p-4 border-t border-gray-100 text-sm text-gray-400">
                    <span>© 2026 오늘한끼. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
}
