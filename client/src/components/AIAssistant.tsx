import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'AI' | 'USER';
  timestamp: Date;
}

export function AIAssistant(props: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am Aura, your financial assistant. How can I help you today?', sender: 'AI', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'USER', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/ai/chat`, {
        userId: props.userId,
        query: input
      });

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.data.response, 
        sender: 'AI', 
        timestamp: new Date() 
      };
      
      // Artificial delay for realism
      setTimeout(() => {
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 800);

    } catch (error) {
      console.error("AI Error:", error);
      const errMsg: Message = { id: 'err', text: "I'm having trouble connecting to my brain right now. Please try again later.", sender: 'AI', timestamp: new Date() };
      setMessages(prev => [...prev, errMsg]);
      setIsTyping(false);
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-accent)] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/20 animate-bounce-subtle"
      >
        <Sparkles size={24} strokeWidth={2.5}/>
      </button>

      {/* Chat Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-[var(--bg-primary)] shadow-2xl flex flex-col pointer-events-auto animate-slide-left">
            {/* Header */}
            <div className="p-6 bg-[var(--brand-primary)] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot size={24} className="text-[var(--brand-accent)]" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">Aura AI</h3>
                  <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Financial Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-secondary)]/30">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}>
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.sender === 'USER' ? 'bg-[var(--brand-accent)] text-[var(--brand-primary)]' : 'bg-[var(--brand-primary)] text-white'}`}>
                        {msg.sender === 'USER' ? <User size={14}/> : <Bot size={14}/>}
                     </div>
                     <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'USER' ? 'bg-[var(--brand-primary)] text-white rounded-tr-none' : 'bg-white border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'}`}>
                        {msg.text}
                     </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-white flex items-center justify-center flex-shrink-0">
                        <Bot size={14}/>
                     </div>
                     <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-[var(--border-color)]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Aura anything..."
                  className="w-full pl-5 pr-14 py-4 bg-[var(--bg-secondary)] border-2 border-transparent focus:border-[var(--brand-accent)] rounded-2xl text-sm font-medium transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-3 bg-[var(--brand-primary)] text-white rounded-xl hover:bg-[var(--brand-primary)]/90 disabled:opacity-50 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-4 opacity-60">
                Aura learns from your financial data in real-time
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
