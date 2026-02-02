//Chat.tsx
import React, { useState, useEffect, useRef } from 'react'; 
import { Mic, MicOff, Send, Languages, Trash2, Square, RotateCcw } from 'lucide-react';
import type { Message } from '../types'; 

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState<'hu-HU' | 'en-US'>('hu-HU');
  
  const recognitionRef = useRef<any>(null); // Referencia a hangfelismerőhöz
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // --- ÁLLJ GOMB (Mindent leállít) ---
  const stopEverything = () => {
    window.speechSynthesis.cancel(); // Robot elhallgat
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Mikrofon leáll
    }
    setIsSpeaking(false);
    setIsListening(false);
  };

  // --- ÚJRA GOMB (Törlés és alaphelyzet) ---
  const resetChat = () => {
    stopEverything();
    setMessages([]);
    setInputText("");
  };

  // --- PONTOSÍTOTT HANGFELISMERÉS ---
  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Hiba: Nem támogatott böngésző.");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // --- PONTOSSÁGI BEÁLLÍTÁSOK ---
    recognition.lang = lang;
    recognition.continuous = false;   // Csak egy mondatot vár, így pontosabb
    recognition.interimResults = true; // Menet közben is látod, mit hall

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          // Menet közben frissítjük a beviteli mezőt, hogy lásd, jól érti-e
          setInputText(event.results[i][0].transcript);
        }
      }
      
      if (finalTranscript) {
        setInputText(finalTranscript);
        sendMessage(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("STT Hiba:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    try {
      const res = await fetch('http://localhost:3000/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, lang: lang.split('-')[0] }),
      });
      const data = await res.json();
      const aiMsg: Message = { id: (Date.now()+1).toString(), text: data.response, sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      speak(data.response);
    } catch (e) { console.error(e); }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      
      {/* HEADER / VEZÉRLÉS */}
      <div className="p-4 bg-slate-800 flex justify-between items-center shadow-lg">
        <div className="flex gap-2">
          <button onClick={() => setLang(l => l === 'hu-HU' ? 'en-US' : 'hu-HU')} className="bg-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <Languages size={16} /> {lang === 'hu-HU' ? 'Magyar' : 'English'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={stopEverything} className="p-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 text-sm">
            <Square size={16} fill="currentColor" /> Állj
          </button>
          <button onClick={resetChat} className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm">
            <RotateCcw size={16} /> Újra
          </button>
        </div>
      </div>

      {/* AVATAR */}
      <div className="flex flex-col items-center py-8">
        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 transition-all duration-500 ${isSpeaking ? 'border-green-400 scale-105 shadow-lg' : 'border-blue-500'}`}>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lang === 'hu-HU' ? 'Bibi' : 'Jasper'}&mood=${isSpeaking ? 'happy' : 'neutral'}`} 
            className="rounded-full bg-slate-800" 
            alt="AI"
          />
        </div>
      </div>

      {/* ÜZENETEK */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* BEVITEL */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <button 
            onClick={handleListen}
            className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
            placeholder="Hallgatlak..."
            className="flex-1 bg-slate-900 border-none rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={() => sendMessage(inputText)} className="p-4 text-blue-400"><Send size={24} /></button>
        </div>
      </div>
    </div>
  );
};

export default Chat;