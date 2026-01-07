'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

interface WorkoutScreenshotUploaderProps {
    onUpload: (images: File[]) => void;
    onAnalyze: (imageBase64: string) => void;
    maxImages?: number;
    isAnalyzing?: boolean;
}

interface PreviewImage {
    id: string;
    file: File;
    preview: string;
}

export function WorkoutScreenshotUploader({
    onUpload,
    onAnalyze,
    maxImages = 5,
    isAnalyzing = false
}: WorkoutScreenshotUploaderProps) {
    const [images, setImages] = useState<PreviewImage[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 파일 선택 핸들러
    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newImages: PreviewImage[] = [];
        const remainingSlots = maxImages - images.length;

        Array.from(files).slice(0, remainingSlots).forEach(file => {
            if (file.type.startsWith('image/')) {
                newImages.push({
                    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    file,
                    preview: URL.createObjectURL(file)
                });
            }
        });

        if (newImages.length > 0) {
            setImages(prev => [...prev, ...newImages]);
            onUpload(newImages.map(img => img.file));
        }
    }, [images.length, maxImages, onUpload]);

    // 드래그 앤 드롭
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // 이미지 삭제
    const removeImage = useCallback((id: string) => {
        setImages(prev => {
            const img = prev.find(p => p.id === id);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter(p => p.id !== id);
        });
    }, []);

    // 분석 시작
    const handleAnalyze = useCallback(async () => {
        if (images.length === 0) return;

        const file = images[0].file;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            onAnalyze(base64);
        };
        reader.readAsDataURL(file);
    }, [images, onAnalyze]);

    return (
        <div className="space-y-4">
            {/* 드롭 영역 */}
            <div
                className={`
                    relative border-2 border-dashed rounded-2xl p-6 text-center
                    transition-all duration-200
                    ${dragActive
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }
                    ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={images.length >= maxImages}
                />

                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            운동 스크린샷 업로드
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Strava, 애플워치, 삼성헬스 등 지원
                        </p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            <ImageIcon className="w-4 h-4" />
                            갤러리
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Camera className="w-4 h-4" />
                            촬영
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    최대 {maxImages}장 · JPG, PNG, WebP
                </p>
            </div>

            {/* 미리보기 */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200"
                            >
                                <img
                                    src={img.preview}
                                    alt="운동 스크린샷"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 분석 버튼 */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className={`
                            w-full py-3 rounded-xl font-semibold text-white
                            transition-all duration-200
                            ${isAnalyzing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
                            }
                        `}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                운동 데이터 분석 중...
                            </span>
                        ) : (
                            '🔍 운동 데이터 분석하기'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
