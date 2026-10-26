import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';

export const SupportTicketsView: React.FC = () => {
  const { tickets, createTicket, replyToTicket, currentStore, invoices, userRole } = useApp();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [replyText, setReplyText] = useState('');

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'invoice' | 'points' | 'payout' | 'voucher' | 'kyc' | 'general'>('invoice');
  const [linkedInvoiceId, setLinkedInvoiceId] = useState(invoices[0]?.id || '');
  const [initialMessage, setInitialMessage] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket(subject, category, initialMessage, linkedInvoiceId);
    setIsCreatingTicket(false);
    setSubject('');
    setInitialMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    replyToTicket(selectedTicket.id, replyText);
    setReplyText('');
    // refresh selected ticket
    const updated = tickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Support Desk & Claim Disputes
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Resolve invoice OCR questions, payout inquiries, and delivery tracking directly with operations agents.
          </p>
        </div>
        <button
          onClick={() => setIsCreatingTicket(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Main 2-Column Interface: Ticket List + Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E5EAE1] flex items-center justify-between">
            <span className="text-xs font-bold text-[#172018]">Active Cases ({tickets.length})</span>
            <span className="text-[11px] text-[#697565]">SLA Response: &lt; 4 Hours</span>
          </div>

          <div className="divide-y divide-[#E5EAE1]">
            {tickets.map(tkt => {
              const isSelected = selectedTicket?.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F5F7F3] border-l-3 border-[#153B2B]' : 'hover:bg-[#FAFBF9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[10px] text-[#697565] font-semibold">{tkt.ticketNumber}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      tkt.status === 'resolved' ? 'bg-[#EAF7EE] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {tkt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#172018] line-clamp-1">{tkt.subject}</h4>
                  
                  <div className="flex items-center justify-between text-[11px] text-[#697565] mt-2 font-tabular">
                    <span className="capitalize">{tkt.category} Issue</span>
                    <span>{tkt.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs flex flex-col h-[520px]">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#E5EAE1] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#172018]">{selectedTicket.subject}</h3>
                    <span className="font-mono text-[10px] text-[#697565]">{selectedTicket.ticketNumber}</span>
                  </div>
                  <div className="text-[11px] text-[#697565] mt-0.5">
                    Assigned: {selectedTicket.assignedAgent} · Priority: {selectedTicket.priority}
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFBF9]">
                {selectedTicket.messages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-[#697565] mb-1 px-1 font-tabular">
                        {msg.senderName} · {msg.timestamp}
                      </div>
                      <div className={`p-3 rounded-2xl text-xs max-w-md leading-relaxed ${
                        isUser 
                          ? 'bg-[#153B2B] text-[#FFFFFF] rounded-br-xs' 
                          : 'bg-[#FFFFFF] text-[#172018] border border-[#E5EAE1] rounded-bl-xs shadow-2xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-[#E5EAE1] bg-[#FFFFFF] flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply as ${userRole === 'retailer' ? currentStore.ownerName : 'Operations Agent'}...`}
                  className="flex-1 text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-xl px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                />
                <button
                  type="submit"
                  className="p-2 text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl cursor-pointer transition-colors shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#697565]">
              Select a ticket to view message history.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isCreatingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE1]">
              <h3 className="text-sm font-bold text-[#172018]">Open Support Ticket</h3>
              <button onClick={() => setIsCreatingTicket(false)} className="text-[#697565] hover:text-[#172018]">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                >
                  <option value="invoice">Distributor Invoice OCR & Points</option>
                  <option value="payout">Cash Payout & Bank Settlement</option>
                  <option value="voucher">Digital Voucher Code Issue</option>
                  <option value="kyc">Store KYC & Bank Verification</option>
                  <option value="general">Programme Terms & General Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Query on points credited for invoice 9481"
                  className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">Detailed Explanation</label>
                <textarea
                  required
                  rows={4}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Describe your issue with reference to specific invoice or payout numbers..."
                  className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="px-4 py-2 text-xs text-[#697565] hover:text-[#172018]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
