import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const RechargeModal: React.FC = () => {
  const { isRechargeModalOpen, setIsRechargeModalOpen, rechargeWallet, walletBalance } = useShipping();
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('merchant@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isRechargeModalOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000, 10000];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handlePay = () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      rechargeWallet(finalAmount, paymentMethod.toUpperCase());
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsRechargeModalOpen(false);
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#00182B] text-white px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[14px]">Recharge Shipping Wallet</h3>
            <p className="text-[11px] text-slate-300">
              Current balance:{' '}
              <span className="font-mono font-semibold text-emerald-400">
                ₹{walletBalance.toFixed(2)}
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsRechargeModalOpen(false)}
            className="text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {successMsg ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#299E00] mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-slate-500">
                ₹{finalAmount.toLocaleString('en-IN')} has been added to your shipping wallet.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Amount Selection */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  Select Recharge Amount
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-1.5 rounded border text-[11px] font-semibold transition cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#EBF7EA] border-[#299E00] text-[#299E00]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2">
                  <span className="absolute left-2.5 top-2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    placeholder="Or enter custom amount (e.g. 3500)"
                    className="w-full pl-6 pr-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#299E00]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'border-[#299E00] bg-[#EBF7EA] text-[#299E00]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="font-semibold text-[11px]">UPI Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'border-[#299E00] bg-[#EBF7EA] text-[#299E00]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold text-[11px]">Card / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-2 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#299E00] bg-[#EBF7EA] text-[#299E00]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span className="font-semibold text-[11px]">NetBanking</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-slate-600 text-[11px] mb-1">Enter UPI VPA ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#299E00]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports Google Pay, PhonePe, Paytm & BHIM
                  </p>
                </div>
              )}

              {/* Security info */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/60 flex items-center gap-2 text-slate-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Protected by Razorpay 256-bit SSL encryption. Auto-receipt issued instantly.
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing || finalAmount <= 0}
                className="w-full py-2.5 bg-[#299E00] hover:bg-[#238700] text-white font-semibold rounded text-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${finalAmount.toLocaleString('en-IN')}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
