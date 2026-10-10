import React from 'react';
import { X, CheckCircle2, Circle, Truck, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const TrackingDrawer: React.FC = () => {
  const { selectedTrackingShipment, setSelectedTrackingShipment } = useShipping();

  if (!selectedTrackingShipment) return null;

  const s = selectedTrackingShipment;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-[#00182B] text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">{s.courier.name}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {s.status}
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">
              AWB: {s.awb}
            </div>
          </div>
          <button
            onClick={() => setSelectedTrackingShipment(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Cards */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Consignee</span>
            <span className="font-semibold text-slate-800">{s.customer.name}</span>
            <p className="text-[11px] text-slate-500">{s.customer.city}, {s.customer.pincode}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Payment & Amount</span>
            <span className="font-semibold text-slate-800">
              {s.paymentMode} · ₹{s.amount.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-500">Order: {s.orderId}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Live Shipment Journey
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {s.trackingHistory.map((ev, index) => {
              const isFirst = index === 0;
              return (
                <div key={ev.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      isFirst
                        ? 'bg-[#299E00] text-white ring-4 ring-[#EBF7EA]'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isFirst ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isFirst ? 'text-slate-900' : 'text-slate-700'}`}>
                        {ev.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ev.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {ev.location}
                    </p>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {s.ndrReason && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>NDR Exception Notice</span>
              </div>
              <p>{s.ndrReason}</p>
              {s.ndrAction && <p className="font-semibold">{s.ndrAction}</p>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Courier SLA: Standard (2-4 Days)</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(s.awb);
              alert(`AWB ${s.awb} copied to clipboard!`);
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 cursor-pointer font-medium"
          >
            Copy AWB
          </button>
        </div>
      </div>
    </div>
  );
};
