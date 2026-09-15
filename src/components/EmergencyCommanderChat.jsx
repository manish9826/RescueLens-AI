import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  Radio
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

const QUICK_PROMPTS = [
  "Which incident should be handled first?",
  "What resources are required?",
  "What are the immediate risks?",
  "Analyze resource allocation risks"
];

export default function EmergencyCommanderChat({ isOpen, onClose, incidents = [] }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Greetings Commander. I am your Gemini-powered Emergency Tactical Advisor. I am currently evaluating active incident logs. How can I assist your dispatch decision today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/commander', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: incidents.map(i => ({
            id: i.id,
            incidentType: i.incidentType,
            severity: i.severity,
            priorityScore: i.priorityScore,
            status: i.status || 'ACTIVE',
            risks: i.risks
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: data.reply,
            isLive: data.isLive,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Failed to communicate with Emergency Commander AI.');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `**Operational Alert:** ${err.message || 'Unable to connect to Gemini Commander backend.'}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/95 dark:bg-[#070A12]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-950 dark:to-slate-900 border border-cyan-200 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Emergency Commander</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-[10px] font-mono text-cyan-800 dark:text-cyan-300 font-bold">
                Gemini 2.5
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
              Context Awareness: {incidents.length} Active Incidents
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <SafetyDisclaimer compact />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.isError
                  ? 'bg-red-50 dark:bg-red-950/90 border border-red-200 dark:border-red-500/40 text-red-900 dark:text-red-200 rounded-bl-none'
                  : 'bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {(msg.text || '').split('\n').map((line, idx) => (
                  <p key={idx} className={line.startsWith('**') ? 'font-bold text-cyan-700 dark:text-cyan-300 mt-1' : 'mt-1'}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="text-[10px] opacity-60 text-right pt-1 font-mono flex items-center justify-end gap-1">
                {msg.sender === 'ai' && <Sparkles className="w-3 h-3 text-cyan-500" />}
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-cyan-700 dark:text-cyan-400 font-mono w-max shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
            Gemini Commander evaluating tactical telemetry...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 space-y-2">
        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Suggested Tactical Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] text-cyan-800 dark:text-cyan-300 transition-all font-semibold shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Emergency Commander..."
          disabled={isLoading}
          className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className={`p-3 rounded-2xl transition-all ${
            inputMessage.trim() && !isLoading
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

    </div>
  );
}
