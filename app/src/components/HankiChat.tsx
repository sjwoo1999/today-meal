'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';
import { useHankiAgentStore, useNutritionStore } from '@/store';

// 빠른 응답 버튼
const QUICK_REPLIES = [
    '점심 뭐 먹을까?',
    '오늘 얼마나 더 먹어도 돼?',
    '역추산 해줘',
    '요즘 힘들어...',
];

// 한끼 응답 생성 (실제로는 AI API 연동)
const generateHankiResponse = (
    userMessage: string,
    nutrition: { current: number; goal: number } | null
): { content: string; quickReplies?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // 점심/저녁 추천
    if (lowerMessage.includes('뭐 먹') || lowerMessage.includes('추천')) {
        return {
            content: '음... 🤔 오늘 단백질이 좀 부족한 것 같아!\n닭가슴살 샐러드나 연어 덮밥 어때?',
            quickReplies: ['샐러드 괜찮아', '다른 거 없어?', '역추산 해줘'],
        };
    }

    // 칼로리 확인
    if (lowerMessage.includes('얼마나') || lowerMessage.includes('남았')) {
        if (nutrition) {
            const remaining = nutrition.goal - nutrition.current;
            return {
                content: `지금까지 ${nutrition.current}kcal 먹었어!\n목표까지 ${remaining}kcal 남았으니까...\n저녁에 닭가슴살 샐러드(350kcal) 먹으면\n간식까지 여유있어! 🙌`,
                quickReplies: ['역추산 해줘', '다른 메뉴 추천해줘'],
            };
        }
        return {
            content: '아직 오늘 기록이 없어! 식사 기록하면 알려줄게 📝',
            quickReplies: ['기록하러 가기'],
        };
    }

    // 역추산
    if (lowerMessage.includes('역추산') || lowerMessage.includes('플래너')) {
        return {
            content: '좋아! 🍽️ 오늘 저녁 뭐 먹고 싶어?\n저녁 먼저 정하면 아침/점심 추천해줄게!',
            quickReplies: ['삼겹살!', '치킨!', '파스타!'],
        };
    }

    // 감정 지원
    if (lowerMessage.includes('힘들') || lowerMessage.includes('스트레스') || lowerMessage.includes('우울')) {
        return {
            content: '그랬구나... 😢 많이 지쳤어?\n오늘은 좋아하는 거 먹어도 괜찮아.\n가끔은 맛있는 게 약이야!\n내일부터 다시 같이 하자 💪',
            quickReplies: ['고마워', '맛있는 거 추천해줘'],
        };
    }

    // 인사
    if (lowerMessage.includes('안녕') || lowerMessage.includes('하이')) {
        return {
            content: '안녕! 🍚 오늘도 맛있게 건강해지자!\n뭐 도와줄까?',
            quickReplies: QUICK_REPLIES.slice(0, 3),
        };
    }

    // 기본 응답
    return {
        content: '알겠어! 🍚 더 도와줄 게 있으면 말해줘~',
        quickReplies: QUICK_REPLIES.slice(0, 3),
    };
};

interface HankiChatProps {
    onClose?: () => void;
}

export default function HankiChat({ onClose }: HankiChatProps) {
    const { chatHistory, addChatMessage, toggleChat } = useHankiAgentStore();
    const { todayNutrition } = useNutritionStore();
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // 초기 인사 메시지
    useEffect(() => {
        if (chatHistory.length === 0) {
            const hour = new Date().getHours();
            let greeting = '안녕! 🍚';
            if (hour < 12) greeting = '좋은 아침! ☀️';
            else if (hour < 18) greeting = '점심 잘 먹었어? 🍚';
            else greeting = '저녁 시간이네! 🌙';

            addChatMessage('hanki', `${greeting}\n오늘도 맛있게 건강해지자! 뭐 도와줄까?`, QUICK_REPLIES);
        }
    }, [chatHistory.length, addChatMessage]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // 사용자 메시지 추가
        addChatMessage('user', userMessage);

        // 타이핑 중 표시
        setIsTyping(true);

        // 응답 생성 (약간의 딜레이로 자연스럽게)
        setTimeout(() => {
            const response = generateHankiResponse(
                userMessage,
                todayNutrition?.calories || null
            );
            addChatMessage('hanki', response.content, response.quickReplies);
            setIsTyping(false);
        }, 800 + Math.random() * 500);
    };

    const handleQuickReply = (reply: string) => {
        setInputValue(reply);
        setTimeout(() => handleSend(), 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] max-h-[70vh]"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.span
                        className="text-3xl"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🍚
                    </motion.span>
                    <div>
                        <h3 className="font-bold">한끼와 대화</h3>
                        <div className="flex items-center gap-1 text-xs text-green-100">
                            <Sparkles className="w-3 h-3" />
                            <span>AI 식단 어시스턴트</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose || toggleChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <AnimatePresence>
                    {chatHistory.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                {message.type === 'hanki' && (
                                    <span className="text-2xl mb-1 block">🍚</span>
                                )}
                                <div
                                    className={`rounded-2xl p-3 ${message.type === 'user'
                                        ? 'bg-green-500 text-white rounded-tr-none'
                                        : 'bg-white shadow-sm rounded-tl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                                </div>

                                {/* Quick Replies */}
                                {message.type === 'hanki' && message.quickReplies && message.quickReplies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {message.quickReplies.map((reply, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickReply(reply)}
                                                className="text-xs bg-white border border-green-200 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-2xl">🍚</span>
                        <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="한끼에게 메시지 보내기..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
