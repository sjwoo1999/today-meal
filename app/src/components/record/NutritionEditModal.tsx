'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import NutritionEditor, { type NutritionData } from './NutritionEditor';

interface NutritionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nutrition: NutritionData) => void;
    initialNutrition: NutritionData;
    foodName?: string;
}

export default function NutritionEditModal({
    isOpen,
    onClose,
    onSave,
    initialNutrition,
    foodName,
}: NutritionEditModalProps) {
    const [nutrition, setNutrition] = useState<NutritionData>(initialNutrition);

    const handleSave = () => {
        onSave(nutrition);
        onClose();
    };

    const handleClose = () => {
        setNutrition(initialNutrition);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center lg:items-center"
                    onClick={handleClose}
                    data-testid="nutrition-edit-modal"
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-900">
                                영양정보 수정
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                data-testid="modal-close-button"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Food Name */}
                        {foodName && (
                            <div className="px-4 py-3 bg-gray-50 border-b">
                                <p className="text-sm text-gray-500">선택한 음식</p>
                                <p className="font-semibold text-gray-900" data-testid="modal-food-name">
                                    {foodName}
                                </p>
                            </div>
                        )}

                        {/* Nutrition Editor */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <NutritionEditor
                                nutrition={nutrition}
                                onChange={setNutrition}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 border-t bg-white flex gap-3">
                            <motion.button
                                onClick={handleClose}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
                                data-testid="modal-cancel-button"
                            >
                                취소
                            </motion.button>
                            <motion.button
                                onClick={handleSave}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium flex items-center justify-center gap-2"
                                data-testid="modal-save-button"
                            >
                                <Check className="w-4 h-4" />
                                저장
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
