import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import chatService from '../../services/chatService';
import useVoice from '../../hooks/useVoice';
import MessageBubble from './MessageBubble';
import VoiceControls from './VoiceControls';

const ChatInterface = ({ syllabusId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        isSpeaking,
        setTranscript
    } = useVoice();

    // Load initial history
    useEffect(() => {
        if (isOpen && syllabusId) {
            const loadHistory = async () => {
                setLoading(true);
                try {
                    const data = await chatService.getChatHistory(syllabusId);
                    if (data.success) {
                        setMessages(data.messages);
                    }
                } catch (error) {
                    console.error("Failed to load chat history", error);
                } finally {
                    setLoading(false);
                }
            };
            loadHistory();
        }
    }, [isOpen, syllabusId]);

    // Handle voice transcript
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setTranscript(''); // Clear voice transcript

        // Optimistic UI update
        const tempMessages = [...messages, { role: 'user', content: userMsg, timestamp: new Date() }];
        setMessages(tempMessages);
        setLoading(true);

        try {
            const data = await chatService.sendMessage(syllabusId, userMsg);
            if (data.success) {
                const newMessages = [...tempMessages, data.aiMessage];
                setMessages(newMessages);
                speak(data.aiMessage.content);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            // Revert or show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-40 flex flex-col items-center md:items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all origin-bottom-right animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            AI Assistant
                        </h3>
                        <div className="flex items-center gap-2">
                            <VoiceControls
                                isListening={isListening}
                                startListening={startListening}
                                stopListening={stopListening}
                                isSpeaking={isSpeaking}
                                stopSpeaking={stopSpeaking}
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-950/50">
                        {messages.length === 0 && !loading && (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-20 text-sm">
                                <p>Ask me anything about your syllabus!</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} />
                        ))}

                        {loading && (
                            <div className="flex gap-2 items-center text-gray-400 text-sm ml-4 mb-2">
                                <Loader2 size={16} className="animate-spin" />
                                <span>Thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <Send size={18} className={loading ? "opacity-0" : "opacity-100"} />
                            {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={18} className="animate-spin space-x-0" /></div>}
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen
                    ? 'bg-gray-200 text-gray-600 rotate-90 scale-90 dark:bg-slate-700 dark:text-gray-300'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/30 hover:scale-105'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default ChatInterface;
