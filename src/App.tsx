import React, { useState } from 'react';
import { ShippingProvider, useShipping } from './context/ShippingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ShipmentsPage } from './components/ShipmentsPage';
import { ShipParcelPage } from './components/ShipParcelPage';
import { OrdersPage } from './components/OrdersPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { PackagingPage } from './components/PackagingPage';
import { ProductMasterPage } from './components/ProductMasterPage';
import { PaymentsPage } from './components/PaymentsPage';
import { DiscrepanciesPage } from './components/DiscrepanciesPage';
import { ReportPage } from './components/ReportPage';
import { SupportPage } from './components/SupportPage';
import { SettingsPage } from './components/SettingsPage';
import { RechargeModal } from './components/modals/RechargeModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ShippingLabelModal } from './components/modals/ShippingLabelModal';
import { TrackingDrawer } from './components/modals/TrackingDrawer';
import { TaxInvoiceModal } from './components/modals/TaxInvoiceModal';
import { AccountProfileModal } from './components/modals/AccountProfileModal';
import { QuickSupportWidget } from './components/modals/QuickSupportWidget';

const DashboardContent: React.FC = () => {
  const { activeNav } = useShipping();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeNav) {
      case 'Shipments':
        return <ShipmentsPage />;
      case 'Ship Parcel':
        return <ShipParcelPage />;
      case 'Orders':
        return <OrdersPage />;
      case 'Analytics':
        return <AnalyticsPage />;
      case 'Packaging':
        return <PackagingPage />;
      case 'Product Master':
        return <ProductMasterPage />;
      case 'Payments':
        return <PaymentsPage />;
      case 'Discrepancies':
        return <DiscrepanciesPage />;
      case 'Report':
        return <ReportPage />;
      case 'Support':
        return <SupportPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <ShipmentsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-slate-800 flex flex-col font-sans select-text">
      {/* 1. Header (fixed navy bar #00182B, h-56px) */}
      <Header />

      {/* 2. Left Sidebar (fixed 160px vertical menu) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 3. Main Content Viewport */}
      <main
        className={`pt-[56px] transition-all duration-200 min-h-screen flex-1 flex flex-col ${
          isSidebarCollapsed ? 'lg:ml-[56px]' : 'lg:ml-[160px]'
        }`}
      >
        <div className="p-3 sm:p-4 flex-1">
          {/* Active Navigation Page View */}
          {renderActivePage()}
        </div>
      </main>

      {/* 4. Global Modals and Overlay Tools */}
      <RechargeModal />
      <OnboardingModal />
      <ShippingLabelModal />
      <TrackingDrawer />
      <TaxInvoiceModal />
      <AccountProfileModal />

      {/* 5. Floating Green Action Chat Support Widget */}
      <QuickSupportWidget />
    </div>
  );
};

export default function App() {
  return (
    <ShippingProvider>
      <DashboardContent />
    </ShippingProvider>
  );
}
