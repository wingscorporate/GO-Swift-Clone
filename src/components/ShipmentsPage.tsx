import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  RotateCw,
  Settings,
  SlidersHorizontal,
  FileText,
  Printer,
  Truck,
  RotateCcw,
  AlertCircle,
  Eye,
  CheckSquare,
  Square,
  X,
  ExternalLink,
  User,
  Edit3,
} from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { Shipment, ShipmentStatus, ShipmentType } from '../types/shipping';

export const ShipmentsPage: React.FC = () => {
  const {
    shipments,
    setSelectedTrackingShipment,
    setSelectedLabelShipment,
    setSelectedInvoiceShipment,
    cancelShipment,
    resolveNDR,
    viewEmptyState,
    setViewEmptyState,
    userAccount,
    setIsAccountModalOpen,
  } = useShipping();

  // Primary Tab: Forward or Reverse
  const [activeTab, setActiveTab] = useState<ShipmentType>('forward');

  // Pagination State (working Next, Previous, Rows per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter State
  const [dateField, setDateField] = useState<'Manifested Date' | 'Pickup Date' | 'Delivered Date'>('Manifested Date');
  const [showDateFieldDropdown, setShowDateFieldDropdown] = useState(false);
  const [startDate, setStartDate] = useState<string>('08-Sep-2026');
  const [endDate, setEndDate] = useState<string>('08-Oct-2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [selectedCourierFilter, setSelectedCourierFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Column visibility settings
  const [visibleColumns, setVisibleColumns] = useState({
    lastUpdated: true,
    orderDetails: true,
    shipmentDetails: true,
    dropDetails: true,
    pickupDetails: true,
    status: true,
    actions: true,
  });

  // Calculate Forward & Reverse Counts
  const forwardShipments = useMemo(() => shipments.filter((s) => s.type === 'forward'), [shipments]);
  const reverseShipments = useMemo(() => shipments.filter((s) => s.type === 'reverse'), [shipments]);

  const currentTabShipments = useMemo(() => {
    if (viewEmptyState) return [];
    return activeTab === 'forward' ? forwardShipments : reverseShipments;
  }, [activeTab, forwardShipments, reverseShipments, viewEmptyState]);

  // Stat metrics calculated for Wings Corporate Enterprise Tier (7,000 – 10,000 daily orders @ ₹69/shipment)
  const stats = useMemo(() => {
    if (viewEmptyState) {
      return {
        all: 0,
        cancelled: 0,
        readyForPickup: 0,
        inTransit: 0,
        delivered: 0,
        rto: 0,
        actionRequired: 0,
        actionRequested: 0,
      };
    }
    if (activeTab === 'reverse') {
      return {
        all: 184,
        cancelled: 4,
        readyForPickup: 48,
        inTransit: 92,
        delivered: 34,
        rto: 6,
        actionRequired: 8,
        actionRequested: 4,
      };
    }
    // Forward daily throughput in the 7,000–10,000 orders daily band
    return {
      all: 8740,
      cancelled: 84,
      readyForPickup: 1420,
      inTransit: 4890,
      delivered: 2120,
      rto: 226,
      actionRequired: 145,
      actionRequested: 82,
    };
  }, [activeTab, viewEmptyState]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    if (viewEmptyState) return [];

    return currentTabShipments.filter((s) => {
      // Status filter
      if (activeStatusFilter !== 'All') {
        if (activeStatusFilter === 'Cancelled' && s.status !== 'Cancelled') return false;
        if (activeStatusFilter === 'Ready For Pickup' && !['Ready For Pickup', 'Pickup Scheduled', 'Manifested'].includes(s.status)) return false;
        if (activeStatusFilter === 'In Transit' && !['In Transit', 'Out For Delivery'].includes(s.status)) return false;
        if (activeStatusFilter === 'Delivered' && s.status !== 'Delivered') return false;
        if (activeStatusFilter === 'RTO' && !['RTO Initiated', 'RTO Delivered'].includes(s.status)) return false;
        if (activeStatusFilter === 'Action Required' && s.status !== 'NDR Action Required') return false;
        if (activeStatusFilter === 'Action Requested' && s.status !== 'NDR Action Requested') return false;
      }

      // Courier filter
      if (selectedCourierFilter !== 'All' && s.courier.code !== selectedCourierFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAwb = s.awb.toLowerCase().includes(q);
        const matchesSwiftId = s.id.toLowerCase().includes(q);
        const matchesOrder = s.orderId.toLowerCase().includes(q);
        const matchesPhone = s.customer.phone.toLowerCase().includes(q);
        const matchesCustomer = s.customer.name.toLowerCase().includes(q);
        if (!matchesAwb && !matchesSwiftId && !matchesOrder && !matchesPhone && !matchesCustomer) {
          return false;
        }
      }

      return true;
    });
  }, [currentTabShipments, activeStatusFilter, selectedCourierFilter, searchQuery, viewEmptyState]);

  // Reset page when filter or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchQuery,
    activeStatusFilter,
    selectedCourierFilter,
    startDate,
    endDate,
    dateField,
    viewEmptyState,
    pageSize,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Paginated records for table view
  const paginatedShipments = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredShipments.slice(startIndex, startIndex + pageSize);
  }, [filteredShipments, validCurrentPage, pageSize]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    const pageIds = paginatedShipments.map((s) => s.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedShipmentIds.includes(id));
    if (allSelected) {
      setSelectedShipmentIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedShipmentIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedShipmentIds.includes(id)) {
      setSelectedShipmentIds(selectedShipmentIds.filter((item) => item !== id));
    } else {
      setSelectedShipmentIds([...selectedShipmentIds, id]);
    }
  };

  const handleClearFilters = () => {
    setActiveStatusFilter('All');
    setSearchQuery('');
    setSelectedCourierFilter('All');
    setSelectedShipmentIds([]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const exportCSV = () => {
    if (filteredShipments.length === 0) {
      alert('No shipment records to export.');
      return;
    }
    const headers = 'Swift ID,AWB,Order ID,Courier,Status,Payment Mode,Amount,Customer Name,Phone,City,Pincode,Last Updated\n';
    const rows = filteredShipments
      .map(
        (s) =>
          `"${s.id}","${s.awb}","${s.orderId}","${s.courier.name}","${s.status}","${s.paymentMode}",${s.amount},"${s.customer.name}","${s.customer.phone}","${s.customer.city}","${s.customer.pincode}","${s.lastUpdated}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWIFT_Shipments_${activeTab}_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-3 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#F2F4F6] p-4 overflow-auto' : ''}`}>
      {/* Top Banner (Active Account display with change button & Enterprise tier) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 bg-white px-3.5 py-2.5 rounded-[4px] border border-slate-200 gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Active Account Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded">
            <User className="w-3.5 h-3.5 text-[#299E00]" />
            <span className="text-slate-500">Active Account:</span>
            <span className="font-semibold text-slate-900">{userAccount.name}</span>
            <span className="text-slate-400 font-mono text-[10px]">({userAccount.email})</span>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="ml-1 text-[#299E00] hover:text-[#238700] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer text-[10px]"
              title="Change Account Name or Email Address"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Change</span>
            </button>
          </div>

          <span className="bg-[#EBF7EA] text-[#299E00] font-bold px-2 py-0.5 rounded border border-[#BCE4B5]">
            Wings Corporate Enterprise Tier
          </span>
          <span className="font-semibold text-slate-800 hidden md:inline">
            7,000 – 10,000 Orders/Day @ ₹69.00
          </span>
          <span className="text-slate-300 hidden md:inline">·</span>
          <span className="text-slate-500 hidden lg:inline">
            Today Manifested: <strong className="text-slate-800 font-mono">8,740</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewEmptyState(false)}
            className={`px-2.5 py-1 rounded text-xs cursor-pointer transition ${
              !viewEmptyState ? 'bg-[#299E00] text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Live Enterprise View (8,740)
          </button>
          <button
            onClick={() => setViewEmptyState(true)}
            className={`px-2.5 py-1 rounded text-xs cursor-pointer transition ${
              viewEmptyState ? 'bg-[#299E00] text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Reference "No Data" View
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-[6px] shadow-xs border border-slate-200/90 p-3.5 sm:p-4">
        {/* Row 1: Shipment Tabs & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          {/* Tabs: Forward (N) and Reverse (N) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('forward');
                setSelectedShipmentIds([]);
              }}
              className={`relative pb-2 text-[15px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'forward'
                  ? 'text-[#299E00] font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Forward</span>
              <span className="tabular-nums">({viewEmptyState ? 0 : '8,740'})</span>
              {activeTab === 'forward' && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#299E00]" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('reverse');
                setSelectedShipmentIds([]);
              }}
              className={`relative pb-2 text-[15px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reverse'
                  ? 'text-[#299E00] font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Reverse</span>
              <span className="tabular-nums">({viewEmptyState ? 0 : '184'})</span>
              {activeTab === 'reverse' && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#299E00]" />
              )}
            </button>
          </div>

          {/* Right: Date filter, Date Range, Search bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Manifested Date Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDateFieldDropdown(!showDateFieldDropdown)}
                className="h-[32px] px-3 bg-white border border-slate-300 rounded-[3px] text-[12px] text-slate-700 flex items-center gap-1.5 hover:border-slate-400 transition cursor-pointer"
              >
                <span>{dateField}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              {showDateFieldDropdown && (
                <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded shadow-md z-30 py-1 text-xs">
                  {(['Manifested Date', 'Pickup Date', 'Delivered Date'] as const).map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setDateField(opt);
                        setShowDateFieldDropdown(false);
                      }}
                      className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-slate-700"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Box */}
            <div className="h-[32px] px-2.5 bg-white border border-slate-300 rounded-[3px] text-[12px] text-slate-700 flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-600">{startDate}</span>
              <span className="text-slate-400">→</span>
              <span className="font-mono text-[11px] text-slate-600">{endDate}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Search Input Box with Green Button */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Swift ID, Order ID, WBN, Phone"
                  className="h-[32px] w-[190px] sm:w-[220px] px-2.5 bg-white border border-slate-300 border-r-0 rounded-l-[3px] text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#299E00]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {}}
                className="h-[32px] px-3 bg-[#299E00] hover:bg-[#238700] text-white rounded-r-[3px] flex items-center justify-center transition cursor-pointer"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Grouped Metric Cards (Shipment Summary, Shipment Journey, NDR Exceptions) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 pb-3">
          {/* Group 1: Shipment Summary (All, Cancelled) */}
          <div className="md:col-span-3">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              Shipment Summary
            </span>
            <div className="grid grid-cols-2 border border-slate-200 rounded-[4px] overflow-hidden bg-white text-center">
              <button
                onClick={() => setActiveStatusFilter('All')}
                className={`py-2 px-1 transition cursor-pointer border-r border-slate-200 ${
                  activeStatusFilter === 'All'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium">All</div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.all}
                </div>
              </button>
              <button
                onClick={() => setActiveStatusFilter('Cancelled')}
                className={`py-2 px-1 transition cursor-pointer ${
                  activeStatusFilter === 'Cancelled'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium">Cancelled</div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.cancelled}
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: Shipment Journey (Ready For Pickup, In Transit, Delivered, RTO) */}
          <div className="md:col-span-5">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              Shipment Journey
            </span>
            <div className="grid grid-cols-4 border border-slate-200 rounded-[4px] overflow-hidden bg-white text-center">
              <button
                onClick={() => setActiveStatusFilter('Ready For Pickup')}
                className={`py-2 px-1 transition cursor-pointer border-r border-slate-200 ${
                  activeStatusFilter === 'Ready For Pickup'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="Ready For Pickup">
                  Ready For Pickup
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.readyForPickup}
                </div>
              </button>
              <button
                onClick={() => setActiveStatusFilter('In Transit')}
                className={`py-2 px-1 transition cursor-pointer border-r border-slate-200 ${
                  activeStatusFilter === 'In Transit'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="In Transit">
                  In Transit
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.inTransit}
                </div>
              </button>
              <button
                onClick={() => setActiveStatusFilter('Delivered')}
                className={`py-2 px-1 transition cursor-pointer border-r border-slate-200 ${
                  activeStatusFilter === 'Delivered'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="Delivered">
                  Delivered
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.delivered}
                </div>
              </button>
              <button
                onClick={() => setActiveStatusFilter('RTO')}
                className={`py-2 px-1 transition cursor-pointer ${
                  activeStatusFilter === 'RTO'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="RTO">
                  RTO
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.rto}
                </div>
              </button>
            </div>
          </div>

          {/* Group 3: NDR Exceptions (Action Required, Action Requested) */}
          <div className="md:col-span-4">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              NDR Exceptions
            </span>
            <div className="grid grid-cols-2 border border-slate-200 rounded-[4px] overflow-hidden bg-white text-center">
              <button
                onClick={() => setActiveStatusFilter('Action Required')}
                className={`py-2 px-1 transition cursor-pointer border-r border-slate-200 ${
                  activeStatusFilter === 'Action Required'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="Action Required">
                  Action Required
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.actionRequired}
                </div>
              </button>
              <button
                onClick={() => setActiveStatusFilter('Action Requested')}
                className={`py-2 px-1 transition cursor-pointer ${
                  activeStatusFilter === 'Action Requested'
                    ? 'bg-[#EBF7EA] border-b-2 border-b-[#299E00]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] text-slate-600 font-medium truncate" title="Action Requested">
                  Action Requested
                </div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums">
                  {stats.actionRequested}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Table Header & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 pb-2.5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-slate-900 tracking-tight">
              All Shipments
            </h2>
            {activeStatusFilter !== 'All' && (
              <span className="text-[11px] text-[#299E00] font-medium bg-[#EBF7EA] px-2 py-0.5 rounded">
                Filtered: {activeStatusFilter}
              </span>
            )}
            {selectedShipmentIds.length > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                ({selectedShipmentIds.length} selected)
              </span>
            )}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Bulk Action Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBulkActionOpen(!bulkActionOpen)}
                className="h-[30px] px-3 bg-white border border-slate-300 rounded-[3px] text-[12px] text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>Bulk Action</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              {bulkActionOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded shadow-lg z-30 py-1 text-xs">
                  <button
                    onClick={() => {
                      setBulkActionOpen(false);
                      if (selectedShipmentIds.length === 0) {
                        alert('Please select shipments using checkboxes first.');
                        return;
                      }
                      alert(`Printing batch labels for ${selectedShipmentIds.length} shipments.`);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                  >
                    Download Labels
                  </button>
                  <button
                    onClick={() => {
                      setBulkActionOpen(false);
                      if (selectedShipmentIds.length === 0) {
                        alert('Please select shipments first.');
                        return;
                      }
                      alert(`Manifest generated for ${selectedShipmentIds.length} shipments.`);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                  >
                    Generate Manifest
                  </button>
                  <button
                    onClick={() => {
                      setBulkActionOpen(false);
                      if (selectedShipmentIds.length === 0) {
                        alert('Please select shipments first.');
                        return;
                      }
                      selectedShipmentIds.forEach((id) => cancelShipment(id));
                      setSelectedShipmentIds([]);
                      alert('Selected shipments cancelled.');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                  >
                    Cancel Selected
                  </button>
                </div>
              )}
            </div>

            {/* Maximize Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-[30px] w-[30px] bg-white border border-slate-300 rounded-[3px] flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Download Export CSV */}
            <button
              onClick={exportCSV}
              className="h-[30px] w-[30px] bg-white border border-slate-300 rounded-[3px] flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`h-[30px] w-[30px] bg-white border border-slate-300 rounded-[3px] flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer ${
                isRefreshing ? 'animate-spin text-[#299E00]' : ''
              }`}
              title="Refresh Shipments"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Column Settings Button */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="h-[30px] w-[30px] bg-white border border-slate-300 rounded-[3px] flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                title="Table Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              {showColumnSettings && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-xl z-30 p-2 text-xs">
                  <div className="font-semibold text-slate-800 pb-1 border-b border-slate-100 mb-2">
                    Show/Hide Columns
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(visibleColumns).map(([key, val]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) =>
                            setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })
                          }
                          className="rounded text-[#299E00] focus:ring-[#299E00]"
                        />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="h-[30px] px-3 bg-white border border-slate-300 hover:border-slate-400 rounded-[3px] text-[12px] text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Row 4: Shipments Table */}
        <div className="border border-slate-200 rounded-[4px] overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse text-[12px]">
              {/* Table Header matching screenshot column names and icons */}
              <thead>
                <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200 select-none">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginatedShipments.length > 0 &&
                        paginatedShipments.every((s) => selectedShipmentIds.includes(s.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded text-[#299E00] focus:ring-[#299E00] cursor-pointer"
                    />
                  </th>

                  {visibleColumns.lastUpdated && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Last Updated</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.orderDetails && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Order Details</span>
                        <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.shipmentDetails && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Shipment Details</span>
                        <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                        <Calendar className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.dropDetails && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Drop Details</span>
                        <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.pickupDetails && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Pickup Details</span>
                        <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                        <Calendar className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.status && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Shipment Status</span>
                      </div>
                    </th>
                  )}

                  {visibleColumns.actions && (
                    <th className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-semibold text-right pr-4">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredShipments.length === 0 ? (
                  /* Empty State: Matching screenshot with open box icon and "No Data" */
                  <tr>
                    <td colSpan={8} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 select-none">
                        {/* Box outline icon matching screenshot */}
                        <div className="w-14 h-14 relative flex items-center justify-center text-slate-300">
                          <svg
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 stroke-slate-300 stroke-[1.5]"
                          >
                            {/* Open shipping box drawing */}
                            <path d="M12 24L32 14L52 24L32 34L12 24Z" />
                            <path d="M12 24V46L32 56V34" />
                            <path d="M52 24V46L32 56" />
                            <path d="M22 19L42 29" strokeDasharray="2 2" />
                            <path d="M24 38L32 42L40 38" />
                          </svg>
                        </div>
                        <span className="text-[13px] font-medium text-slate-400">
                          No Data
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* Populated State with authentic Indian courier records (paginated) */
                  paginatedShipments.map((s) => {
                    const isSelected = selectedShipmentIds.includes(s.id);
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-slate-100 hover:bg-slate-50/80 transition ${
                          isSelected ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(s.id)}
                            className="rounded text-[#299E00] focus:ring-[#299E00] cursor-pointer"
                          />
                        </td>

                        {/* Last Updated */}
                        {visibleColumns.lastUpdated && (
                          <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                            {s.lastUpdated}
                          </td>
                        )}

                        {/* Order Details */}
                        {visibleColumns.orderDetails && (
                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 text-[12px]">
                                  {s.orderId}
                                </span>
                                <span
                                  className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                    s.paymentMode === 'Prepaid'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {s.paymentMode}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                ₹{s.amount.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {s.items[0]?.name}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Shipment Details */}
                        {visibleColumns.shipmentDetails && (
                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-mono text-[#299E00] font-semibold hover:underline cursor-pointer" onClick={() => setSelectedTrackingShipment(s)}>
                                  {s.awb}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-700 font-medium flex items-center gap-1">
                                <span>{s.courier.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                                <span>Wt: {s.weight}kg</span>
                                <span>·</span>
                                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 rounded">Freight: ₹69.00</span>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Drop Details (Customer) */}
                        {visibleColumns.dropDetails && (
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 max-w-[200px]">
                              <div className="font-medium text-slate-900 text-[12px] truncate">
                                {s.customer.name}
                              </div>
                              <div className="text-[11px] text-slate-600 font-mono">
                                {s.customer.phone}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate" title={`${s.customer.city}, ${s.customer.state} - ${s.customer.pincode}`}>
                                {s.customer.city}, {s.customer.pincode}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Pickup Details (Warehouse) */}
                        {visibleColumns.pickupDetails && (
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 max-w-[180px]">
                              <div className="font-medium text-slate-800 text-[11px] truncate">
                                {s.pickupWarehouse.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {s.pickupWarehouse.city} ({s.pickupWarehouse.pincode})
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Shipment Status */}
                        {visibleColumns.status && (
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                                  s.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : s.status === 'In Transit' || s.status === 'Out For Delivery'
                                    ? 'bg-blue-100 text-blue-800'
                                    : s.status === 'Ready For Pickup' || s.status === 'Pickup Scheduled' || s.status === 'Manifested'
                                    ? 'bg-purple-100 text-purple-800'
                                    : s.status === 'Cancelled'
                                    ? 'bg-slate-100 text-slate-700'
                                    : s.status.includes('NDR')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {s.status}
                              </span>
                              {s.ndrReason && (
                                <p className="text-[10px] text-amber-700 leading-tight">
                                  {s.ndrReason}
                                </p>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Actions */}
                        {visibleColumns.actions && (
                          <td className="py-3 px-3 text-right pr-4">
                            <div className="flex items-center justify-end gap-1">
                              {/* Track Button */}
                              <button
                                onClick={() => setSelectedTrackingShipment(s)}
                                className="p-1 text-slate-600 hover:text-[#299E00] hover:bg-slate-100 rounded transition cursor-pointer"
                                title="Track Shipment Journey"
                              >
                                <Truck className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Thermal Label Button */}
                              <button
                                onClick={() => setSelectedLabelShipment(s)}
                                className="p-1 text-slate-600 hover:text-[#299E00] hover:bg-slate-100 rounded transition cursor-pointer"
                                title="Print 4x6 Shipping Label"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Download Tax Invoice */}
                              <button
                                onClick={() => setSelectedInvoiceShipment(s)}
                                className="p-1 text-slate-600 hover:text-[#299E00] hover:bg-slate-100 rounded transition cursor-pointer"
                                title="View/Download Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>

                              {/* NDR Action if applicable */}
                              {s.status === 'NDR Action Required' && (
                                <button
                                  onClick={() => {
                                    const action = prompt('Choose NDR instruction:\n1: Reattempt\n2: Update Address\n3: RTO', '1');
                                    if (action === '1') resolveNDR(s.id, 'reattempt');
                                    else if (action === '2') {
                                      const newAddr = prompt('Enter updated landmark / address notes:');
                                      if (newAddr) resolveNDR(s.id, 'address_update', newAddr);
                                    } else if (action === '3') resolveNDR(s.id, 'rto');
                                  }}
                                  className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-medium transition cursor-pointer"
                                  title="Resolve NDR Exception"
                                >
                                  NDR
                                </button>
                              )}

                              {/* Cancel Button if not delivered/cancelled */}
                              {!['Delivered', 'Cancelled', 'RTO Delivered'].includes(s.status) && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Cancel shipment ${s.id} (AWB: ${s.awb})? Freight charges will be refunded.`)) {
                                      cancelShipment(s.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition cursor-pointer"
                                  title="Cancel Shipment"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Fully Functional Pagination & Summary footer */}
          <div className="py-2.5 px-3 bg-[#FAFBFB] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                Showing{' '}
                <strong className="text-slate-900 font-mono">
                  {filteredShipments.length === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-900 font-mono">
                  {Math.min(filteredShipments.length, validCurrentPage * pageSize)}
                </strong>{' '}
                of <strong className="text-slate-900 font-mono">{filteredShipments.length}</strong> active records
                <span className="text-slate-300 mx-2">|</span>
                Daily Capacity:{' '}
                <strong className="text-slate-800 font-mono">{stats.all.toLocaleString('en-IN')}</strong> orders
                (@ ₹69.00/order)
              </div>
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                <span className="text-slate-500">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-700 font-mono cursor-pointer text-[11px]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Working Next and Previous Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-2.5 py-1 border rounded text-xs font-medium transition flex items-center gap-1 ${
                  validCurrentPage <= 1
                    ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-[#299E00]/10 hover:border-[#299E00] hover:text-[#299E00] cursor-pointer'
                }`}
                title="Go to previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                  return (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`w-6 h-6 rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                        validCurrentPage === pg
                          ? 'bg-[#299E00] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-2.5 py-1 border rounded text-xs font-medium transition flex items-center gap-1 ${
                  validCurrentPage >= totalPages
                    ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-[#299E00]/10 hover:border-[#299E00] hover:text-[#299E00] cursor-pointer'
                }`}
                title="Go to next page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
