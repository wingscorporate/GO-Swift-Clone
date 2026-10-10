import React, { useState } from 'react';
import {
  Store,
  Plus,
  Download,
  Upload,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  X,
  RefreshCw,
} from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { Order, PaymentMode } from '../types/shipping';

export const OrdersPage: React.FC = () => {
  const { orders, createOrder, convertOrderToShipment, setOrders } = useShipping();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Order Form state
  const [orderNumber, setOrderNumber] = useState(`#${Math.floor(98220 + Math.random() * 800)}`);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Prepaid');
  const [totalAmount, setTotalAmount] = useState(1499);
  const [itemName, setItemName] = useState('AcousticPro ANC Wireless Headphones');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesNum = o.orderNumber.toLowerCase().includes(q);
      const matchesName = o.customerName.toLowerCase().includes(q);
      const matchesPhone = o.customerPhone.includes(q);
      if (!matchesNum && !matchesName && !matchesPhone) return false;
    }
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      state,
      pincode,
      paymentMode,
      totalAmount,
      status: 'Ready to Ship',
      channel: 'Manual',
      items: [{ sku: 'SKU-CUSTOM', name: itemName, quantity: 1, price: totalAmount }],
    });
    setIsAddModalOpen(false);
  };

  const handleSyncShopify = () => {
    const newShopifyOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `#SP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Kavita Menon',
      customerPhone: '+91 98450 77112',
      customerEmail: 'kavita.m@gmail.com',
      shippingAddress: '402 Richmond Court, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      paymentMode: 'COD',
      totalAmount: 1899,
      status: 'Ready to Ship',
      channel: 'Shopify',
      createdAt: 'Just now',
      items: [{ sku: 'SKIN-SERUM-VITC', name: 'Pure Glow 15% Vitamin C Face Serum (30ml)', quantity: 2, price: 699 }],
    };
    setOrders((prev) => [newShopifyOrder, ...prev]);
    alert('Synced 1 new confirmed order from connected Shopify Store.');
  };

  const exportCSV = () => {
    const headers = 'Order Number,Customer Name,Phone,Address,City,Pincode,Payment Mode,Amount,Status,Channel\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.shippingAddress}","${o.city}","${o.pincode}","${o.paymentMode}",${o.totalAmount},"${o.status}","${o.channel}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orders_Export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#299E00]" />
              <span>Orders Management</span>
            </h2>
            <span className="bg-[#EBF7EA] text-[#299E00] font-semibold text-[11px] px-2 py-0.5 rounded border border-[#BCE4B5]">
              Daily Intake: 7,000 – 10,000 Orders @ ₹69
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fulfill multi-channel store orders at Wings Corporate's negotiated flat rate of <strong className="text-slate-800">₹69.00 / shipment</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncShopify}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Shopify</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Ready to Ship', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[3px] font-medium transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#EBF7EA] text-[#299E00] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-64 pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#299E00]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[6px] border border-slate-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer Details</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{order.orderNumber}</div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {order.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {order.createdAt}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {order.city}, {order.pincode}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-medium truncate block max-w-[180px]">
                        {order.items[0]?.name || 'Standard Parcel'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Qty: {order.items[0]?.quantity || 1}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          order.paymentMode === 'Prepaid'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : order.status === 'Ready to Ship'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {order.status !== 'Shipped' ? (
                        <button
                          onClick={() => convertOrderToShipment(order.id)}
                          className="px-3 py-1 bg-[#299E00] hover:bg-[#238700] text-white rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Ship Now</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Dispatched</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#00182B] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-xs">Create Manual Order</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Customer Phone *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Prepaid">Prepaid</option>
                    <option value="COD">COD (Cash on Delivery)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white font-medium rounded"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
