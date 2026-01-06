'use client';

import { motion } from 'framer-motion';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignupDesktopLayoutProps {
    email: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    isLoading: boolean;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
    error: string;
    isPasswordValid: boolean;
    doPasswordsMatch: boolean;
    canSubmit: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onToggleShowPassword: () => void;
    onToggleAgreeTerms: () => void;
    onToggleAgreePrivacy: () => void;
    onToggleAgreeMarketing: () => void;
    onAgreeAll: () => void;
    onSignup: (e: React.FormEvent) => void;
    onGoToLogin: () => void;
}

export default function SignupDesktopLayout({
    email,
    password,
    confirmPassword,
    showPassword,
    isLoading,
    agreeTerms,
    agreePrivacy,
    agreeMarketing,
    error,
    isPasswordValid,
    doPasswordsMatch,
    canSubmit,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onToggleShowPassword,
    onToggleAgreeTerms,
    onToggleAgreePrivacy,
    onToggleAgreeMarketing,
    onAgreeAll,
    onSignup,
    onGoToLogin,
}: SignupDesktopLayoutProps) {
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
                            새로운 시작을<br />
                            환영해요!
                        </h2>
                        <p className="text-green-100 text-lg mb-8">
                            오늘한끼와 함께 건강한 식습관을 만들어가요
                        </p>
                    </motion.div>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {[
                            { icon: '🎁', text: '가입 즉시 500 포인트 지급' },
                            { icon: '📊', text: '무료 TDEE & 맞춤 영양 분석' },
                            { icon: '🤖', text: 'AI 코치의 1:1 맞춤 조언' },
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 text-white/90"
                            >
                                <span className="text-2xl">{benefit.icon}</span>
                                <span>{benefit.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-3/5 flex flex-col bg-white">
                {/* Header */}
                <header className="flex items-center justify-end p-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">
                        이미 계정이 있으신가요?{' '}
                        <button
                            onClick={onGoToLogin}
                            className="text-green-500 font-semibold hover:underline"
                        >
                            로그인
                        </button>
                    </span>
                </header>

                {/* Form Content */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                회원가입
                            </h1>
                            <p className="text-gray-500 mb-8">
                                간단하게 가입하고 건강한 식습관을 시작하세요
                            </p>

                            {/* Signup Form */}
                            <form onSubmit={onSignup} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        이메일
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => onEmailChange(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        비밀번호
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="8자 이상 입력해주세요"
                                            value={password}
                                            onChange={(e) => onPasswordChange(e.target.value)}
                                            className="w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={onToggleShowPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <p className={`text-xs mt-1 ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                                            {isPasswordValid ? '사용 가능한 비밀번호입니다' : '8자 이상 입력해주세요'}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        비밀번호 확인
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="비밀번호를 다시 입력해주세요"
                                        value={confirmPassword}
                                        onChange={(e) => onConfirmPasswordChange(e.target.value)}
                                        className="w-full"
                                    />
                                    {confirmPassword && (
                                        <p className={`text-xs mt-1 ${doPasswordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                            {doPasswordsMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                                        </p>
                                    )}
                                </div>

                                {/* Terms Agreement */}
                                <div className="pt-4 space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div
                                            onClick={onAgreeAll}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                      transition-colors ${agreeTerms && agreePrivacy && agreeMarketing
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-300'}`}
                                        >
                                            {agreeTerms && agreePrivacy && agreeMarketing && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <span className="font-semibold text-gray-900">전체 동의</span>
                                    </label>

                                    <div className="pl-9 space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div
                                                onClick={onToggleAgreeTerms}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                                          transition-colors ${agreeTerms
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300'}`}
                                            >
                                                {agreeTerms && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-700">(필수) 서비스 이용약관</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div
                                                onClick={onToggleAgreePrivacy}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                                          transition-colors ${agreePrivacy
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300'}`}
                                            >
                                                {agreePrivacy && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-700">(필수) 개인정보 처리방침</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div
                                                onClick={onToggleAgreeMarketing}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                                          transition-colors ${agreeMarketing
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300'}`}
                                            >
                                                {agreeMarketing && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-500">(선택) 마케팅 정보 수신</span>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm text-center">{error}</p>
                                )}

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit || isLoading}
                                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                                    >
                                        {isLoading ? '가입 중...' : '회원가입'}
                                    </Button>
                                </div>
                            </form>
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
