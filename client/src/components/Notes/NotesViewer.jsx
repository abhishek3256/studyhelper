import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, BookOpen, HelpCircle, ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import BulletPointsView from './BulletPointsView';
import DetailedNotesView from './DetailedNotesView';
import QuizSection from './QuizSection';
import ChatInterface from '../Chatbot/ChatInterface';
import notesService from '../../services/notesService';

const NotesViewer = () => {
    const { syllabusId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('summary');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // Try fetching existing notes first
                const data = await notesService.getNotes(syllabusId);

                if (data.notes && data.notes.length > 0) {
                    setNotes(data.notes);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                setLoading(false);
            }
        };
        fetchNotes();
    }, [syllabusId]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await notesService.generateNotes(syllabusId);
            // Refresh notes
            const data = await notesService.getNotes(syllabusId);
            setNotes(data.notes);
        } catch (error) {
            console.error('Error generating notes:', error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    if (notes.length === 0 && !generating) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 px-4 flex flex-col items-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Generate Notes?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        We have your syllabus. Click below to generate AI-powered notes, summaries, and quizzes.
                    </p>
                    <button
                        onClick={handleGenerate}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-transform hover:scale-105 mx-auto"
                    >
                        <Wand2 className="w-5 h-5" />
                        Generate Study Material
                    </button>
                </div>
            </div>
        );
    }

    if (generating) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 px-4 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Wand2 className="w-12 h-12 text-purple-500 animate-bounce mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generating Magic...</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Analyzing syllabus, summarizing topics, and creating quizzes. This may take a minute.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto relative pb-20">
                {/* Navigation & Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow transition-shadow"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">Study Material</h1>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'summary'
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline">Summary</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('detailed')}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'detailed'
                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Detailed Notes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'quiz'
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Quiz</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="pb-12">
                    {activeTab === 'summary' && <BulletPointsView notes={notes} />}
                    {activeTab === 'detailed' && <DetailedNotesView notes={notes} />}
                    {activeTab === 'quiz' && <QuizSection notes={notes} />}
                </div>

                {/* Chatbot */}
                <ChatInterface syllabusId={syllabusId} />
            </div>
        </div>
    );
};

export default NotesViewer;
