import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import SyllabusCard from './SyllabusCard';
import syllabusService from '../../services/syllabusService';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = () => {
    const [syllabi, setSyllabi] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchSyllabi = async () => {
        try {
            const data = await syllabusService.getSyllabi();
            setSyllabi(data.syllabi);
        } catch (error) {
            console.error('Error fetching syllabi:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSyllabi();
    }, []);

    const handleUploadSuccess = () => {
        fetchSyllabi();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.fullName?.split(' ')[0]}!
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Upload your syllabus to generate AI study notes and questions.
                    </p>
                </div>

                {/* Upload Section */}
                <UploadSection onUploadSuccess={handleUploadSuccess} />

                {/* Recent Syllabi */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Recent Uploads
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-32 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : syllabi.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {syllabi.map((syllabus) => (
                                <SyllabusCard key={syllabus._id} syllabus={syllabus} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">
                                No syllabi uploaded yet. Upload one above to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
