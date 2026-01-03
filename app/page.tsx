/**
 * Chronos - Main Page Component
 * Minimalist Redesign
 */

'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DeviceModel } from '@/lib/types';
import DeviceSelector from '@/components/DeviceSelector';
import BirthDateInput from '@/components/BirthDateInput';
import ViewModeToggle from '@/components/ViewModeToggle';
import SetupInstructions from '@/components/SetupInstructions';

const STORAGE_KEY = 'chronos-user-profile';
const THEME_COLOR = 'FFFFFF'; // White for minimalist dark theme

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'life'>('life');
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        setBirthDate(profile.birthDate);
        if (profile.viewMode) setViewMode(profile.viewMode);
        
        if (profile.device) {
          setSelectedDevice({
            brand: '', 
            model: profile.device.modelName,
            width: profile.device.width,
            height: profile.device.height,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  useEffect(() => {
    if (birthDate && selectedDevice) {
      const profile: UserProfile = {
        birthDate,
        themeColor: THEME_COLOR,
        device: {
          modelName: selectedDevice.model,
          width: selectedDevice.width,
          height: selectedDevice.height,
        },
        viewMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [birthDate, selectedDevice, viewMode]);

  const generateWallpaperUrl = () => {
    if (!selectedDevice) return;
    if (viewMode === 'life' && !birthDate) return;

    const params = new URLSearchParams({
      themeColor: THEME_COLOR,
      width: selectedDevice.width.toString(),
      height: selectedDevice.height.toString(),
      viewMode,
    });

    if (viewMode === 'life' && birthDate) {
      params.append('birthDate', birthDate);
    }

    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : '';
    
    const url = `${baseUrl}/api/wallpaper?${params.toString()}`;
    setWallpaperUrl(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy keys:', error);
    }
  };

  const isFormComplete = viewMode === 'year' ? selectedDevice !== null : (birthDate && selectedDevice);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="w-full max-w-md space-y-12">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-widest text-white uppercase">Chronos</h1>
          <p className="text-sm text-neutral-500 font-mono tracking-wide">MEMENTO MORI</p>
        </header>

        {/* Configuration */}
        <div className="space-y-8">
          <ViewModeToggle selectedMode={viewMode} onChange={setViewMode} />

          <div className="space-y-6">
            {viewMode === 'life' && (
              <BirthDateInput value={birthDate} onChange={setBirthDate} />
            )}
            
            <DeviceSelector
              selectedModel={selectedDevice?.model || ''}
              onSelect={setSelectedDevice}
            />
          </div>

          <button
            onClick={generateWallpaperUrl}
            disabled={!isFormComplete}
            className={`
              w-full py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300
              ${isFormComplete
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
              }
            `}
          >
            Generate
          </button>
        </div>

        {/* Result Area */}
        {wallpaperUrl && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 p-4 border border-white/10 bg-white/5 rounded backdrop-blur-sm">
              <code className="text-xs text-neutral-400 truncate flex-1 font-mono">
                {wallpaperUrl}
              </code>
              <button
                onClick={copyToClipboard}
                className="text-xs text-white hover:text-neutral-300 uppercase tracking-wider"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <div className="text-center">
              <a
                href={wallpaperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
              >
                Preview Wallpaper
              </a>
            </div>
            
            <SetupInstructions wallpaperUrl={wallpaperUrl} />
          </div>
        )}
      </div>
    </main>
  );
}
