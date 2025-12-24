'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

// Generate calendar data
const generateCalendarData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{
        date: number;
        isCurrentMonth: boolean;
        calories?: number;
        goal?: number;
        streak?: number;
        isToday?: boolean;
    }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({ date: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
        const isPast = new Date(year, month, i) <= today;

        // Mock data
        let mockCalories: number | undefined;
        let streak: number | undefined;

        if (isPast && i <= today.getDate()) {
            mockCalories = Math.floor(Math.random() * 600) + 1500;
            if (i >= today.getDate() - 6) {
                streak = today.getDate() - i + 7;
            }
        }

        days.push({
            date: i,
            isCurrentMonth: true,
            calories: mockCalories,
            goal: 1800,
            streak,
            isToday,
        });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: i, isCurrentMonth: false });
    }

    return days;
};

const getStatusColor = (calories?: number, goal?: number) => {
    if (!calories || !goal) return 'bg-gray-100';
    const ratio = calories / goal;
    if (ratio >= 0.9 && ratio <= 1.1) return 'bg-secondary-100 border-secondary-300';
    if (ratio > 1.1 && ratio <= 1.3) return 'bg-yellow-100 border-yellow-300';
    if (ratio > 1.3) return 'bg-red-100 border-red-300';
    return 'bg-gray-100 border-gray-200';
};

const getStatusDot = (calories?: number, goal?: number) => {
    if (!calories || !goal) return null;
    const ratio = calories / goal;
    if (ratio >= 0.9 && ratio <= 1.1) return '🟢';
    if (ratio > 1.1 && ratio <= 1.3) return '🟡';
    if (ratio > 1.3) return '🔴';
    return '⚪';
};

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = generateCalendarData(year, month);

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const selectedDayData = selectedDate
        ? days.find(d => d.date === selectedDate && d.isCurrentMonth)
        : null;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">캘린더</h1>
                    <p className="text-gray-500">월간 식단 기록을 한눈에 확인하세요</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium">
                        주간 뷰
                    </button>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-xl transition-colors text-sm font-medium">
                        월간 뷰
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Calendar */}
                <motion.div
                    className="col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={goToPrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">
                            {year}년 {monthNames[month]}
                        </h2>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {dayNames.map((day, i) => (
                            <div
                                key={day}
                                className={`text-center text-sm font-medium py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => (
                            <motion.button
                                key={i}
                                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                                disabled={!day.isCurrentMonth}
                                className={`
                  aspect-square p-2 rounded-2xl border-2 transition-all relative
                  ${!day.isCurrentMonth ? 'opacity-30 cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${day.isToday ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                  ${selectedDate === day.date && day.isCurrentMonth ? 'ring-2 ring-primary-500' : ''}
                  ${getStatusColor(day.calories, day.goal)}
                `}
                                whileHover={day.isCurrentMonth ? { scale: 1.05 } : {}}
                                whileTap={day.isCurrentMonth ? { scale: 0.95 } : {}}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${day.isToday ? 'text-primary-600' : 'text-gray-700'}`}>
                                            {day.date}
                                        </span>
                                        {day.streak && day.streak >= 7 && (
                                            <Flame className="w-3 h-3 text-orange-500" />
                                        )}
                                    </div>

                                    {day.calories && (
                                        <div className="mt-auto">
                                            <span className="text-xs text-gray-500">{day.calories}</span>
                                            <span className="ml-1">{getStatusDot(day.calories, day.goal)}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <span>🟢</span>
                            <span>목표 달성 (90-110%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>🟡</span>
                            <span>조금 초과 (110-130%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>🔴</span>
                            <span>크게 초과</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>⚪</span>
                            <span>미기록</span>
                        </div>
                    </div>
                </motion.div>

                {/* Side Panel */}
                <motion.div
                    className="col-span-4 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Selected Day Detail */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">
                            {selectedDate ? `${month + 1}월 ${selectedDate}일` : '날짜를 선택하세요'}
                        </h3>

                        {selectedDayData?.calories ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-600">총 칼로리</span>
                                    <span className="text-xl font-bold text-gray-900">{selectedDayData.calories} kcal</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-600">목표 대비</span>
                                    <span className={`text-xl font-bold ${selectedDayData.calories <= selectedDayData.goal! * 1.1 ? 'text-secondary-600' : 'text-red-600'
                                        }`}>
                                        {Math.round((selectedDayData.calories / selectedDayData.goal!) * 100)}%
                                    </span>
                                </div>
                                <button className="w-full py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors">
                                    상세 기록 보기
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p>선택된 날짜의 기록이 없습니다</p>
                            </div>
                        )}
                    </div>

                    {/* Streak Info */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Flame className="w-6 h-6 text-orange-500" />
                            <h3 className="font-bold text-gray-900">현재 스트릭</h3>
                        </div>
                        <div className="text-center">
                            <span className="text-5xl font-bold text-orange-600">7</span>
                            <span className="text-xl text-orange-500 ml-1">일</span>
                        </div>
                        <p className="text-center text-sm text-orange-600 mt-2">
                            🔥 일주일 연속 달성! 대단해!
                        </p>
                    </div>

                    {/* Month Summary */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">📊 이번 달 요약</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">기록 일수</span>
                                <span className="font-bold text-gray-900">23일</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">평균 칼로리</span>
                                <span className="font-bold text-gray-900">1,756 kcal</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">목표 달성률</span>
                                <span className="font-bold text-secondary-600">78%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
