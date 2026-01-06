'use client';

import { useState } from 'react';
import { SquadListPage, SquadDetailPage, ChallengeDetailPage } from '@/components/squad';

type ViewState =
    | { type: 'list' }
    | { type: 'squad'; squadId: string }
    | { type: 'challenge'; challengeId: string };

export default function SquadPage() {
    const [viewState, setViewState] = useState<ViewState>({ type: 'list' });

    const handleSquadSelect = (squadId: string) => {
        setViewState({ type: 'squad', squadId });
    };

    const handleChallengeSelect = (challengeId: string) => {
        setViewState({ type: 'challenge', challengeId });
    };

    const handleBack = () => {
        setViewState({ type: 'list' });
    };

    switch (viewState.type) {
        case 'squad':
            return (
                <SquadDetailPage
                    squadId={viewState.squadId}
                    onBack={handleBack}
                    onChallengeSelect={handleChallengeSelect}
                />
            );
        case 'challenge':
            return (
                <ChallengeDetailPage
                    challengeId={viewState.challengeId}
                    onBack={handleBack}
                />
            );
        default:
            return (
                <SquadListPage
                    onSquadSelect={handleSquadSelect}
                    onChallengeSelect={handleChallengeSelect}
                />
            );
    }
}
