import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Building, Landmark, MapPin, FileCheck } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingModalOpen, setIsOnboardingModalOpen, setOnboardingCompleted } = useShipping();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [gstin, setGstin] = useState('27AADCS1248M1ZR');
  const [businessName, setBusinessName] = useState('Swift Ventures Private Limited');
  const [pan, setPan] = useState('AADCS1248M');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNo, setAccountNo] = useState('50200049281924');
  const [ifsc, setIfsc] = useState('HDFC0000240');
  const [warehouseCity, setWarehouseCity] = useState('Bhiwandi, Mumbai (421302)');
  const [agreementChecked, setAgreementChecked] = useState(true);

  if (!isOnboardingModalOpen) return null;

  const handleFinish = () => {
    setOnboardingCompleted(true);
    setIsOnboardingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#00182B] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-[14px]">Merchant KYC & Business Onboarding</h3>
          </div>
          <button
            onClick={() => setIsOnboardingModalOpen(false)}
            className="text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#FAFBFB] px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Business & GST' },
            { num: 2, label: 'COD Bank Account' },
            { num: 3, label: 'Warehouse & SLA' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep >= s.num
                    ? 'bg-[#299E00] text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  currentStep === s.num ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-5 text-xs space-y-4">
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold pb-1 border-b border-slate-100">
                <Building className="w-4 h-4 text-[#299E00]" />
                <span>Company Details & Tax Identification</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Company / Trade Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Business PAN</label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                * GSTIN is required for e-way bills and B2B shipping tax credits.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold pb-1 border-b border-slate-100">
                <Landmark className="w-4 h-4 text-[#299E00]" />
                <span>Bank Account Details (For Automated COD Remittances)</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                  />
                </div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#299E00] shrink-0" />
                <span>
                  Penny drop verification succeeded. COD funds will be credited every Tuesday & Friday.
                </span>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold pb-1 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-[#299E00]" />
                <span>Primary Warehouse & Courier Agreement</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Primary Dispatch Warehouse</label>
                <input
                  type="text"
                  value={warehouseCity}
                  onChange={(e) => setWarehouseCity(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2 text-[11px] text-slate-600">
                <p className="font-semibold text-slate-800">Master Shipping Aggregator Terms:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Daily courier pickups scheduled automatically between 1:00 PM – 4:00 PM.</li>
                  <li>NDR re-attempts initiated within 24 hours of notification.</li>
                  <li>Standard freight charges deducted automatically from prepaid balance.</li>
                </ul>
                <label className="flex items-center gap-2 pt-1 font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    className="rounded text-[#299E00]"
                  />
                  <span>I agree to the Courier Logistics & SLA terms.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded font-medium cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!agreementChecked}
              className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded font-medium cursor-pointer disabled:opacity-50"
            >
              Complete & Activate Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
