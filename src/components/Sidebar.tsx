import React, { useState } from 'react';
import {
  BarChart2,
  LayoutGrid,
  PackagePlus,
  Box,
  Store,
  Layers,
  CreditCard,
  Scale,
  FileText,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useShipping, NavItem } from '../context/ShippingContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { activeNav, setActiveNav } = useShipping();
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  const navItems: { label: NavItem; icon: React.ReactNode; hasSubmenu?: boolean }[] = [
    { label: 'Analytics', icon: <BarChart2 className="w-4 h-4 shrink-0" /> },
    { label: 'Shipments', icon: <LayoutGrid className="w-4 h-4 shrink-0" /> },
    { label: 'Ship Parcel', icon: <PackagePlus className="w-4 h-4 shrink-0" /> },
    { label: 'Packaging', icon: <Box className="w-4 h-4 shrink-0" /> },
    { label: 'Orders', icon: <Store className="w-4 h-4 shrink-0" /> },
    { label: 'Product Master', icon: <Layers className="w-4 h-4 shrink-0" /> },
    { label: 'Payments', icon: <CreditCard className="w-4 h-4 shrink-0" />, hasSubmenu: true },
    { label: 'Discrepancies', icon: <Scale className="w-4 h-4 shrink-0" /> },
    { label: 'Report', icon: <FileText className="w-4 h-4 shrink-0" /> },
    { label: 'Support', icon: <HelpCircle className="w-4 h-4 shrink-0" /> },
    { label: 'Settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  const handleNavClick = (label: NavItem) => {
    setActiveNav(label);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-[56px] bottom-0 left-0 bg-white border-r border-slate-200 z-30 flex flex-col justify-between transition-all duration-200 ${
          isCollapsed ? 'w-[56px]' : 'w-[160px]'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation List */}
        <div className="py-2 overflow-y-auto flex-1">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => handleNavClick(item.label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#EBF7EA] text-[#299E00] font-semibold border-r-[3px] border-[#299E00]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={isActive ? 'text-[#299E00]' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="truncate flex-1 tracking-tight text-[12px]">
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.hasSubmenu && (
                      <ChevronDown
                        className={`w-3 h-3 text-slate-400 transition-transform ${
                          paymentsOpen ? 'rotate-180' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentsOpen(!paymentsOpen);
                        }}
                      />
                    )}
                  </button>

                  {/* Payments Submenu if expanded */}
                  {!isCollapsed && item.hasSubmenu && paymentsOpen && (
                    <div className="bg-slate-50/80 py-1 pl-8 text-[11px] text-slate-600 space-y-1">
                      <div
                        onClick={() => handleNavClick('Payments')}
                        className="py-1 cursor-pointer hover:text-[#299E00]"
                      >
                        Wallet & Passbook
                      </div>
                      <div
                        onClick={() => handleNavClick('Payments')}
                        className="py-1 cursor-pointer hover:text-[#299E00]"
                      >
                        COD Remittance
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Collapse Toggle */}
        <div className="p-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition cursor-pointer w-full flex items-center justify-center gap-1.5"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] text-slate-500 font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
