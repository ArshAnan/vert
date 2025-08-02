'use client';

import { ChatMessage as ChatMessageType } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[85%] flex gap-2 ${
          message.isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
            message.isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {message.isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message bubble */}
        <div className="flex flex-col">
          <div
            className={`p-3 rounded-lg shadow-sm ${
              message.isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-800 text-white rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          
          {/* Timestamp */}
          <div
            className={`text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
              message.isUser ? 'text-right' : 'text-left'
            }`}
          >
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
}