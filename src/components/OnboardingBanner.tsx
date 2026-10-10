import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';

export const OnboardingBanner: React.FC = () => {
  const { onboardingCompleted, setIsOnboardingModalOpen } = useShipping();

  if (onboardingCompleted) {
    return (
      <div className="bg-[#EBF7EA] border border-[#BCE4B5] rounded-[4px] px-3.5 py-2 flex items-center justify-between mb-3 text-xs text-[#1F5413]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#299E00] shrink-0" />
          <span className="font-medium text-[12px]">
            Your business onboarding is verified! Live courier rate cards and automated AWBs are active.
          </span>
        </div>
        <button
          onClick={() => setIsOnboardingModalOpen(true)}
          className="text-[#299E00] hover:underline font-semibold text-[11px] cursor-pointer"
        >
          View KYC Details
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#DCF0D6] border border-[#C5E8BD] rounded-[4px] px-3.5 py-1.5 flex items-center justify-between mb-3 text-xs text-[#1F5413]">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-[#299E00] shrink-0 fill-[#299E00]/10" />
        <span className="font-medium text-[12px] tracking-tight">
          Kindly complete your onboarding process to start shipping with us
        </span>
      </div>
      <button
        onClick={() => setIsOnboardingModalOpen(true)}
        className="bg-[#299E00] hover:bg-[#238700] active:scale-95 text-white font-medium px-3.5 py-1 rounded-[4px] text-[12px] transition shadow-xs cursor-pointer whitespace-nowrap"
      >
        Resume Onboarding
      </button>
    </div>
  );
};
