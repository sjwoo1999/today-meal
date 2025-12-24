'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, BarChart2, Link2, Hash, ChevronDown } from 'lucide-react';
import { BoardCategory, BOARD_LIST } from '@/types';

interface WritePostProps {
    onClose: () => void;
    onSubmit?: (data: { boardId: BoardCategory; title: string; content: string; hashtags: string[] }) => void;
    defaultBoard?: BoardCategory;
}

export default function WritePost({ onClose, onSubmit, defaultBoard = 'free' }: WritePostProps) {
    const [boardId, setBoardId] = useState<BoardCategory>(defaultBoard);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showBoardPicker, setShowBoardPicker] = useState(false);

    const selectedBoard = BOARD_LIST.find(b => b.id === boardId);
    const charCount = content.length;
    const maxChars = 2000;

    // 해시태그 추출
    const extractHashtags = (text: string): string[] => {
        const matches = text.match(/#[\w가-힣]+/g);
        return matches ? matches.map(tag => tag.slice(1)) : [];
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        const hashtags = extractHashtags(content);
        onSubmit?.({ boardId, title, content, hashtags });
        alert('글이 등록되었습니다!');
        onClose();
    };

    const isValid = title.trim().length > 0 && content.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
                <span className="font-bold text-gray-900">글쓰기</span>
                <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors
                        ${isValid
                            ? 'bg-primary-500 text-white hover:bg-primary-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    등록
                </button>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto">
                {/* 게시판 선택 */}
                <div className="relative">
                    <button
                        onClick={() => setShowBoardPicker(!showBoardPicker)}
                        className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                    >
                        <span className="text-gray-500">게시판 선택</span>
                        <div className="flex items-center gap-2 text-gray-900">
                            <span>{selectedBoard?.emoji}</span>
                            <span className="font-medium">{selectedBoard?.name}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBoardPicker ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {/* 게시판 드롭다운 */}
                    {showBoardPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-10"
                        >
                            {BOARD_LIST.filter(b => b.id !== 'hot' && b.id !== 'notice').map((board) => (
                                <button
                                    key={board.id}
                                    onClick={() => {
                                        setBoardId(board.id);
                                        setShowBoardPicker(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors
                                        ${boardId === board.id ? 'bg-primary-50' : ''}`}
                                >
                                    <span className="text-xl">{board.emoji}</span>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-gray-900">{board.name}</div>
                                        <div className="text-xs text-gray-500">{board.description}</div>
                                    </div>
                                    {boardId === board.id && (
                                        <span className="text-primary-500">✓</span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* 제목 */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full px-4 py-3 text-lg font-medium border-b border-gray-100 focus:outline-none placeholder-gray-400"
                    maxLength={100}
                />

                {/* 내용 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`내용을 입력하세요\n\n#해시태그를 추가해보세요`}
                    className="w-full px-4 py-3 min-h-[300px] resize-none focus:outline-none placeholder-gray-400"
                    maxLength={maxChars}
                />
            </div>

            {/* 하단 툴바 */}
            <div className="border-t border-gray-100">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Camera className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <BarChart2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Link2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setContent(content + ' #')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                            <Hash className="w-5 h-5" />
                        </button>
                    </div>
                    <span className={`text-sm ${charCount > maxChars * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {charCount} / {maxChars}
                    </span>
                </div>
            </div>
        </div>
    );
}
