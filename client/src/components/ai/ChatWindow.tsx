import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBooking } from '../../context/BookingContext';
import type { BookingPrefill } from '../../context/BookingContext';
import { useAudio } from '../../context/AudioContext';
import { Send, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import aiRoboImg from '../../assets/AI robo.jpg';
import { API_BASE } from '../../utils/api';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  intent?: Partial<BookingPrefill>;
}

export const ChatWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { themeMeta } = useTheme();
  const { scrollToBooking } = useBooking();
  const { playChime, playClick } = useAudio();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: 'Good evening. I am Ari Smith\'s telepathic assistant.\n\nWhether you wish to enquire about wedding close-up magic, corporate conference entertainment, or verify available tour dates in Manchester or internationally, speak your thoughts.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const quickPrompts = [
    'Tell me about wedding magic packages',
    'Do you perform at corporate conferences?',
    'What is your travel radius from Manchester?',
    'How do I check date availability?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isStreaming) return;

    playClick();
    setInput('');

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantMsgId = 'ast-' + Date.now();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Connection lost to psychic channel.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';
      let detectedIntent: Partial<BookingPrefill> | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                accumulatedContent += data.chunk;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
              if (data.intent) {
                detectedIntent = data.intent;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantMsgId
                      ? { ...m, intent: detectedIntent }
                      : m
                  )
                );
              }
            } catch (_) {}
          }
        }
      }

      playChime(1.1);
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: 'A ripple in the psychic ether disrupted our commune. Please inquire once more.' }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleTransferIntent = (intent?: Partial<BookingPrefill>) => {
    playChime(1.3);
    scrollToBooking(intent);
    onClose();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 leading-relaxed shadow-lg border ${
                m.role === 'user'
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-[#121212] text-white/90 border-white/10'
              }`}
            >
              <div className="whitespace-pre-line font-serif font-light text-xs sm:text-[13px]">
                {m.content}
                {isStreaming && m.id === messages[messages.length - 1].id && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-white animate-pulse" />
                )}
              </div>

              {/* Booking Intent Transfer Action */}
              {m.intent && Object.keys(m.intent).length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" style={{ color: themeMeta.accentHex }} />
                    <span>Inquiry Coordinates Detected:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-white/60 mb-2">
                    {m.intent.eventType && <div>Act: <span className="text-white">{m.intent.eventType}</span></div>}
                    {m.intent.eventDate && <div>Date: <span className="text-white">{m.intent.eventDate}</span></div>}
                    {m.intent.venueCity && <div>City: <span className="text-white">{m.intent.venueCity}</span></div>}
                    {m.intent.guestCount && <div>Guests: <span className="text-white">{m.intent.guestCount}</span></div>}
                  </div>
                  <button
                    onClick={() => handleTransferIntent(m.intent)}
                    className="w-full py-2 px-3 border flex items-center justify-center gap-2 font-serif text-[11px] font-bold tracking-wider uppercase transition-all duration-300 hover:brightness-110 active:scale-95 text-white"
                    style={{
                      borderColor: themeMeta.accentHex,
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Transfer To Booking Engine</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 px-1">
              {m.role === 'assistant' && (
                <img
                  src={aiRoboImg}
                  alt="Ari's AI"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-white/20"
                />
              )}
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">
                {m.role === 'assistant' ? 'The Mind Assistant' : 'You'}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries (Sharp Chips) */}
      <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isStreaming}
            className="whitespace-nowrap px-2.5 py-1 border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] text-white/70 hover:text-white transition-all duration-200 font-mono uppercase"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-black/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ari's assistant a question..."
          disabled={isStreaming}
          className="flex-1 bg-white/5 border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="p-2 border border-white/20 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-all duration-200"
          style={{ borderColor: input.trim() ? themeMeta.accentHex : undefined }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
