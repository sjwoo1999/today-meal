'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import HankiMascot from '../HankiMascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import SignupDesktopLayout from './SignupDesktopLayout';

interface SignupPageProps {
    onSignupSuccess: () => void;
    onGoToLogin: () => void;
}

export default function SignupPage({ onSignupSuccess, onGoToLogin }: SignupPageProps) {
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [error, setError] = useState('');
    const { isDesktopOrLarger } = useBreakpoint();

    const isPasswordValid = password.length >= 8;
    const doPasswordsMatch = password === confirmPassword;
    const canSubmit = Boolean(email) && isPasswordValid && doPasswordsMatch && agreeTerms && agreePrivacy;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!canSubmit) {
            setError('모든 필수 항목을 입력해주세요.');
            return;
        }

        try {
            await login('email');
            onSignupSuccess();
        } catch {
            setError('회원가입 중 오류가 발생했습니다.');
        }
    };

    const handleAgreeAll = () => {
        const allAgreed = agreeTerms && agreePrivacy && agreeMarketing;
        setAgreeTerms(!allAgreed);
        setAgreePrivacy(!allAgreed);
        setAgreeMarketing(!allAgreed);
    };

    // PC 레이아웃
    if (isDesktopOrLarger) {
        return (
            <SignupDesktopLayout
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                showPassword={showPassword}
                isLoading={isLoading}
                agreeTerms={agreeTerms}
                agreePrivacy={agreePrivacy}
                agreeMarketing={agreeMarketing}
                error={error}
                isPasswordValid={isPasswordValid}
                doPasswordsMatch={doPasswordsMatch}
                canSubmit={canSubmit}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
                onToggleAgreeTerms={() => setAgreeTerms(!agreeTerms)}
                onToggleAgreePrivacy={() => setAgreePrivacy(!agreePrivacy)}
                onToggleAgreeMarketing={() => setAgreeMarketing(!agreeMarketing)}
                onAgreeAll={handleAgreeAll}
                onSignup={handleSignup}
                onGoToLogin={onGoToLogin}
            />
        );
    }

    // 모바일 레이아웃
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-gray-100">
                <button onClick={onGoToLogin} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 -ml-6">
                    회원가입
                </h1>
            </header>

            <div className="flex-1 p-6">
                {/* Mascot greeting */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <HankiMascot size="sm" />
                    <div>
                        <p className="text-gray-900 font-semibold">새로 오셨군요!</p>
                        <p className="text-gray-500 text-sm">간단하게 가입하고 시작해요</p>
                    </div>
                </motion.div>

                {/* Signup Form */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                >
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            이메일
                        </label>
                        <Input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                onClick={handleAgreeAll}
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
                                    onClick={() => setAgreeTerms(!agreeTerms)}
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
                                    onClick={() => setAgreePrivacy(!agreePrivacy)}
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
                                    onClick={() => setAgreeMarketing(!agreeMarketing)}
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
                </motion.form>
            </div>
        </div>
    );
}
