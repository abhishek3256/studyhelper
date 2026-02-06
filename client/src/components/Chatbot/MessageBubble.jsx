import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming we might want markdown support, though simple text for now

const MessageBubble = ({ message }) => {
    const isAi = message.role === 'model';

    return (
        <div className={`flex gap-3 mb-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAi ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                }`}>
                {isAi ? <Bot size={18} /> : <User size={18} />}
            </div>

            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isAi
                    ? 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                {/* Simple text rendering for now, could upgrade to Markdown */}
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <span className="text-[10px] opacity-50 block mt-1 text-right">
                    {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
