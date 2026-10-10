import React, { useState } from 'react';
import { Box, Plus, Info, Check, Trash2 } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { PackagingProfile } from '../types/shipping';

export const PackagingPage: React.FC = () => {
  const { packagingProfiles } = useShipping();
  const [profiles, setProfiles] = useState<PackagingProfile[]>(packagingProfiles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [boxType, setBoxType] = useState('Corrugated Box');
  const [length, setLength] = useState(25);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(10);
  const [tareWeight, setTareWeight] = useState(0.1);
  const [cost, setCost] = useState(12);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: PackagingProfile = {
      id: `PKG-${Date.now()}`,
      name,
      boxType,
      length,
      width,
      height,
      tareWeight,
      cost,
    };
    setProfiles([...profiles, newP]);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Box className="w-5 h-5 text-[#299E00]" />
            <span>Packaging Box Profiles</span>
          </h2>
          <p className="text-xs text-slate-500">
            Define standardized box sizes and tare weights. The system automatically computes volumetric weight using courier divisor 5000.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Box Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((pkg) => {
          const volWeight = Math.round(((pkg.length * pkg.width * pkg.height) / 5000) * 100) / 100;
          return (
            <div
              key={pkg.id}
              className="bg-white p-4 rounded-[6px] border border-slate-200/90 space-y-3 text-xs"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{pkg.name}</h3>
                  <span className="text-[11px] text-slate-500">{pkg.boxType}</span>
                </div>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                  ₹{pkg.cost}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block">Dimensions</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {pkg.length} × {pkg.width} × {pkg.height} cm
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block">Vol. Divisor (5000)</span>
                  <span className="font-bold text-slate-800 font-mono">{volWeight} kg</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Tare Weight: {pkg.tareWeight} kg</span>
                <span className="text-emerald-600 font-medium">Standard SKU</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#00182B] text-white px-4 py-3 font-semibold">
              Add New Packaging Profile
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Profile Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shoe Box Medium"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Tare Wt (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Box Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white font-medium rounded"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
