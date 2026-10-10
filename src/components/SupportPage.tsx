import React, { useState } from 'react';
import { HelpCircle, Headphones, MessageSquare, Phone, Mail, Plus, CheckCircle2 } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-8012',
      category: 'NDR Escalation',
      awb: 'SFX441092812',
      subject: 'Courier driver marked customer unreachable without calling',
      status: 'In Investigation',
      priority: 'High',
      updatedAt: '2 hours ago',
    },
    {
      id: 'TCK-7994',
      category: 'Pickup Missed',
      awb: 'SWIFT-904128',
      subject: 'Bhiwandi warehouse afternoon pickup delayed by 45 mins',
      status: 'Resolved',
      priority: 'Medium',
      updatedAt: 'Yesterday',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('NDR Escalation');
  const [awb, setAwb] = useState('');
  const [subject, setSubject] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newT = {
      id: `TCK-${Math.floor(8000 + Math.random() * 900)}`,
      category,
      awb: awb || 'N/A',
      subject,
      status: 'Open',
      priority: 'High',
      updatedAt: 'Just now',
    };
    setTickets([newT, ...tickets]);
    setIsModalOpen(false);
    setSubject('');
    setAwb('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#299E00]" />
            <span>Support & Courier Escalation Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Direct SLA escalations with Delhivery, Blue Dart, Xpressbees, and Shadowfax hub managers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Ticket</span>
        </button>
      </div>

      {/* Account Manager Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-slate-400 text-[11px] block">Dedicated Account Manager</span>
          <span className="font-bold text-slate-900 text-sm">Prateek Singhania</span>
          <p className="text-slate-500 text-[11px]">Senior Logistics Specialist</p>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-slate-400 text-[11px] block">Emergency Ops Hotline</span>
          <span className="font-bold text-slate-900 text-sm font-mono">+91 80 4719 2800</span>
          <p className="text-emerald-600 text-[11px]">Mon - Sat: 9:00 AM – 9:00 PM IST</p>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-slate-400 text-[11px] block">Priority Email Desk</span>
          <span className="font-bold text-slate-900 text-sm font-mono">support@swiftlogistics.in</span>
          <p className="text-slate-500 text-[11px]">Under 15-minute response SLA</p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-[6px] border border-slate-200/90 overflow-hidden">
        <div className="p-3 border-b border-slate-100 font-semibold text-slate-900 text-xs">
          Active Escalation Tickets ({tickets.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Related AWB</th>
                <th className="py-2.5 px-3">Subject / Issue</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{t.category}</td>
                  <td className="py-3 px-3 font-mono text-emerald-700">{t.awb}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-[280px]">{t.subject}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{t.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#00182B] text-white px-4 py-3 font-semibold">
              Raise Priority Support Ticket
            </div>
            <form onSubmit={handleCreateTicket} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Issue Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded"
                >
                  <option value="NDR Escalation">NDR Reattempt Escalation</option>
                  <option value="Pickup Missed">Warehouse Pickup Missed</option>
                  <option value="Weight Discrepancy">Weight Discrepancy Dispute</option>
                  <option value="COD Delay">COD Remittance Delay</option>
                  <option value="Billing / Wallet">Billing / Wallet Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Shipment AWB / Swift ID</label>
                <input
                  type="text"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="e.g. DEL84920412891"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Subject & Details *</label>
                <textarea
                  required
                  rows={3}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Describe the issue and desired courier action..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white font-medium rounded"
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
