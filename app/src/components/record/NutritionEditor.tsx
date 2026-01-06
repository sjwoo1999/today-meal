'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    servingGrams: number;
}

interface NutritionEditorProps {
    nutrition: NutritionData;
    onChange: (nutrition: NutritionData) => void;
}

interface MacroRowProps {
    label: string;
    value: number;
    unit: string;
    color: string;
    onChange: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
}

function MacroRow({ label, value, unit, color, onChange, step = 1, min = 0, max = 500 }: MacroRowProps) {
    const handleDecrement = () => {
        onChange(Math.max(min, value - step));
    };

    const handleIncrement = () => {
        onChange(Math.min(max, value + step));
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-gray-700 font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={handleDecrement}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                    <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-16 text-center font-semibold text-gray-900">
                    {value}{unit}
                </span>
                <motion.button
                    onClick={handleIncrement}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                    <Plus className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
}

export default function NutritionEditor({ nutrition, onChange }: NutritionEditorProps) {
    const [servingMultiplier, setServingMultiplier] = useState(1);

    const servingOptions = [0.5, 1, 1.5, 2];

    const handleServingChange = (multiplier: number) => {
        setServingMultiplier(multiplier);
        // Adjust all nutrition values based on serving size
        const baseCalories = nutrition.calories / servingMultiplier;
        const baseProtein = nutrition.protein / servingMultiplier;
        const baseCarbs = nutrition.carbs / servingMultiplier;
        const baseFat = nutrition.fat / servingMultiplier;

        onChange({
            ...nutrition,
            calories: Math.round(baseCalories * multiplier),
            protein: Math.round(baseProtein * multiplier),
            carbs: Math.round(baseCarbs * multiplier),
            fat: Math.round(baseFat * multiplier),
            servingGrams: Math.round((nutrition.servingGrams / servingMultiplier) * multiplier),
        });
    };

    return (
        <div className="space-y-4" data-testid="nutrition-editor">
            {/* Serving Size */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">섭취량</label>
                <div className="flex gap-2">
                    {servingOptions.map((option) => (
                        <motion.button
                            key={option}
                            type="button"
                            onClick={() => handleServingChange(option)}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                                ${servingMultiplier === option
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }
                            `}
                        >
                            {option === 1 ? '1인분' : `${option}인분`}
                        </motion.button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 text-center">
                    {nutrition.servingSize} ({nutrition.servingGrams}g)
                </p>
            </div>

            {/* Calories */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4" data-testid="input-calories">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">총 칼로리</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{nutrition.calories}</span>
                        <span className="text-gray-500">kcal</span>
                    </div>
                </div>
            </div>

            {/* Macros */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">영양 성분 조정</h4>
                <MacroRow
                    label="단백질"
                    value={nutrition.protein}
                    unit="g"
                    color="bg-blue-500"
                    onChange={(value) => onChange({ ...nutrition, protein: value })}
                    step={1}
                    max={200}
                />
                <MacroRow
                    label="탄수화물"
                    value={nutrition.carbs}
                    unit="g"
                    color="bg-amber-500"
                    onChange={(value) => onChange({ ...nutrition, carbs: value })}
                    step={5}
                    max={500}
                />
                <MacroRow
                    label="지방"
                    value={nutrition.fat}
                    unit="g"
                    color="bg-red-400"
                    onChange={(value) => onChange({ ...nutrition, fat: value })}
                    step={1}
                    max={200}
                />
            </div>

            {/* Macro Breakdown Visual */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>영양소 비율</span>
                    <span>
                        {Math.round((nutrition.protein * 4 / nutrition.calories) * 100)}% · {' '}
                        {Math.round((nutrition.carbs * 4 / nutrition.calories) * 100)}% · {' '}
                        {Math.round((nutrition.fat * 9 / nutrition.calories) * 100)}%
                    </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex">
                    <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${(nutrition.protein * 4 / nutrition.calories) * 100}%` }}
                    />
                    <div
                        className="bg-amber-500 transition-all"
                        style={{ width: `${(nutrition.carbs * 4 / nutrition.calories) * 100}%` }}
                    />
                    <div
                        className="bg-red-400 transition-all"
                        style={{ width: `${(nutrition.fat * 9 / nutrition.calories) * 100}%` }}
                    />
                </div>
                <div className="flex justify-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        단백질
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        탄수화물
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                        지방
                    </span>
                </div>
            </div>
        </div>
    );
}
