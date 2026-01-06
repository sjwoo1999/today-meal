'use client';

import { useRouter } from 'next/navigation';
import OnboardingPage from '@/components/auth/OnboardingPage';

/**
 * Standalone onboarding page for testing purposes
 * This bypasses the AuthFlow to allow direct testing of the onboarding flow
 */
export default function OnboardingRoute() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/');
    };

    const handleSkip = () => {
        router.push('/');
    };

    return (
        <OnboardingPage
            onComplete={handleComplete}
            onSkip={handleSkip}
        />
    );
}
