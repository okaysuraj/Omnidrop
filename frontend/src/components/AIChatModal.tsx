import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { Link } from "react-router-dom";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export function AIChatModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "Hi! I'm Omni AI. I can help you find products, plan meals, and automatically add ingredients to your cart. What are we cooking today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputValue.trim() || !token) return;
    
    const userText = inputValue;
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get storeId if available
      const storeStr = localStorage.getItem("nearestStore");
      let storeId: number | undefined;
      if (storeStr) {
        storeId = JSON.parse(storeStr).id;
      }

      const data = await api.chatWithAI(token, userText, storeId);
      
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: data.response 
      };
      setMessages(prev => [...prev, newAiMsg]);
      
      // Dispatch storage event to update cart counters if items were added
      if (data.items_added && data.items_added.length > 0) {
        window.dispatchEvent(new Event("cart_updated"));
      }

    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: "I'm having trouble connecting right now. Let's try again later!" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant flex flex-col z-50 overflow-hidden transform transition-all duration-300">
      
      {/* Header */}
      <div className="bg-primary text-on-primary p-4 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-on-primary/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] animate-pulse">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-headline-sm font-bold">Omni AI</h3>
            <p className="font-label-sm opacity-90">Your Shopping Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-on-primary/10 flex items-center justify-center relative z-10 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface scrollbar-hide">
        {!user && (
          <div className="bg-secondary-container text-on-secondary-container p-3 rounded-2xl text-center mb-4 text-sm">
            Please <Link to="/login" className="font-bold underline" onClick={onClose}>log in</Link> to let Omni AI add items to your cart!
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-primary text-on-primary rounded-br-sm' 
                : 'bg-surface-variant text-on-surface-variant rounded-bl-sm border border-outline-variant/50'
            }`}>
              <p className="font-body-md whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-variant text-on-surface-variant p-4 rounded-2xl rounded-bl-sm border border-outline-variant/50 flex gap-1">
              <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-surface-container-low border-t border-outline-variant">
        <div className="relative flex items-end gap-2 bg-surface border border-outline-variant rounded-2xl p-1 focus-within:border-primary transition-colors shadow-sm">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={user ? "Ask me for a recipe..." : "Log in to chat..."}
            disabled={!user || isTyping}
            className="w-full bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] py-3 pl-3 pr-2 font-body-md text-on-surface disabled:opacity-50"
            rows={1}
            style={{ overflow: 'hidden' }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || !user || isTyping}
            className="w-10 h-10 shrink-0 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-surface-variant disabled:text-on-surface-variant transition-all hover:opacity-90 mb-0.5 mr-0.5"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
