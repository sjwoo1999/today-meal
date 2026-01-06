'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import SplashScreen from './SplashScreen';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import OnboardingPage from './OnboardingPage';

type AuthScreen = 'splash' | 'login' | 'signup' | 'onboarding';

interface AuthFlowProps {
    children: React.ReactNode;
}

export default function AuthFlow({ children }: AuthFlowProps) {
    const { isAuthenticated, onboardingComplete } = useAuthStore();
    const [currentScreen, setCurrentScreen] = useState<AuthScreen>('splash');
    const [showSplash, setShowSplash] = useState(true);

    // Handle splash screen completion
    useEffect(() => {
        if (!showSplash) {
            if (isAuthenticated && onboardingComplete) {
                // Already fully set up, skip auth flow
                setCurrentScreen('login'); // Will be overridden by children render
            } else if (isAuthenticated && !onboardingComplete) {
                setCurrentScreen('onboarding');
            } else {
                setCurrentScreen('login');
            }
        }
    }, [showSplash, isAuthenticated, onboardingComplete]);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    const handleLoginSuccess = () => {
        if (!onboardingComplete) {
            setCurrentScreen('onboarding');
        }
    };

    const handleSignupSuccess = () => {
        setCurrentScreen('onboarding');
    };

    const handleOnboardingComplete = () => {
        // Auth flow complete, main app will render
    };

    const handleSkipOnboarding = () => {
        useAuthStore.getState().skipOnboarding();
    };

    // Show main app if authenticated and onboarding complete
    if (isAuthenticated && onboardingComplete && !showSplash) {
        return <>{children}</>;
    }

    // Show splash screen
    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }

    // Render auth screens
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
            >
                {currentScreen === 'login' && (
                    <LoginPage
                        onLoginSuccess={handleLoginSuccess}
                        onGoToSignup={() => setCurrentScreen('signup')}
                    />
                )}
                {currentScreen === 'signup' && (
                    <SignupPage
                        onSignupSuccess={handleSignupSuccess}
                        onGoToLogin={() => setCurrentScreen('login')}
                    />
                )}
                {currentScreen === 'onboarding' && (
                    <OnboardingPage
                        onComplete={handleOnboardingComplete}
                        onSkip={handleSkipOnboarding}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
