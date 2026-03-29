'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Phone, Mic, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const LANG_CODES: Record<string, string> = {
  English: 'en-US',
  Marathi: 'mr-IN',
  Hindi: 'hi-IN',
};

export default function Chatbot() {
  const toggleChat = () => {
    alert('🔵 Jivan-Mitra Chatbot: Opening secure chat...');
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Jivan-Mitra. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODES[selectedLang] || 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          lang: selectedLang,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [m.text]
          }))
        }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I received a blank response from the server.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Connection failed. Please ensure your Python backend is running at http://127.0.0.1:8000",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-30 w-13 h-13 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 animate-in fade-in zoom-in"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed z-40 transition-all duration-300 ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white'}`}>
          
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="font-bold text-sm tracking-tight">Jivan-Mitra AI</h3>
              </div>
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-blue-500 text-[10px] border-none outline-none rounded mt-1 px-1 py-0.5 font-bold cursor-pointer hover:bg-blue-400 transition-colors"
              >
                <option value="English">EN - English</option>
                <option value="Marathi">MR - मराठी</option>
                <option value="Hindi">HI - हिन्दी</option>
              </select>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 text-white hover:bg-white/20">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="bg-slate-50 flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : msg.isError 
                          ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.isError && <AlertCircle className="w-3 h-3 mb-1 inline mr-1" />}
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.sender === 'bot' && !msg.isError && (
                        <button 
                          onClick={() => speak(msg.text)}
                          className="absolute -right-8 bottom-1 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                          title="Speak"
                        >
                          <Volume2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex gap-1.5 items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Jivan Mitra is typing</span>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white p-4 border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-3">
                  <a 
                    href="https://wa.me/14155238886?text=join%20your-sandbox-code" 
                    target="_blank" 
                    className="text-[10px] bg-green-50 text-green-700 py-1.5 px-4 rounded-full flex items-center gap-2 w-fit mx-auto font-bold border border-green-100 hover:bg-green-100 transition-all"
                  >
                    <Phone size={10} fill="currentColor" /> Switch to WhatsApp
                  </a>

                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
                    <input
                      type="text"
                      placeholder={`Message Jivan Mitra (${selectedLang})...`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-transparent flex-1 text-sm outline-none px-3 py-1 text-slate-700 placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || loading}
                      className={`p-2.5 rounded-full transition-all ${
                        input.trim() && !loading ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}