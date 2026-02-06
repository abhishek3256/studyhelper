import React, { useEffect } from 'react';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';

const VoiceControls = ({ isListening, startListening, stopListening, isSpeaking, stopSpeaking }) => {
    return (
        <div className="flex items-center gap-2">
            {isSpeaking && (
                <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                    title="Stop Speaking"
                >
                    <Square size={18} fill="currentColor" />
                </button>
            )}

            <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-all duration-300 ${isListening
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400'
                    }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
        </div>
    );
};

export default VoiceControls;
