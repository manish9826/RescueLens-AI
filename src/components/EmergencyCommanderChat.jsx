import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck,
  RotateCcw,
  Zap
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

const QUICK_PROMPTS = [
  "Which incident should be handled first?",
  "What resources are required overall?",
  "What are the immediate safety priorities?",
  "Analyze resource allocation risks"
];

export default function EmergencyCommanderChat({ isOpen, onClose, incidents = [] }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Greetings Commander. I am your Gemini-powered Emergency Tactical Advisor. I am currently monitoring all active incidents log. How can I assist your dispatch decision today?",
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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#0B0F19]/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col justify-between">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm">Emergency Commander</h3>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                Gemini AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono block">
              Active Context: {incidents.length} Incidents
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <SafetyDisclaimer compact />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                  : msg.isError
                  ? 'bg-red-950/80 border border-red-500/40 text-red-200 rounded-bl-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* Render simple markdown bold lines */}
              <div className="whitespace-pre-wrap font-sans">
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={line.startsWith('**') ? 'font-bold text-cyan-300 mt-1' : 'mt-0.5'}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="text-[10px] opacity-60 text-right pt-1 font-mono">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-cyan-400 font-mono w-max">
            <Loader2 className="w-4 h-4 animate-spin" />
            Gemini Commander is evaluating active telemetry...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Container */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-2">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Suggested Decision Prompts:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 transition-colors text-left font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Emergency Commander..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className={`p-2.5 rounded-xl transition-all ${
            inputMessage.trim() && !isLoading
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
