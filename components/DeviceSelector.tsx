/**
 * DeviceSelector Component
 * Minimalist Redesign
 */

'use client';

import { useState, useMemo } from 'react';
import { DEVICE_MODELS, getAllBrands, getDevicesByBrand } from '@/lib/devices';
import { DeviceModel } from '@/lib/types';

interface DeviceSelectorProps {
  selectedModel: string;
  onSelect: (device: DeviceModel) => void;
}

export default function DeviceSelector({ selectedModel, onSelect }: DeviceSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const brands = useMemo(() => getAllBrands(), []);

  const handleDeviceSelect = (device: DeviceModel) => {
    onSelect(device);
    setSelectedBrand('');
  };

  const handleCustomDevice = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (!width || !height) return;

    onSelect({
      brand: 'Custom',
      model: `Custom (${width}×${height})`,
      width,
      height,
    });
    setSelectedBrand('');
  };

  if (selectedModel) {
    return (
      <div className="group relative">
        <label className="text-xs uppercase tracking-widest text-neutral-500 mb-1 block">Device</label>
        <div className="flex items-center justify-between py-2 border-b border-white/20 group-hover:border-white/40 transition-colors">
          <span className="text-white font-light">{selectedModel}</span>
          <button
            onClick={() => onSelect({} as DeviceModel)} // Clear selection
            className="text-xs text-neutral-500 hover:text-white uppercase tracking-wider"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  if (selectedBrand === 'Custom') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-widest text-neutral-500">Custom Resolution</label>
          <button onClick={() => setSelectedBrand('')} className="text-xs text-neutral-500 hover:text-white">Back</button>
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Width"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="input-minimal text-white placeholder:text-neutral-700"
          />
          <input
            type="number"
            placeholder="Height"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            className="input-minimal text-white placeholder:text-neutral-700"
          />
        </div>
        <button
          onClick={handleCustomDevice}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest transition-colors"
        >
          Set Dimensions
        </button>
      </div>
    );
  }

  if (selectedBrand) {
    const devices = getDevicesByBrand(selectedBrand);
    return (
      <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs uppercase tracking-widest text-neutral-500">{selectedBrand} Models</label>
          <button onClick={() => setSelectedBrand('')} className="text-xs text-neutral-500 hover:text-white">Back</button>
        </div>
        <div className="max-h-[200px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
          {devices.map((device) => (
            <button
              key={device.model}
              onClick={() => handleDeviceSelect(device)}
              className="w-full text-left py-2 px-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors rounded"
            >
              {device.model}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">Select Brand</label>
      <div className="grid grid-cols-2 gap-2">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className="py-3 px-4 text-left text-sm text-neutral-300 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all"
          >
            {brand}
          </button>
        ))}
        <button
          onClick={() => setSelectedBrand('Custom')}
          className="py-3 px-4 text-left text-sm text-neutral-500 border border-dashed border-neutral-800 hover:border-neutral-600 hover:text-neutral-300 transition-all"
        >
          Custom...
        </button>
      </div>
    </div>
  );
}
