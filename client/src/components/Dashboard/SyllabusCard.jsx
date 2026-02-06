import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SyllabusCard = ({ syllabus }) => {
    const navigate = useNavigate();

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div
            onClick={() => navigate(`/notes/${syllabus._id}`)}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-slate-700"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {getStatusIcon(syllabus.processingStatus)}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white truncate" title={syllabus.originalFileName}>
                {syllabus.originalFileName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(syllabus.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default SyllabusCard;
