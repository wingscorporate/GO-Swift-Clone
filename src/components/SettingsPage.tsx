import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  Key,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Building,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { Warehouse } from '../types/shipping';

export const SettingsPage: React.FC = () => {
  const { warehouses, addWarehouse, userAccount, setIsAccountModalOpen } = useShipping();
  const [activeTab, setActiveTab] = useState<'warehouses' | 'couriers' | 'rate-card' | 'company'>('rate-card');
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Warehouses modal
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [whName, setWhName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Courier Sandbox Toggles
  const [courierConfigs, setCourierConfigs] = useState([
    {
      code: 'delhivery',
      name: 'Delhivery Surface & Express',
      apiKey: 'del_live_892184918240918',
      sandbox: false,
      status: 'Connected & Active',
    },
    {
      code: 'bluedart',
      name: 'Blue Dart Aviation',
      apiKey: 'bd_prod_9941019283019',
      sandbox: false,
      status: 'Connected & Active',
    },
    {
      code: 'xpressbees',
      name: 'Xpressbees Logistics',
      apiKey: 'xb_live_token_772190',
      sandbox: false,
      status: 'Connected & Active',
    },
    {
      code: 'shadowfax',
      name: 'Shadowfax Technologies',
      apiKey: 'sfx_test_sandbox_0019',
      sandbox: true,
      status: 'Sandbox Mode Active',
    },
  ]);

  const handleToggleSandbox = (idx: number) => {
    setCourierConfigs((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, sandbox: !c.sandbox } : c))
    );
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    addWarehouse({
      name: whName,
      contactPerson,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: false,
    });
    setIsWarehouseModalOpen(false);
    setWhName('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#299E00]" />
            <span>Platform & Courier Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure pickup warehouse hubs, multi-courier API credentials, and business KYC attributes.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded text-xs">
          {[
            { id: 'rate-card', label: 'Enterprise Rate Card (₹69)' },
            { id: 'warehouses', label: 'Pickup Hubs' },
            { id: 'couriers', label: 'Courier Partner APIs' },
            { id: 'company', label: 'Company KYC' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Enterprise Rate Card */}
      {activeTab === 'rate-card' && (
        <div className="bg-white rounded-[6px] border border-slate-200/90 p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Wings Corporate Negotiated Enterprise Rate Card</h3>
                <span className="bg-[#EBF7EA] text-[#299E00] font-bold px-2 py-0.5 rounded text-[11px] border border-[#BCE4B5]">
                  Active Contract: ₹69.00 Flat Rate
                </span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Eligible Volume Tier: <strong className="text-slate-800">7,000 to 10,000 orders dispatched daily</strong> across all connected courier networks.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">SLA Commitment</span>
              <span className="font-bold text-slate-800 text-xs">Pan-India 2–3 Days TAT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { courier: 'Delhivery Surface', baseRate: '₹69.00', deadWeight: 'Up to 0.5 kg', codFee: 'Nil (0%)', fuelSurcharge: 'Included' },
              { courier: 'Blue Dart Surface & Air', baseRate: '₹69.00', deadWeight: 'Up to 0.5 kg', codFee: 'Nil (0%)', fuelSurcharge: 'Included' },
              { courier: 'Xpressbees Logistics', baseRate: '₹69.00', deadWeight: 'Up to 0.5 kg', codFee: 'Nil (0%)', fuelSurcharge: 'Included' },
              { courier: 'Shadowfax Express', baseRate: '₹69.00', deadWeight: 'Up to 0.5 kg', codFee: 'Nil (0%)', fuelSurcharge: 'Included' },
            ].map((rc, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-[13px] border-b border-slate-200 pb-1.5 flex justify-between items-center">
                  <span>{rc.courier}</span>
                  <span className="text-[#299E00] font-mono text-sm">{rc.baseRate}</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Weight Slab:</span>
                    <span className="font-semibold text-slate-800">{rc.deadWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COD Collection Charge:</span>
                    <span className="font-semibold text-emerald-700">{rc.codFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel & Handling:</span>
                    <span className="font-semibold text-slate-800">{rc.fuelSurcharge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#EBF7EA] p-3 rounded border border-[#BCE4B5] text-[11px] text-slate-700 space-y-1">
            <span className="font-bold text-[#1F5413] block">Contract Terms & High-Volume SLA:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Flat rate applies automatically when daily dispatch average is maintained between 7,000 and 10,000 orders.</li>
              <li>Dedicated linehaul trucks dispatched daily at 2:00 PM and 6:00 PM from Bhiwandi, Whitefield, and Gurugram hubs.</li>
              <li>Zero weight penalty disputes on standard flyers under 500 grams.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xs text-slate-800">
              Registered Warehouses ({warehouses.length})
            </span>
            <button
              onClick={() => setIsWarehouseModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Warehouse</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {warehouses.map((w) => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                  <div className="font-bold text-slate-900 text-[13px]">{w.name}</div>
                  {w.isDefault && (
                    <span className="bg-emerald-50 text-[#299E00] text-[10px] font-semibold px-2 py-0.5 rounded">
                      Default Hub
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-slate-600 text-[11px]">
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{w.address}, {w.city}, {w.state} - {w.pincode}</span>
                  </p>
                  <p className="text-slate-500">Contact: {w.contactPerson} ({w.phone})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Courier APIs */}
      {activeTab === 'couriers' && (
        <div className="bg-white rounded-[6px] border border-slate-200/90 p-4 space-y-4 text-xs">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Direct Courier Partner Credentials</h3>
            <p className="text-slate-500">
              Switch between Swift Aggregated Pre-negotiated Rates or your own custom Courier API tokens.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {courierConfigs.map((c, i) => (
              <div key={c.code} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span>{c.name}</span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        c.sandbox ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    API Key: {c.apiKey.slice(0, 8)}****************
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleSandbox(i)}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Sandbox:</span>
                    <span className="font-bold">{c.sandbox ? 'ON' : 'OFF'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPingStatus(`Credentials verified for ${c.name}. Connectivity healthy (22ms).`);
                      setTimeout(() => setPingStatus(null), 3000);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pingStatus && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#299E00]" />
              <span>{pingStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab: Company KYC & Active Account */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-[6px] border border-slate-200/90 p-5 space-y-4 text-xs">
          {/* Active Account Profile Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Active Account & Workspace</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{userAccount.name}</span>
                <span className="text-[10px] bg-[#EBF7EA] text-[#299E00] px-1.5 py-0.5 rounded font-semibold border border-[#BCE4B5]">
                  {userAccount.role}
                </span>
              </div>
              <p className="font-mono text-slate-600 text-xs mt-0.5">{userAccount.email}</p>
            </div>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded font-medium text-xs transition cursor-pointer self-start sm:self-auto"
            >
              Edit / Switch Account
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3 pt-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Business Identity & KYC</h3>
              <p className="text-slate-500">Verified e-way bill generation & COD legal entity.</p>
            </div>
            <span className="bg-emerald-50 text-[#299E00] font-semibold px-2.5 py-1 rounded text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KYC Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block mb-0.5">Legal Entity Name</span>
              <span className="font-semibold text-slate-900">Swift Ventures Private Limited</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">GSTIN</span>
              <span className="font-mono font-semibold text-slate-900">27AADCS1248M1ZR</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">PAN Card</span>
              <span className="font-mono font-semibold text-slate-900">AADCS1248M</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Registered Bank Account</span>
              <span className="font-mono font-semibold text-slate-900">HDFC Bank (A/C: **1924)</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#00182B] text-white px-4 py-3 font-semibold">
              Add Pickup Warehouse
            </div>
            <form onSubmit={handleAddWarehouse} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
                  placeholder="e.g. Pune Regional Depot"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWarehouseModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white font-medium rounded"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
