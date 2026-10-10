import React from 'react';
import { FileText, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';

export const ReportPage: React.FC = () => {
  const { shipments } = useShipping();

  const handleDownload = (reportName: string) => {
    const csvContent = `Report: ${reportName}\nGenerated Date: ${new Date().toLocaleDateString()}\nTotal Records: ${shipments.length}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reports = [
    {
      title: 'Daily Courier Manifest Report',
      description: 'Handover sheet with courier barcode AWBs, parcel weights, and rider signature logs.',
      format: 'CSV / PDF',
      type: 'Manifest',
    },
    {
      title: 'Delivered Shipments SLA Audit',
      description: 'Origin-to-destination transit timelines, transit delays, and delivery OTP timestamps.',
      format: 'Excel / CSV',
      type: 'Deliveries',
    },
    {
      title: 'NDR & RTO Non-Delivery Logs',
      description: 'Customer contact attempt history, failure reasons, and merchant reattempt instructions.',
      format: 'CSV',
      type: 'NDR',
    },
    {
      title: 'COD Remittance & Freight Statement',
      description: 'Consolidated reconciliation statement for cash collections, platform margins, and GST.',
      format: 'Excel',
      type: 'Finance',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#299E00]" />
            <span>Operational Reports & Data Exports</span>
          </h2>
          <p className="text-xs text-slate-500">
            Generate audited CSV and Excel exports for ERP integration, tax filing, and courier SLA reviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{rep.title}</h3>
                <span className="text-[11px] text-[#299E00] font-medium">{rep.type}</span>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {rep.format}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">{rep.description}</p>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Past 30 days dataset</span>
              <button
                onClick={() => handleDownload(rep.title)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#299E00] rounded text-slate-800 font-medium flex items-center gap-1.5 transition cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#299E00]" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
