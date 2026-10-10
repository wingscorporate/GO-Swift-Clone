import React from 'react';
import { X, Printer, Download, Minus, Maximize2, PackageCheck } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const ShippingLabelModal: React.FC = () => {
  const {
    selectedLabelShipment,
    setSelectedLabelShipment,
    isLabelMinimized,
    setIsLabelMinimized,
  } = useShipping();

  if (!selectedLabelShipment) return null;

  const s = selectedLabelShipment;

  const handlePrint = () => {
    window.print();
  };

  // If user minimized the popup, render a compact floating dock at the bottom right
  if (isLabelMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-[#00182B] text-white rounded-lg shadow-2xl border border-slate-700/80 p-3 max-w-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#299E00]/20 text-[#299E00] flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4 text-[#299E00]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs truncate">Shipment Manifested</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
                {s.courier.name.split(' ')[0]}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono truncate">
              AWB: {s.awb} · ₹{s.shippingCharges || 69} deducted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsLabelMinimized(false)}
            className="px-2.5 py-1 bg-[#299E00] hover:bg-[#238700] text-white text-xs font-semibold rounded flex items-center gap-1 transition cursor-pointer shadow-xs"
            title="Maximize and view 4x6 label"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Maximize</span>
          </button>
          <button
            onClick={() => {
              setSelectedLabelShipment(null);
              setIsLabelMinimized(false);
            }}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
        {/* Top Control Bar with Print, Minimize, and Close */}
        <div className="bg-[#00182B] text-white px-4 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">Standard 4" x 6" Thermal Shipping Label</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="bg-[#299E00] hover:bg-[#238700] text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition mr-1"
            >
              <Printer className="w-3 h-3" />
              <span>Print Label</span>
            </button>
            {/* Minimize Button */}
            <button
              type="button"
              onClick={() => setIsLabelMinimized(true)}
              className="text-slate-300 hover:text-white hover:bg-slate-800 p-1 rounded cursor-pointer transition"
              title="Minimize modal to bottom dock"
            >
              <Minus className="w-4 h-4" />
            </button>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedLabelShipment(null);
                setIsLabelMinimized(false);
              }}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded cursor-pointer transition"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4x6 Label Body */}
        <div className="p-4 bg-slate-100 flex justify-center">
          <div
            id="printable-shipping-label"
            className="w-[380px] bg-white border-2 border-black p-3.5 text-black font-sans shadow-sm text-[11px] space-y-2"
          >
            {/* Header: Carrier and Routing Code */}
            <div className="border-b-2 border-black pb-2 flex items-start justify-between">
              <div>
                <div className="font-extrabold text-base tracking-wider uppercase">
                  {s.courier.name}
                </div>
                <div className="text-[10px] text-gray-700">Swift Logistics Partner Network</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-black text-lg tracking-tight bg-black text-white px-2 py-0.5 rounded-xs">
                  {s.customer.pincode.slice(0, 3)}-{s.customer.city.slice(0, 3).toUpperCase()}
                </div>
                <div className="text-[9px] font-mono text-gray-600 mt-0.5">HUB ROUTE</div>
              </div>
            </div>

            {/* Barcode Block */}
            <div className="text-center py-1 border-b-2 border-black">
              {/* CSS Barcode graphic */}
              <div className="h-12 w-full flex items-center justify-center gap-[2.5px] px-2 overflow-hidden">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2,
                  4, 1, 3, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 1, 2, 4, 1, 3, 2,
                ].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <div className="font-mono font-bold text-xs tracking-widest mt-1">
                AWB: {s.awb}
              </div>
              <div className="text-[10px] text-gray-600 font-mono">
                Order ID: {s.orderId} · Swift ID: {s.id}
              </div>
            </div>

            {/* Payment Mode Banner */}
            <div
              className={`p-1.5 text-center font-bold text-xs tracking-wider border-2 border-black ${
                s.paymentMode === 'COD' ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
            >
              {s.paymentMode === 'COD' ? (
                <span>COLLECT CASH ON DELIVERY: ₹{s.amount.toLocaleString('en-IN')}.00</span>
              ) : (
                <span>PREPAID SHIPMENT — DO NOT COLLECT CASH</span>
              )}
            </div>

            {/* Ship To (Customer) */}
            <div className="border-b border-black pb-2 pt-1">
              <span className="font-bold text-[10px] uppercase text-gray-600 block">Deliver To:</span>
              <div className="font-bold text-xs">{s.customer.name}</div>
              <div className="text-[11px] leading-tight text-gray-800">
                {s.customer.address}
                {s.customer.landmark ? `, ${s.customer.landmark}` : ''}
              </div>
              <div className="font-bold text-xs mt-1">
                {s.customer.city}, {s.customer.state} —{' '}
                <span className="font-mono text-sm underline">{s.customer.pincode}</span>
              </div>
              <div className="font-mono text-[11px] text-gray-800 mt-0.5">
                Phone: {s.customer.phone}
              </div>
            </div>

            {/* Dimensions & Weight Grid */}
            <div className="grid grid-cols-3 gap-1 border-b border-black pb-2 text-[10px] text-center">
              <div className="border border-gray-400 p-1">
                <span className="text-gray-500 block">Dead Weight</span>
                <span className="font-bold">{s.weight} KG</span>
              </div>
              <div className="border border-gray-400 p-1">
                <span className="text-gray-500 block">Vol. Weight</span>
                <span className="font-bold">{s.volumetricWeight} KG</span>
              </div>
              <div className="border border-gray-400 p-1">
                <span className="text-gray-500 block">Billed Wt</span>
                <span className="font-bold text-black">{s.chargeableWeight} KG</span>
              </div>
            </div>

            {/* Product Details Table */}
            <div className="border-b border-black pb-2 text-[10px]">
              <div className="font-bold text-[9px] uppercase text-gray-500 mb-0.5">
                Item Description
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-600">
                    <th>SKU / Product</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {s.items.map((it, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="truncate max-w-[200px]">{it.name}</td>
                      <td className="text-center font-bold">{it.quantity}</td>
                      <td className="text-right">₹{it.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Return Address (Sender / Warehouse) */}
            <div className="pt-1 text-[9px] text-gray-600">
              <span className="font-bold uppercase text-black block">Return / RTO Address:</span>
              <div className="font-medium text-black">{s.pickupWarehouse.name}</div>
              <div>{s.pickupWarehouse.address}, {s.pickupWarehouse.city} - {s.pickupWarehouse.pincode}</div>
              <div>Contact: {s.pickupWarehouse.phone || s.pickupWarehouse.contactPhone}</div>
            </div>

            {/* Footer QR / Verification */}
            <div className="border-t border-black pt-1 flex items-center justify-between text-[8px] text-gray-500">
              <span>Manifested via Swift Shipping Aggregator</span>
              <span className="font-mono">GST: 27AADCS1248M1ZR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
