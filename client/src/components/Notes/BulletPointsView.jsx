import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BulletPointsView = ({ notes }) => {
    return (
        <div className="space-y-6">
            {notes.map((topic, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-slate-700">
                        {topic.topicTitle}
                    </h3>
                    <ul className="space-y-3">
                        {topic.bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default BulletPointsView;
