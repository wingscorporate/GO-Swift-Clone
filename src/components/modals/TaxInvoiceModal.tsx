import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const TaxInvoiceModal: React.FC = () => {
  const { selectedInvoiceShipment, setSelectedInvoiceShipment } = useShipping();

  if (!selectedInvoiceShipment) return null;

  const s = selectedInvoiceShipment;
  const taxableAmount = Math.round((s.amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((s.amount - taxableAmount) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Top Control Bar */}
        <div className="bg-[#00182B] text-white px-4 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">Tax Invoice / Bill of Supply</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-[#299E00] hover:bg-[#238700] text-white text-xs px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceShipment(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 bg-white text-slate-800 text-xs space-y-4">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Swift Logistics E-Commerce</h2>
              <p className="text-slate-500 text-[11px]">Tax Invoice under Section 31 of CGST Act</p>
              <p className="font-mono text-[11px] text-slate-600 mt-1">GSTIN: 27AADCS1248M1ZR</p>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-slate-900">INV-{s.orderId.replace('ORD-', '')}-26</div>
              <div className="text-slate-500 text-[11px]">Date: {s.lastUpdated.split(' ')[0]}</div>
              <div className="text-slate-500 text-[11px]">AWB: {s.awb}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="font-bold text-[11px] text-slate-400 uppercase">Shipped From:</span>
              <p className="font-semibold text-slate-800">{s.pickupWarehouse.name}</p>
              <p className="text-slate-600">{s.pickupWarehouse.address}</p>
              <p className="text-slate-600">{s.pickupWarehouse.city} - {s.pickupWarehouse.pincode}</p>
            </div>
            <div>
              <span className="font-bold text-[11px] text-slate-400 uppercase">Billed / Delivered To:</span>
              <p className="font-semibold text-slate-800">{s.customer.name}</p>
              <p className="text-slate-600">{s.customer.address}</p>
              <p className="text-slate-600">{s.customer.city}, {s.customer.state} - {s.customer.pincode}</p>
              <p className="font-mono text-slate-600">Ph: {s.customer.phone}</p>
            </div>
          </div>

          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-2">Description / SKU</th>
                  <th className="py-2 px-2 text-center">HSN</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Taxable Val</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {s.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-2 px-2 font-medium text-slate-800">{item.name}</td>
                    <td className="py-2 px-2 text-center font-mono">851830</td>
                    <td className="py-2 px-2 text-center">{item.quantity}</td>
                    <td className="py-2 px-2 text-right font-mono">₹{taxableAmount}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold">₹{s.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="w-56 space-y-1.5 text-right font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span>₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IGST (18%):</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                <span>Grand Total:</span>
                <span>₹{s.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex items-center justify-between">
            <span>This is a computer generated invoice and requires no physical signature.</span>
            <span>Swift Logistics Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
