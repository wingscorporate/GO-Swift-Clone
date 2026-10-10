import React, { useState } from 'react';
import { Layers, Plus, Upload, Search, Edit2 } from 'lucide-react';
import { useShipping } from '../context/ShippingContext';
import { ProductItem } from '../types/shipping';

export const ProductMasterPage: React.FC = () => {
  const { products, addProduct } = useShipping();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Consumer Electronics');
  const [sellingPrice, setSellingPrice] = useState(1499);
  const [weight, setWeight] = useState(0.4);
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(8);
  const [stock, setStock] = useState(100);

  const filtered = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      sku,
      name,
      category,
      sellingPrice,
      weight,
      length,
      width,
      height,
      stock,
    });
    setIsModalOpen(false);
    setSku('');
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-[6px] border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#299E00]" />
            <span>Product Master Catalog</span>
          </h2>
          <p className="text-xs text-slate-500">
            Store product weights and dimensions for auto-filling single-click shipment manifests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              alert('CSV Bulk Import Template downloaded.');
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#299E00] hover:bg-[#238700] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-slate-200/90 overflow-hidden">
        <div className="p-3 border-b border-slate-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or Product title..."
            className="w-72 px-3 py-1.5 border border-slate-300 rounded text-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFBFB] text-slate-700 font-medium border-b border-slate-200">
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Dimensions (L×W×H)</th>
                <th className="py-2.5 px-3">Selling Price</th>
                <th className="py-2.5 px-3">Stock Units</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.sku}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{p.name}</td>
                  <td className="py-3 px-3 text-slate-500">{p.category}</td>
                  <td className="py-3 px-3 font-mono">{p.weight} kg</td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {p.length} × {p.width} × {p.height} cm
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{p.sellingPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#00182B] text-white px-4 py-3 font-semibold">
              Add Product SKU
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. ELEC-POD-09"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">L (cm)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">W (cm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">H (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
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
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
