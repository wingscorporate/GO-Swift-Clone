import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { useShipping } from '../../context/ShippingContext';

export const AccountProfileModal: React.FC = () => {
  const { userAccount, updateUserAccount, isAccountModalOpen, setIsAccountModalOpen } = useShipping();
  const [name, setName] = useState(userAccount.name);
  const [email, setEmail] = useState(userAccount.email);
  const [role, setRole] = useState(userAccount.role);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(userAccount.name);
    setEmail(userAccount.email);
    setRole(userAccount.role);
    setErrorMsg('');
  }, [userAccount, isAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    updateUserAccount({
      name: name.trim() || 'Wings Corporate',
      email: email.trim(),
      role,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsAccountModalOpen(false);
    }, 600);
  };

  const presetAccounts = [
    { name: 'Wings Corporate', email: 'wingscorporate1504@gmail.com', role: 'Merchant Admin' },
    { name: 'Wings Operations Desk', email: 'ops.wings@gmail.com', role: 'Operations Lead' },
    { name: 'Wings Finance & Billing', email: 'finance@wingscorporate.in', role: 'Billing Manager' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#00182B] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-[14px]">Edit Account Profile & Switch User</h3>
          </div>
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {success ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#299E00] mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-slate-900">Account Profile Updated!</h4>
              <p className="text-slate-500">
                Active account set to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Account Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wings Corporate"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#299E00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Account Email Address (Displayed on Home Header)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. wingscorporate1504@gmail.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#299E00] font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  This email is shown in the top navigation bar to indicate your active workspace.
                </p>
                {errorMsg && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errorMsg}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">User Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs"
                >
                  <option value="Merchant Admin">Merchant Admin (Full Access)</option>
                  <option value="Operations Lead">Operations Lead (Shipment & Dispatch)</option>
                  <option value="Billing Manager">Billing Manager (Wallet & Financials)</option>
                </select>
              </div>

              {/* Quick Switcher Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium block mb-1.5 text-[11px]">
                  Quick Switch Accounts
                </span>
                <div className="space-y-1.5">
                  {presetAccounts.map((acc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setName(acc.name);
                        setEmail(acc.email);
                        setRole(acc.role);
                      }}
                      className="w-full p-2 rounded border border-slate-200 hover:border-[#299E00] hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block">{acc.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{acc.email}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white font-semibold rounded transition cursor-pointer"
                >
                  Save & Apply Account
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
