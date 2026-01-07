'use client';

import { motion } from 'framer-motion';
import HankiMascot from './HankiMascot';

interface AnalysisLoadingProps {
    /** 로딩 메시지 */
    message?: string;
}

/**
 * 음식 분석 중 로딩 화면
 * 한끼 마스코트가 생각하는 모습 + 프로그레스 애니메이션
 */
export default function AnalysisLoading({
    message = '음식을 분석하고 있어요...'
}: AnalysisLoadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6"
        >
            {/* 한끼 마스코트 (생각 중) */}
            <motion.div
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                <HankiMascot
                    size="lg"
                    showMessage={false}
                />
            </motion.div>

            {/* 메시지 */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-lg font-medium text-gray-700 text-center"
            >
                {message}
            </motion.p>

            {/* 프로그레스 바 */}
            <div className="mt-6 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                        width: ['0%', '70%', '90%', '70%', '85%', '95%'],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* 로딩 도트 */}
            <div className="mt-4 flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* 팁 */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-sm text-gray-400 text-center"
            >
                💡 포장식품은 더 정확하게 분석해요
            </motion.p>
        </motion.div>
    );
}
