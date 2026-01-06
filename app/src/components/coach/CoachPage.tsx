'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Lightbulb, TrendingUp, Utensils } from 'lucide-react';
import { useUIStore, useNutritionStore } from '@/store';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface QuickQuestion {
    id: string;
    text: string;
    icon: React.ReactNode;
}

const quickQuestions: QuickQuestion[] = [
    { id: 'diet', text: '오늘 뭐 먹으면 좋을까요?', icon: <Utensils className="w-4 h-4" /> },
    { id: 'calories', text: '칼로리 조절 방법 알려주세요', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'protein', text: '단백질 섭취량이 부족해요', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tips', text: '건강한 식습관 팁 알려주세요', icon: <Lightbulb className="w-4 h-4" /> },
];

// Mock AI responses based on context
const generateMockResponse = (question: string, todayCalories: number, todayProtein: number): string => {
    const caloriePercent = Math.round((todayCalories / 2000) * 100);
    const proteinPercent = Math.round((todayProtein / 100) * 100);

    if (question.includes('뭐 먹')) {
        if (caloriePercent < 50) {
            return `아직 오늘 칼로리가 ${caloriePercent}%밖에 안 됐네요! 🍽️\n\n건강한 한 끼로 **된장찌개와 밥**이나 **비빔밥**은 어떨까요? 균형 잡힌 영양소를 섭취할 수 있어요.\n\n단백질이 부족하다면 **삼겹살 구이**나 **닭가슴살 샐러드**도 좋은 선택이에요!`;
        } else if (caloriePercent < 80) {
            return `오늘 칼로리 섭취가 ${caloriePercent}%네요! 👍\n\n가벼운 식사로 **샐러드**나 **그릭요거트**를 추천해요. 단백질도 함께 챙기면 더 좋아요!\n\n저녁은 **닭가슴살 샐러드**나 **두부 요리**가 좋을 것 같아요.`;
        } else {
            return `오늘 칼로리를 거의 다 채웠네요! (${caloriePercent}%) 🎯\n\n간식이 먹고 싶다면 **과일**이나 **견과류** 소량을 추천해요. 저칼로리면서 영양가 있는 선택이에요.\n\n내일을 위해 충분한 휴식을 취하세요! 😊`;
        }
    }

    if (question.includes('칼로리')) {
        return `칼로리 조절, 함께 해볼까요? 💪\n\n**핵심 팁 3가지:**\n\n1️⃣ **식사 기록 습관화**\n매 끼니 사진 찍기만 해도 과식이 줄어들어요!\n\n2️⃣ **단백질 먼저**\n밥보다 반찬(단백질)을 먼저 먹으면 포만감이 오래가요.\n\n3️⃣ **물 자주 마시기**\n배고픔을 갈증으로 착각하는 경우가 많아요.\n\n현재 오늘 ${todayCalories}kcal 섭취했어요. 목표까지 ${Math.max(0, 2000 - todayCalories)}kcal 남았네요!`;
    }

    if (question.includes('단백질')) {
        return `단백질 섭취가 중요하죠! 💪\n\n오늘 ${todayProtein}g 섭취하셨네요 (목표의 ${proteinPercent}%).\n\n**단백질 높은 음식 추천:**\n• 닭가슴살 (100g당 31g)\n• 계란 (1개당 6g)\n• 그릭요거트 (100g당 10g)\n• 두부 (100g당 8g)\n• 연어 (100g당 25g)\n\n**팁:** 매 끼니마다 손바닥 크기의 단백질을 섭취하면 하루 권장량을 쉽게 채울 수 있어요!`;
    }

    if (question.includes('팁') || question.includes('습관')) {
        return `건강한 식습관을 위한 한끼의 팁이에요! 🌟\n\n**1. 규칙적인 식사**\n가능하면 매일 같은 시간에 식사하세요.\n\n**2. 천천히 먹기**\n20분 이상 식사하면 포만감을 더 느껴요.\n\n**3. 채소 먼저**\n식이섬유가 혈당 상승을 늦춰줘요.\n\n**4. 가공식품 줄이기**\n집밥이나 신선한 재료 위주로!\n\n**5. 충분한 수분**\n하루 2L 이상 물 마시기.\n\n작은 습관이 큰 변화를 만들어요! 화이팅! 💚`;
    }

    // Default response
    return `안녕하세요! 저는 한끼 AI 코치예요. 🤗\n\n오늘의 기록을 보니 ${todayCalories}kcal, 단백질 ${todayProtein}g을 섭취하셨네요.\n\n식단, 영양, 건강한 습관에 대해 무엇이든 물어보세요! 함께 건강한 식생활을 만들어가요. 💚`;
};

export default function CoachPage() {
    const { setActiveTab } = useUIStore();
    const { todayNutrition } = useNutritionStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `안녕하세요! 저는 한끼 AI 코치예요. 🤗\n\n오늘 식단에 대해 궁금한 점이나 조언이 필요하시면 언제든 물어보세요!\n\n아래 버튼을 눌러 빠르게 질문할 수도 있어요.`,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const aiResponse = generateMockResponse(
            text,
            todayNutrition?.calories?.current ?? 0,
            todayNutrition?.protein?.current ?? 0
        );

        const assistantMessage: Message = {
            id: `assistant_${Date.now()}`,
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const handleQuickQuestion = (question: QuickQuestion) => {
        handleSend(question.text);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">🐥</span>
                        </div>
                        <div>
                            <h1 className="font-bold">한끼 AI 코치</h1>
                            <p className="text-xs text-green-100">식단 & 영양 상담</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Stats */}
            <div className="bg-white border-b px-4 py-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">오늘의 섭취</span>
                    <div className="flex gap-4 text-sm">
                        <span className="text-green-600 font-medium">{todayNutrition?.calories?.current ?? 0} kcal</span>
                        <span className="text-blue-600 font-medium">단백질 {todayNutrition?.protein?.current ?? 0}g</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    message.role === 'user'
                                        ? 'bg-green-500 text-white rounded-br-md'
                                        : 'bg-white shadow-sm rounded-bl-md'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-line">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.role === 'user' ? 'text-green-100' : 'text-gray-400'
                                }`}>
                                    {message.timestamp.toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
                <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500 mb-2">자주 묻는 질문</p>
                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((q) => (
                            <motion.button
                                key={q.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickQuestion(q)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {q.icon}
                                {q.text}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="bg-white border-t px-4 py-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSend(inputValue)}
                        disabled={!inputValue.trim() || isTyping}
                        className={`p-2 rounded-full transition-colors ${
                            inputValue.trim() && !isTyping
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
