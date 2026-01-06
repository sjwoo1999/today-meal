'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Users, Lock, Globe, Copy } from 'lucide-react';

interface CreateSquadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (squadId: string) => void;
}

interface SquadFormData {
    name: string;
    description: string;
    emoji: string;
    isPrivate: boolean;
    maxMembers: number;
    joinApproval: boolean;
}

const EMOJI_OPTIONS = ['🥗', '🍱', '💪', '🏃', '🎯', '🔥', '🥦', '🍎', '⭐', '🌟'];

const initialFormData: SquadFormData = {
    name: '',
    description: '',
    emoji: '🥗',
    isPrivate: false,
    maxMembers: 20,
    joinApproval: false,
};

export default function CreateSquadModal({ isOpen, onClose, onSuccess }: CreateSquadModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<SquadFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
        setStep(1);
        setFormData(initialFormData);
        setInviteLink('');
        setCopied(false);
        onClose();
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newSquadId = `squad_${Date.now()}`;
        setInviteLink(`https://hankimeal.app/squad/${newSquadId}/invite`);
        setIsSubmitting(false);
        setStep(3);

        if (onSuccess) {
            onSuccess(newSquadId);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canProceed = step === 1 ? formData.name.length >= 2 : true;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden"
                        data-testid="create-squad-modal"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <div className="flex items-center gap-2">
                                {step > 1 && step < 3 && (
                                    <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <h2 className="text-lg font-bold">스쿼드 만들기</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Step {step}/3</span>
                                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex gap-1 px-4 py-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                        s <= step ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <div className="px-4 py-6 min-h-[350px]">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            스쿼드 이름 *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="예: 건강한 점심 모임"
                                            maxLength={20}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{formData.name.length}/20</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            설명 (선택)
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="스쿼드를 소개해주세요"
                                            maxLength={100}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{formData.description.length}/100</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            아이콘 선택
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {EMOJI_OPTIONS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => setFormData({ ...formData, emoji })}
                                                    className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                                                        formData.emoji === emoji
                                                            ? 'bg-green-100 ring-2 ring-green-500'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Settings */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            공개 설정
                                        </label>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setFormData({ ...formData, isPrivate: false })}
                                                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                    !formData.isPrivate
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <Globe className={`w-6 h-6 ${!formData.isPrivate ? 'text-green-500' : 'text-gray-400'}`} />
                                                <div className="text-left">
                                                    <p className="font-medium">공개</p>
                                                    <p className="text-sm text-gray-500">누구나 검색하고 가입할 수 있어요</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, isPrivate: true })}
                                                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                    formData.isPrivate
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <Lock className={`w-6 h-6 ${formData.isPrivate ? 'text-green-500' : 'text-gray-400'}`} />
                                                <div className="text-left">
                                                    <p className="font-medium">비공개</p>
                                                    <p className="text-sm text-gray-500">초대 링크로만 가입할 수 있어요</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            최대 인원: {formData.maxMembers}명
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            value={formData.maxMembers}
                                            onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                                            className="w-full accent-green-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>5명</span>
                                            <span>50명</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium">가입 승인 필요</p>
                                            <p className="text-sm text-gray-500">멤버 가입 시 승인이 필요해요</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, joinApproval: !formData.joinApproval })}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${
                                                formData.joinApproval ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        >
                                            <motion.div
                                                animate={{ x: formData.joinApproval ? 20 : 2 }}
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                                            />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Complete & Invite */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Check className="w-10 h-10 text-green-500" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-2">스쿼드가 만들어졌어요!</h3>
                                        <p className="text-gray-500">친구들을 초대해보세요</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                                                {formData.emoji}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold">{formData.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    <Users className="w-4 h-4 inline mr-1" />
                                                    최대 {formData.maxMembers}명
                                                </p>
                                            </div>
                                        </div>

                                        {inviteLink && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={inviteLink}
                                                    readOnly
                                                    className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600"
                                                />
                                                <button
                                                    onClick={handleCopyLink}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        copied
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-4 border-t">
                            {step < 3 ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={step === 2 ? handleCreate : handleNext}
                                        disabled={!canProceed || isSubmitting}
                                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                                            canProceed && !isSubmitting
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            '만드는 중...'
                                        ) : step === 2 ? (
                                            '스쿼드 만들기'
                                        ) : (
                                            <>
                                                다음 <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600"
                                >
                                    완료
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
