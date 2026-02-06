import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const QuizCard = ({ question, index }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (selectedOption) setIsSubmitted(true);
    };

    const getOptionClass = (option) => {
        if (!isSubmitted) {
            return selectedOption === option
                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700';
        }

        // Ensure accurate comparison. Some APIs return "A" or "Option A". Simplified check:
        const isCorrect = option.startsWith(question.correctAnswer) || option === question.correctAnswer;
        const isSelected = selectedOption === option;

        if (isCorrect) return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300';
        if (isSelected) return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300';
        return 'opacity-50 border-gray-200 dark:border-slate-600';
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Question {index + 1}</h4>
                <span className={`text-xs px-2 py-1 rounded capitalize ${question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                    }`}>
                    {question.difficulty}
                </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{question.questionText}</p>

            <div className="space-y-3">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => !isSubmitted && setSelectedOption(option)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${getOptionClass(option)}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {!isSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Submit Answer
                </button>
            ) : (
                <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${(selectedOption.startsWith(question.correctAnswer) || selectedOption === question.correctAnswer)
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : 'bg-red-50 dark:bg-red-900/10'
                    }`}>
                    {(selectedOption.startsWith(question.correctAnswer) || selectedOption === question.correctAnswer)
                        ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    }
                    <div>
                        <p className={`font-medium ${(selectedOption.startsWith(question.correctAnswer) || selectedOption === question.correctAnswer)
                                ? 'text-green-800 dark:text-green-400'
                                : 'text-red-800 dark:text-red-400'
                            }`}>
                            {(selectedOption.startsWith(question.correctAnswer) || selectedOption === question.correctAnswer) ? 'Correct!' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{question.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuizSection = ({ notes }) => {
    const allQuestions = notes.flatMap(note => note.questions || []);

    if (allQuestions.length === 0) {
        return <div className="text-center p-8 text-gray-500">No questions generated yet.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            {allQuestions.map((q, i) => (
                <QuizCard key={i} question={q} index={i} />
            ))}
        </div>
    );
};

export default QuizSection;
