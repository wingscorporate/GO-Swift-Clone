import React, { useState } from 'react';
import { CreditCard, Wallet, Download, ArrowUpRight, ArrowDownLeft, Landmark } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';

export const PaymentsPage: React.FC = () => {
  const { walletBalance, transactions, setIsRechargeModalOpen } = useShipping();
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const filteredTxns = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const exportStatement = () => {
    const headers = 'Txn ID,Ref ID,Type,Amount,Balance After,Description,Date\n';
    const rows = filteredTxns
      .map(
        (t) =>
          `"${t.id}","${t.refId}","${t.type}",${t.amount},${t.balanceAfter},"${t.description}","${t.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wallet_Statement_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Wallet Balance Hero Card */}
      <div className="bg-[#00182B] text-white p-5 rounded-[6px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-300 font-medium">Prepaid Shipping Wallet</span>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400">
            Automated freight charge deductions active for Delhivery, Blue Dart & Xpressbees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRechargeModalOpen(true)}
            className="px-5 py-2 bg-[#299E00] hover:bg-[#238700] text-white font-semibold rounded text-xs transition cursor-pointer shadow"
          >
            + Recharge Wallet
          </button>
          <button
            onClick={exportStatement}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Statement CSV</span>
          </button>
        </div>
      </div>

      {/* COD Remittances Widget */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#299E00]" />
            <h3 className="font-semibold text-slate-900 text-xs">Weekly COD Remittance Schedule</h3>
          </div>
          <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            HDFC Bank · A/C **1924 Verified
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-400 text-[11px] block">Next Remittance Date</span>
            <span className="font-bold text-slate-800 text-sm">Friday, 10 Oct 2026</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-400 text-[11px] block">Pending COD Collection</span>
            <span className="font-bold text-slate-800 text-sm font-mono">₹4,496.00</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-400 text-[11px] block">Last Remitted Amount</span>
            <span className="font-bold text-[#299E00] text-sm font-mono">₹3,240.00</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-[6px] border border-slate-200/90 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-xs">Wallet Transactions & Passbook</h3>
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'credit', 'debit'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition cursor-pointer ${
                  filterType === t
                    ? 'bg-[#EBF7EA] text-[#299E00] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Transaction Description</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{t.createdAt}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">{t.refId}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{t.description}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        t.type === 'credit'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {t.type === 'credit' ? (
                        <ArrowDownLeft className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      <span className="capitalize">{t.type}</span>
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-bold ${
                      t.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    ₹{t.balanceAfter.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
