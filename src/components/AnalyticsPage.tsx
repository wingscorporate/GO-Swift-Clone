import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Truck,
  CheckCircle2,
  RotateCcw,
  IndianRupee,
  Calendar,
  Layers,
} from 'lucide-react';
import { useShipping } from '../context/ShippingContext';

export const AnalyticsPage: React.FC = () => {
  const { shipments } = useShipping();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');

  // Daily Enterprise Tier (7,000 to 10,000 orders daily at flat ₹69.00 freight cost)
  const todayVolume = 8740;
  const flatShipmentCost = 69.0;
  const todaySpend = todayVolume * flatShipmentCost; // ₹6,03,060
  const monthlyVolume = 254820;
  const monthlySpend = monthlyVolume * flatShipmentCost; // ₹1,75,82,580

  const deliverySuccessRate = 94.6;
  const rtoRate = 4.2;

  // Courier Breakdown for high volume enterprise tier
  const courierStats = [
    { name: 'Delhivery Surface (Enterprise)', volume: 112400, share: '44%', delivered: 106780, tat: '2.1 Days', sla: '96.2%', color: '#2563eb' },
    { name: 'Blue Dart Surface & Air (Enterprise)', volume: 68200, share: '27%', delivered: 66154, tat: '1.4 Days', sla: '98.4%', color: '#16a34a' },
    { name: 'Xpressbees Surface (Enterprise)', volume: 48120, share: '19%', delivered: 45230, tat: '2.6 Days', sla: '94.0%', color: '#f59e0b' },
    { name: 'Shadowfax Express (Enterprise)', volume: 26100, share: '10%', delivered: 24270, tat: '1.9 Days', sla: '93.8%', color: '#8b5cf6' },
  ];

  // Daily Trend Bars strictly within 7,000 to 10,000 orders daily
  const dailyTrends = [
    { date: '01 Oct', volume: 7850, delivered: 7420 },
    { date: '02 Oct', volume: 8240, delivered: 7810 },
    { date: '03 Oct', volume: 8650, delivered: 8180 },
    { date: '04 Oct', volume: 9240, delivered: 8750 },
    { date: '05 Oct', volume: 9860, delivered: 9320 },
    { date: '06 Oct', volume: 7420, delivered: 7010 },
    { date: '07 Oct', volume: 8950, delivered: 8460 },
    { date: '08 Oct', volume: 8740, delivered: 8280 },
  ];

  return (
    <div className="space-y-4">
      {/* Enterprise Tier Header Banner */}
      <div className="bg-[#00182B] text-white p-4 rounded-[6px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#299E00] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              High-Volume Enterprise Account
            </span>
            <span className="text-slate-300 text-xs font-mono">
              Wings Corporate
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Daily Throughput: 7,000 – 10,000 Orders @ ₹69.00 Flat Shipment Cost
          </h2>
          <p className="text-xs text-emerald-400">
            Contracted SLA: Pan-India multi-carrier surface & express routing with zero weight discrepancy penalty under 0.5kg.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-700/80 pt-2 md:pt-0 md:pl-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Today's Freight Spend</span>
            <span className="font-mono text-lg font-bold text-white">
              ₹{todaySpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block">8,740 orders × ₹69.00</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#299E00]" />
            <span>Shipping & Logistics Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time delivery performance, courier SLA benchmarks, RTO percentages, and freight expenditure for 7k–10k daily orders.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
          {(['7D', '30D', '90D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                timeRange === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Monthly Dispatched Volume</span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {monthlyVolume.toLocaleString('en-IN')} orders
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Avg {todayVolume.toLocaleString('en-IN')} orders/day</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Delivery Success Rate</span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {deliverySuccessRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>High-volume fulfillment SLA</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Return To Origin (RTO %)</span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {rtoRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Protected by automated NDR</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-slate-200/90 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Avg Shipment Cost</span>
          <div className="text-xl font-bold text-[#299E00] tabular-nums">
            ₹{flatShipmentCost.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            Contracted Flat Enterprise Rate
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Daily Volume Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-xs">Daily Manifest & Dispatch Volume (7,000 – 10,000 / Day)</h3>
              <p className="text-[11px] text-slate-400">Orders dispatched daily at flat ₹69.00 shipment cost</p>
            </div>
            <span className="text-[11px] text-[#299E00] font-bold font-mono">Past 8 Days</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {dailyTrends.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition">
                  {d.volume.toLocaleString('en-IN')}
                </span>
                <div className="w-full max-w-[32px] bg-slate-100 rounded-t flex flex-col justify-end overflow-hidden h-full">
                  <div
                    className="bg-[#299E00] w-full rounded-t transition-all group-hover:brightness-110"
                    style={{ height: `${(d.volume / 10500) * 100}%` }}
                    title={`${d.date}: ${d.volume.toLocaleString('en-IN')} orders (Spend: ₹${(d.volume * 69).toLocaleString('en-IN')})`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate">{d.date}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#299E00] rounded-xs" />
              <span>Manifested Orders (Daily Target: 7k – 10k)</span>
            </div>
            <span className="font-mono text-slate-700 font-semibold">
              Daily Spend Range: ₹4.83L – ₹6.90L
            </span>
          </div>
        </div>

        {/* Payment Split & Risk */}
        <div className="lg:col-span-4 bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3">
          <h3 className="font-semibold text-slate-900 text-xs">Payment Mode Share</h3>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Prepaid Parcels (64%)</span>
                <span className="font-bold text-slate-900">{(todayVolume * 0.64).toFixed(0)} / day</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#299E00] h-full rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">COD (Cash on Delivery - 36%)</span>
                <span className="font-bold text-slate-900">{(todayVolume * 0.36).toFixed(0)} / day</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 mt-4 space-y-1">
              <span className="font-semibold text-slate-800 block">High-Volume COD Remittance</span>
              <p>Weekly COD remittance of ~₹28,50,000 processed every Tuesday & Friday directly to HDFC Bank.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courier Performance Benchmark Table */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-xs">Courier Partner Performance Comparison (Enterprise Rate: ₹69.00/Parcel)</h3>
          <span className="text-[11px] text-[#299E00] font-bold">Total: {monthlyVolume.toLocaleString('en-IN')} Monthly Orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 px-2">Courier Partner</th>
                <th className="py-2 px-2">Monthly Volume</th>
                <th className="py-2 px-2">Share</th>
                <th className="py-2 px-2">Freight Rate</th>
                <th className="py-2 px-2">Avg TAT</th>
                <th className="py-2 px-2">SLA Adherence</th>
              </tr>
            </thead>
            <tbody>
              {courierStats.map((c, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 px-2 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-2.5 px-2 font-mono font-medium">{c.volume.toLocaleString('en-IN')} orders</td>
                  <td className="py-2.5 px-2 font-mono text-slate-600">{c.share}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-[#299E00]">₹69.00</td>
                  <td className="py-2.5 px-2 text-slate-700 font-medium">{c.tat}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-emerald-700">{c.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
