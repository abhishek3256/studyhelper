import React from 'react';

const DetailedNotesView = ({ notes }) => {
    return (
        <div className="space-y-8">
            {notes.map((topic, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {topic.topicTitle}
                    </h3>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {topic.detailedExplanation}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DetailedNotesView;
