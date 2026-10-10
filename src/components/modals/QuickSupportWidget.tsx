import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Headphones, CheckCircle2 } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const QuickSupportWidget: React.FC = () => {
  const { isSupportWidgetOpen, setIsSupportWidgetOpen } = useShipping();
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: 'Hello! I am your Swift Shipping Operations Desk. Need help with courier pickups, NDR escalations, or wallet recharges?',
      time: '10:30 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: nowTime }]);
    setInputText('');

    setTimeout(() => {
      let reply = "Our courier liaison team has received your inquiry. We'll update the AWB status directly on your dashboard.";
      if (userMsg.toLowerCase().includes('ndr') || userMsg.toLowerCase().includes('reattempt')) {
        reply = "NDR reattempt requests submitted before 4 PM are scheduled for the next delivery attempt cycle with the courier.";
      } else if (userMsg.toLowerCase().includes('pickup') || userMsg.toLowerCase().includes('warehouse')) {
        reply = "Warehouse daily pickup window is 1:00 PM – 4:30 PM. Your Bhiwandi hub has 2 pending parcels scheduled.";
      } else if (userMsg.toLowerCase().includes('wallet') || userMsg.toLowerCase().includes('recharge')) {
        reply = "Instant wallet top-ups via UPI or NetBanking reflect immediately on your balance and are eligible for GST credit invoice.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Green Action Button matching screenshot */}
      {!isSupportWidgetOpen && (
        <button
          onClick={() => setIsSupportWidgetOpen(true)}
          className="w-12 h-12 rounded-full bg-[#299E00] hover:bg-[#238700] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
          title="Swift Operations Support"
        >
          {/* Exact speech bubble with lines icon from screenshot */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="13" y2="13" />
          </svg>
        </button>
      )}

      {/* Chat Popup Drawer */}
      {isSupportWidgetOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#00182B] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#299E00] flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <div>
                <h4 className="font-semibold text-xs leading-none">Swift Operations Desk</h4>
                <span className="text-[10px] text-emerald-400">Online · Courier Priority Support</span>
              </div>
            </div>
            <button
              onClick={() => setIsSupportWidgetOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Badges */}
          <div className="bg-slate-50 p-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputText('How do I schedule an NDR reattempt?')}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 hover:border-[#299E00] whitespace-nowrap cursor-pointer"
            >
              NDR Reattempt
            </button>
            <button
              onClick={() => setInputText('Track pickup status')}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 hover:border-[#299E00] whitespace-nowrap cursor-pointer"
            >
              Pickup Status
            </button>
            <button
              onClick={() => setInputText('Wallet recharge issue')}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 hover:border-[#299E00] whitespace-nowrap cursor-pointer"
            >
              Wallet Topup
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[85%] text-[11px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#299E00] text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about shipments, pickups or rates..."
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#299E00]"
            />
            <button
              type="submit"
              className="bg-[#299E00] hover:bg-[#238700] text-white p-2 rounded cursor-pointer transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
