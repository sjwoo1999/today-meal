'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X, Upload } from 'lucide-react';

interface ImageCaptureProps {
    onCapture: (imageData: string) => void;
    onCancel: () => void;
}

// Mock food images for demo
const mockFoodImages = [
    '/images/food/bibimbap.jpg',
    '/images/food/kimchi-jjigae.jpg',
    '/images/food/samgyeopsal.jpg',
    '/images/food/jjajangmyeon.jpg',
    '/images/food/chicken.jpg',
];

export default function ImageCapture({ onCapture, onCancel }: ImageCaptureProps) {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCapture = () => {
        setIsCapturing(true);
        // Simulate camera capture with mock image
        setTimeout(() => {
            const mockImage = mockFoodImages[Math.floor(Math.random() * mockFoodImages.length)];
            setCapturedImage(mockImage);
            setIsCapturing(false);
        }, 800);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <button
                    onClick={onCancel}
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-white font-medium">음식 촬영</h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {capturedImage ? (
                        <motion.div
                            key="preview"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-gray-800"
                        >
                            <div
                                className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center"
                            >
                                <span className="text-6xl">🍽️</span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <p className="text-white text-sm bg-black/50 rounded-full px-3 py-1 inline-block">
                                    촬영된 이미지
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="camera"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm aspect-square rounded-2xl bg-gray-800 flex flex-col items-center justify-center gap-4"
                        >
                            {isCapturing ? (
                                <>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <p className="text-white/70">촬영 중...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/30 flex items-center justify-center">
                                        <Camera className="w-10 h-10 text-white/50" />
                                    </div>
                                    <p className="text-white/50 text-center">
                                        음식을 화면 가운데에<br />맞춰주세요
                                    </p>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-6 pb-10 space-y-4">
                {capturedImage ? (
                    <div className="flex gap-3">
                        <motion.button
                            onClick={handleRetake}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-3 px-4 rounded-full bg-white/20 text-white font-medium"
                        >
                            다시 촬영
                        </motion.button>
                        <motion.button
                            onClick={handleConfirm}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-3 px-4 rounded-full bg-green-500 text-white font-medium"
                        >
                            분석하기
                        </motion.button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-6">
                        {/* Gallery Button */}
                        <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            whileTap={{ scale: 0.9 }}
                            data-testid="gallery-button"
                            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                        >
                            <ImageIcon className="w-6 h-6 text-white" />
                        </motion.button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Capture Button */}
                        <motion.button
                            onClick={handleCapture}
                            disabled={isCapturing}
                            whileTap={{ scale: 0.9 }}
                            data-testid="camera-button"
                            className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full border-4 border-gray-300" />
                        </motion.button>

                        {/* Upload Button */}
                        <motion.button
                            onClick={() => {
                                // Quick mock capture for demo
                                handleCapture();
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                        >
                            <Upload className="w-6 h-6 text-white" />
                        </motion.button>
                    </div>
                )}

                {/* Helper Text */}
                <p className="text-center text-white/50 text-sm">
                    {capturedImage
                        ? 'AI가 음식을 분석해 영양 정보를 알려드려요'
                        : '음식 사진을 찍거나 갤러리에서 선택하세요'
                    }
                </p>
            </div>
        </motion.div>
    );
}
