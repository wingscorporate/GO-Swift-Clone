import React from 'react';
import { Scale, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';

export const DiscrepanciesPage: React.FC = () => {
  const { discrepancies, resolveDiscrepancy } = useShipping();

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#299E00]" />
            <span>Weight Discrepancy Reconciliation</span>
          </h2>
          <p className="text-xs text-slate-500">
            Couriers scan package volumetric dimensions on sorting conveyor belts. Review discrepancies within the 7-day dispute window.
          </p>
        </div>

        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Auto-acceptance applies after deadline expires.</span>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-slate-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">AWB & Courier</th>
                <th className="py-2.5 px-3">Merchant Wt</th>
                <th className="py-2.5 px-3">Courier Wt</th>
                <th className="py-2.5 px-3">Excess Wt</th>
                <th className="py-2.5 px-3">Disputed Amount</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{d.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-mono font-semibold text-slate-800">{d.awb}</div>
                    <div className="text-[11px] text-slate-500">{d.courier}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">{d.merchantWeight} kg</td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-700">{d.courierWeight} kg</td>
                  <td className="py-3 px-3 font-mono text-amber-700">+{d.excessWeight} kg</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{d.disputedAmount}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{d.disputeDeadline}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        d.status === 'Accepted'
                          ? 'bg-slate-100 text-slate-700'
                          : d.status === 'Disputed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {d.status === 'Pending Action' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const proof = prompt('Upload/Enter packaging photo URL or notes for dispute:');
                            if (proof) resolveDiscrepancy(d.id, 'dispute');
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-medium transition cursor-pointer"
                        >
                          Dispute
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Accept excess weight charge of ₹${d.disputedAmount}?`)) {
                              resolveDiscrepancy(d.id, 'accept');
                            }
                          }}
                          className="px-2.5 py-1 bg-[#299E00] hover:bg-[#238700] text-white rounded font-medium transition cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Closed</span>
                    )}
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
