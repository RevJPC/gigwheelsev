"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-slate-600"
                >
                    <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                    >
                        <span className="text-lg font-semibold text-white pr-8">
                            {item.question}
                        </span>
                        <FiChevronDown
                            className={`flex-shrink-0 w-5 h-5 text-green-400 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"
                            }`}
                    >
                        <div className="px-6 pb-4 text-slate-300 leading-relaxed">
                            {item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
