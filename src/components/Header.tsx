import React, { useState } from 'react';
import { Wallet, Bell, Power, ChevronDown, Check, User, Shield, HelpCircle, Edit3 } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import swiftLogo from '../swift_logo.png';

export const Header: React.FC = () => {
  const {
    walletBalance,
    userAccount,
    setActiveNav,
    setIsAccountModalOpen,
    setIsRechargeModalOpen,
    setIsOnboardingModalOpen,
    setIsSupportWidgetOpen,
  } = useShipping();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="h-[56px] bg-[#00182B] text-white flex items-center justify-between px-3 md:px-4 fixed top-0 left-0 right-0 z-40 select-none shadow-sm">
      {/* Left: Brand Logo from src/swift_logo.png as an interactive button */}
      <button
        type="button"
        onClick={() => setActiveNav('Shipments')}
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition p-1 -ml-1 rounded focus:outline-none group"
        title="SWIFT Shipping - Return to Shipments Dashboard"
      >
        {!logoError ? (
          <img
            src={swiftLogo}
            alt="SWIFT"
            onError={() => setLogoError(true)}
            className="h-[44px] sm:h-[48px] max-w-[180px] sm:max-w-[220px] object-contain rounded-[3px] drop-shadow-sm group-hover:brightness-105 transition"
          />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-[32px] h-[32px] bg-[#299E00] rounded-[4px] flex items-center justify-center font-bold text-white text-sm tracking-tighter shadow">
              S
            </div>
            <span className="font-extrabold text-[18px] tracking-wider text-white uppercase font-sans">
              WIFT
            </span>
          </div>
        )}
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 text-xs">
        {/* Wallet Balance */}
        <button
          onClick={() => setIsRechargeModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#052238] hover:bg-[#082b47] border border-slate-700/80 rounded transition text-slate-100 font-medium cursor-pointer"
          title="Click to recharge wallet"
        >
          <Wallet className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-mono tabular-nums text-[12px]">
            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </button>

        {/* Recharge Button */}
        <button
          onClick={() => setIsRechargeModalOpen(true)}
          className="bg-[#299E00] hover:bg-[#238700] active:scale-95 text-white font-medium px-3 py-1 rounded-[4px] text-[12px] transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          Recharge
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 text-slate-300 hover:text-white transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-2 ring-[#00182B]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Notifications</span>
                <span className="text-[10px] text-[#299E00] font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <p className="font-medium text-slate-800 text-[11px]">Delhivery Surface Hub update</p>
                  <p className="text-[10px] text-slate-500">AWB DEL84920412891 reached Bengaluru Hub.</p>
                  <span className="text-[9px] text-slate-400">10m ago</span>
                </div>
                <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <p className="font-medium text-amber-700 text-[11px]">NDR Action Required</p>
                  <p className="text-[10px] text-slate-500">AWB SFX441092812 delivery attempt failed in Jaipur.</p>
                  <span className="text-[9px] text-slate-400">1h ago</span>
                </div>
                <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <p className="font-medium text-emerald-700 text-[11px]">COD Remittance Processed</p>
                  <p className="text-[10px] text-slate-500">₹3,240.00 credited to your registered bank account.</p>
                  <span className="text-[9px] text-slate-400">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account with Display & Switch Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white px-2 py-0.5 rounded cursor-pointer transition hover:bg-slate-800/60 border border-slate-700/50"
            title="Active Account - Click to view or switch profile"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#299E00]" />
            <span className="font-semibold text-[11px] text-slate-200 hidden sm:inline max-w-[120px] truncate">
              {userAccount.name}
            </span>
            <span className="font-normal text-[11px] text-slate-300 truncate max-w-[140px] md:max-w-none font-mono">
              ({userAccount.email})
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 text-xs">{userAccount.name}</p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{userAccount.email}</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                  {userAccount.role}
                </span>
              </div>

              {/* Edit / Switch Account Button */}
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setIsAccountModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-[#299E00] font-semibold flex items-center gap-2 cursor-pointer border-b border-slate-100"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Switch / Edit Account Name & Email</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setIsOnboardingModalOpen(true);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                KYC & Company Details
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setIsSupportWidgetOpen(true);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Help & Documentation
              </button>
            </div>
          )}
        </div>

        {/* Power / Logout Icon */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out of your session?')) {
              alert('Logged out securely.');
            }
          }}
          className="p-1 text-slate-300 hover:text-red-400 transition cursor-pointer"
          title="Logout"
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
