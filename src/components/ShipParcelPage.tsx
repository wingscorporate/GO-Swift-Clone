import React, { useState, useMemo } from 'react';
import {
  PackagePlus,
  Truck,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { CourierCode, PaymentMode } from '../types/shipping';

export const ShipParcelPage: React.FC = () => {
  const {
    warehouses,
    walletBalance,
    bookShipment,
    setSelectedLabelShipment,
    setIsRechargeModalOpen,
  } = useShipping();

  // Customer Form State
  const [customerName, setCustomerName] = useState('Rahul Nair');
  const [customerPhone, setCustomerPhone] = useState('+91 98451 90214');
  const [customerEmail, setCustomerEmail] = useState('rahul.nair@gmail.com');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 502, Prestige Palms, 80 Feet Road, Koramangala');
  const [landmark, setLandmark] = useState('Near Sony World Signal');
  const [pincode, setPincode] = useState('560034');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');

  // Package Form State
  const [sku, setSku] = useState('AUDIO-ANC-01');
  const [productName, setProductName] = useState('AcousticPro ANC Wireless Headphones');
  const [quantity, setQuantity] = useState(1);
  const [orderValue, setOrderValue] = useState(4499);
  const [weightKg, setWeightKg] = useState(0.45);
  const [lengthCm, setLengthCm] = useState(22);
  const [widthCm, setWidthCm] = useState(18);
  const [heightCm, setHeightCm] = useState(8);

  // Shipping & Payment
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Prepaid');
  const [codAmount, setCodAmount] = useState(4499);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || '');
  const [selectedCourierCode, setSelectedCourierCode] = useState<CourierCode>('delhivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Volumetric weight calculation: (L * W * H) / 5000
  const volumetricWeight = useMemo(() => {
    const vol = (lengthCm * widthCm * heightCm) / 5000;
    return Math.round(vol * 100) / 100;
  }, [lengthCm, widthCm, heightCm]);

  const chargeableWeight = useMemo(() => {
    return Math.max(weightKg, volumetricWeight);
  }, [weightKg, volumetricWeight]);

  // Courier Rates Comparison with Wings Corporate Enterprise Contracted Flat Rate of ₹69
  const courierOptions = useMemo(() => {
    return [
      {
        code: 'delhivery' as CourierCode,
        name: 'Delhivery Surface (Enterprise)',
        rate: 69,
        standardRate: Math.round(52 + chargeableWeight * 22),
        tat: '2-3 Days',
        rating: 4.8,
        type: 'Contracted Enterprise Flat Rate',
      },
      {
        code: 'bluedart' as CourierCode,
        name: 'Blue Dart Surface & Air (Enterprise)',
        rate: 69,
        standardRate: Math.round(95 + chargeableWeight * 30),
        tat: '1-2 Days',
        rating: 4.9,
        type: 'Contracted Enterprise Flat Rate',
      },
      {
        code: 'xpressbees' as CourierCode,
        name: 'Xpressbees Surface (Enterprise)',
        rate: 69,
        standardRate: Math.round(44 + chargeableWeight * 18),
        tat: '2-3 Days',
        rating: 4.6,
        type: 'Contracted Enterprise Flat Rate',
      },
      {
        code: 'shadowfax' as CourierCode,
        name: 'Shadowfax Express (Enterprise)',
        rate: 69,
        standardRate: Math.round(50 + chargeableWeight * 20),
        tat: '2-3 Days',
        rating: 4.7,
        type: 'Contracted Enterprise Flat Rate',
      },
    ];
  }, [chargeableWeight]);

  const selectedCourier = courierOptions.find((c) => c.code === selectedCourierCode) || courierOptions[0];

  const handlePincodeChange = (pin: string) => {
    setPincode(pin);
    if (pin === '560034' || pin === '560001') {
      setCity('Bengaluru');
      setState('Karnataka');
    } else if (pin === '400001' || pin === '400053') {
      setCity('Mumbai');
      setState('Maharashtra');
    } else if (pin === '110001') {
      setCity('New Delhi');
      setState('Delhi');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (walletBalance < selectedCourier.rate) {
      if (confirm(`Insufficient balance (₹${walletBalance.toFixed(2)}). Need ₹${selectedCourier.rate.toFixed(2)} for freight. Recharge wallet now?`)) {
        setIsRechargeModalOpen(true);
      }
      return;
    }

    setIsSubmitting(true);
    const chosenWarehouse = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

    setTimeout(() => {
      const created = bookShipment({
        type: 'forward',
        orderId: `ORD-${Math.floor(98000 + Math.random() * 1999)}`,
        courier: {
          code: selectedCourier.code,
          name: selectedCourier.name,
        },
        status: 'Ready For Pickup',
        paymentMode,
        amount: paymentMode === 'COD' ? codAmount : orderValue,
        shippingCharges: selectedCourier.rate,
        weight: weightKg,
        dimensions: { length: lengthCm, width: widthCm, height: heightCm },
        volumetricWeight,
        chargeableWeight,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: deliveryAddress,
          landmark,
          city,
          state,
          pincode,
        },
        pickupWarehouse: chosenWarehouse,
        items: [
          { sku, name: productName, quantity, price: orderValue },
        ],
      });

      setIsSubmitting(false);
      setSelectedLabelShipment(created);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-[#299E00]" />
              <span>Create New Shipment</span>
            </h2>
            <span className="bg-[#EBF7EA] text-[#299E00] font-semibold text-[11px] px-2 py-0.5 rounded border border-[#BCE4B5]">
              Enterprise Tier: 7,000 – 10,000 orders/day
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Wings Corporate contracted flat rate: <strong className="text-slate-800">₹69.00 / shipment</strong> across Delhivery, Blue Dart, Xpressbees, and Shadowfax.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Available Shipping Balance</span>
          <span className="font-mono text-sm font-bold text-slate-900">
            ₹{walletBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Form Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Customer & Package Info */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section 1: Customer & Destination */}
          <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3 text-xs">
            <h3 className="font-semibold text-slate-800 text-[13px] border-b border-slate-100 pb-2">
              1. Customer Delivery Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#299E00]"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#299E00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Delivery Address *</label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House / Flat No., Apartment, Street name"
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#299E00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Destination Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono focus:outline-none focus:border-[#299E00]"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Package & Dimensions */}
          <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3 text-xs">
            <h3 className="font-semibold text-slate-800 text-[13px] border-b border-slate-100 pb-2">
              2. Package Dimensions & Weight
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Product Description / Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-slate-600 mb-1">Dead Wt (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Width (cm)</label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-center"
                />
              </div>
            </div>

            {/* Calculated Weight Box */}
            <div className="bg-[#FAFBFB] p-2.5 rounded border border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-500">Volumetric Weight: </span>
                <span className="font-mono font-semibold text-slate-800">{volumetricWeight} kg</span>
              </div>
              <div>
                <span className="text-slate-500">Applicable Chargeable Weight: </span>
                <span className="font-mono font-bold text-[#299E00]">{chargeableWeight} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Warehouse, Payment Mode, Courier Selection */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pickup Warehouse */}
          <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-2.5 text-xs">
            <h3 className="font-semibold text-slate-800 text-[13px] border-b border-slate-100 pb-2">
              3. Pickup Hub & Payment Mode
            </h3>
            <div>
              <label className="block text-slate-600 mb-1">Pickup Warehouse</label>
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-xs"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city} - {w.pincode})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-slate-600 mb-1">Customer Payment Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('Prepaid')}
                  className={`py-1.5 rounded border text-center font-semibold transition cursor-pointer ${
                    paymentMode === 'Prepaid'
                      ? 'border-[#299E00] bg-[#EBF7EA] text-[#299E00]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Prepaid
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('COD')}
                  className={`py-1.5 rounded border text-center font-semibold transition cursor-pointer ${
                    paymentMode === 'COD'
                      ? 'border-[#299E00] bg-[#EBF7EA] text-[#299E00]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Cash on Delivery (COD)
                </button>
              </div>
            </div>

            {paymentMode === 'COD' && (
              <div>
                <label className="block text-slate-600 mb-1">COD Collection Amount (₹)</label>
                <input
                  type="number"
                  value={codAmount}
                  onChange={(e) => setCodAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:outline-none focus:border-[#299E00]"
                />
              </div>
            )}
          </div>

          {/* Courier Rates Card Comparison */}
          <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-2.5 text-xs">
            <h3 className="font-semibold text-slate-800 text-[13px] border-b border-slate-100 pb-2">
              4. Compare & Select Courier Partner
            </h3>

            <div className="space-y-2">
              {courierOptions.map((courier) => {
                const isSelected = selectedCourierCode === courier.code;
                return (
                  <div
                    key={courier.code}
                    onClick={() => setSelectedCourierCode(courier.code)}
                    className={`p-3 rounded border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#299E00] bg-[#EBF7EA]/50 ring-1 ring-[#299E00]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{courier.name}</span>
                        <span className="text-[10px] text-slate-500">({courier.type})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Est. Delivery: <span className="font-medium text-slate-700">{courier.tat}</span> · Rating: ★ {courier.rating}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        ₹{courier.rate}
                      </span>
                      <span className="text-[10px] text-slate-400 block">+ GST</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#299E00] hover:bg-[#238700] text-white font-semibold rounded text-xs transition cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
            >
              {isSubmitting ? (
                'Transmitting AWB to Courier...'
              ) : (
                <>
                  <span>Book with {selectedCourier.name} (₹{selectedCourier.rate})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
