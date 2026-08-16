'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Bot, X, Send, Sparkles, UserCheck } from 'lucide-react';

interface AIAssistantDrawerProps {
  currentRole?: UserRole | 'LANDING';
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ currentRole = 'LANDING' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Featherless AI Assistant configured for ${currentRole} view. Ask me questions like "Which projects need my attention?" or "Show completed impact summaries".`,
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentRole, query: userText }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, { sender: 'ai', text: json.data.response }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, I encountered an issue retrieving that information.' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Network error connecting to Featherless AI Service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg transition-all hover:scale-105"
      >
        <Bot className="h-5 w-5" />
        <span className="text-xs">Ask Featherless AI</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">IRISiv Featherless AI Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                    <UserCheck className="h-3 w-3 text-teal-600" />
                    <span>Role Restricted Context: <strong className="text-slate-800">{currentRole}</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none shadow-sm font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin text-teal-600" />
                    <span>Featherless AI thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about project status, verification, impact..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors flex items-center justify-center shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
