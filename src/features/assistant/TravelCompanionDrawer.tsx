import React, { useState } from 'react';
import { GeneratedItinerary, AssistantMessage } from '../../types/travel';
import { processAssistantQuery } from '../../lib/assistant/companionEngine';
import {
  Compass,
  Send,
  Sparkles,
  RotateCcw,
  X,
  MessageSquare,
  Bot,
  User,
  Coffee,
  Coins,
  Snowflake,
  ShieldCheck,
} from 'lucide-react';

interface TravelCompanionDrawerProps {
  itinerary: GeneratedItinerary;
  onUpdateItinerary: (updated: GeneratedItinerary, actionSummary?: string) => void;
  onUndoLastChange?: () => void;
  canUndo?: boolean;
}

export const TravelCompanionDrawer: React.FC<TravelCompanionDrawerProps> = ({
  itinerary,
  onUpdateItinerary,
  onUndoLastChange,
  canUndo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');

  // Initial welcome message
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I am the **WAYFARER Travel Companion**, your local intelligent planning assistant. 

I can answer questions regarding weather in Gulmarg, find pure-vegetarian food in Pahalgam, optimize your travel budget, or modify your itinerary (e.g. *"Make day 2 more relaxed"* or *"Switch food to Pure Veg"*). How can I assist your journey today?`,
      timestamp: 'Just now',
      suggestions: [
        'Is Gulmarg worth visiting in December?',
        'Make day 2 more relaxed',
        'Suggest pure vegetarian food options',
        'How can we reduce our travel expenses?',
        'What should we pack in our luggage?',
      ],
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Process using local rule-based engine
    setTimeout(() => {
      const response = processAssistantQuery(query, itinerary);
      setMessages((prev) => [...prev, response.message]);

      if (response.updatedItinerary) {
        onUpdateItinerary(response.updatedItinerary, response.actionSummary);
      }
    }, 250);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-ink-900 text-ivory-50 hover:bg-ink-800 shadow-float border border-champagne-400/40 flex items-center space-x-2.5 group active:scale-95 transition-all no-print"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-champagne-400 group-hover:rotate-12 transition-transform" />
          <span className="w-2 h-2 rounded-full bg-sage-400 absolute -top-0.5 -right-0.5 animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">
          Travel Companion
        </span>
      </button>

      {/* Slide-out Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden no-print">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-float flex flex-col justify-between border-l border-stone-250">
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-stone-200 bg-stone-50/90 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-ink-900 flex items-center justify-center text-champagne-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink-950 flex items-center space-x-1.5">
                      <span>WAYFARER Companion</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-champagne-100 text-champagne-800">
                        Local AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Rule-based intent engine • Instant edits
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {canUndo && onUndoLastChange && (
                    <button
                      onClick={onUndoLastChange}
                      title="Undo last companion modification"
                      className="px-2.5 py-1 rounded-lg border border-stone-300 text-xs text-stone-700 hover:bg-stone-200 flex items-center space-x-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
                    aria-label="Close companion"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-ink-900 text-ivory-50 rounded-br-none'
                          : 'bg-stone-100 text-ink-950 border border-stone-250 rounded-bl-none leading-relaxed'
                      }`}
                    >
                      <div className="prose prose-xs max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {msg.actionApplied && (
                        <div className="mt-2.5 pt-2 border-t border-stone-300/60 text-[11px] font-semibold text-sage-800 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-sage-600 shrink-0" />
                          <span>Action applied: {msg.actionApplied.description}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* Suggested Query Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-champagne-50 hover:bg-champagne-100 text-champagne-900 border border-champagne-200 transition-all text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-stone-250 bg-white space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="e.g. 'Make day 2 more relaxed' or 'Suggest veg food'"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-champagne-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-ink-900 text-ivory-50 hover:bg-ink-800 transition-all shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-champagne-400" />
                  </button>
                </form>

                <p className="text-[10px] text-stone-400 text-center italic">
                  * Honest AI: Local rule-based assistant. Zero external cloud API calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

