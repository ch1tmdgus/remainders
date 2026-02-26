/**
 * Remainders - Main Page Component
 * Minimalist Redesign - Fixed Build Errors
 */

'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DeviceModel } from '@/lib/types';
import DeviceSelector from '@/components/DeviceSelector';
import BirthDateInput from '@/components/BirthDateInput';
import ViewModeToggle from '@/components/ViewModeToggle';
import SetupInstructions from '@/components/SetupInstructions';
import AuthButton from '@/components/AuthButton';

const STORAGE_KEY = 'remainders-user-profile';
const THEME_COLOR = 'FFFFFF'; 

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'life'>('life');
  const [isMondayFirst, setIsMondayFirst] = useState(false);
  const [yearViewLayout, setYearViewLayout] = useState<'months' | 'days'>('months');
  const [daysLayoutMode, setDaysLayoutMode] = useState<'calendar' | 'continuous'>('continuous');
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        setBirthDate(profile.birthDate);
        if (profile.viewMode) setViewMode(profile.viewMode);
        if (profile.isMondayFirst !== undefined) setIsMondayFirst(profile.isMondayFirst);
        if ((profile as any).yearViewLayout) setYearViewLayout((profile as any).yearViewLayout);
        if ((profile as any).daysLayoutMode) setDaysLayoutMode((profile as any).daysLayoutMode);

        if (profile.device) {
          setSelectedDevice({
            brand: profile.device.brand || '',
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

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (birthDate && selectedDevice) {
      const profile: any = {
        birthDate,
        themeColor: THEME_COLOR,
        device: {
          brand: selectedDevice.brand,
          modelName: selectedDevice.model,
          width: selectedDevice.width,
          height: selectedDevice.height,
        },
        viewMode,
        isMondayFirst,
        yearViewLayout,
        daysLayoutMode,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }
  }, [birthDate, selectedDevice, viewMode, isMondayFirst, yearViewLayout, daysLayoutMode]);

  const generateWallpaperUrl = () => {
    if (!selectedDevice || !selectedDevice.width || !selectedDevice.height) return;
    if (viewMode === 'life' && !birthDate) return;

    const params = new URLSearchParams({
      themeColor: THEME_COLOR,
      width: selectedDevice.width.toString(),
      height: selectedDevice.height.toString(),
      viewMode,
    });

    if (viewMode === 'life' && birthDate) params.append('birthDate', birthDate);
    if (viewMode === 'year') {
      if (isMondayFirst) params.append('isMondayFirst', 'true');
      params.append('yearViewLayout', yearViewLayout);
      if (yearViewLayout === 'days') params.append('daysLayoutMode', daysLayoutMode);
    }

    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
    setWallpaperUrl(`${baseUrl}/api/wallpaper?${params.toString()}`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const isFormComplete = viewMode === 'year' ? selectedDevice !== null : (birthDate && selectedDevice);

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 selection:bg-white selection:text-black relative">
      <AuthButton />
      
      <div className="w-full flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        {/* Header - Fixed Structure */}
        <header className="text-center space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-light tracking-widest text-white uppercase">Remainders</h1>
            <a 
              href="https://github.com/Ti-03/Chronos" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-neutral-500 font-mono tracking-widest uppercase">Memento Mori</p>
        </header>

        {/* Configuration */}
        <section className="space-y-8 w-full">
          <ViewModeToggle selectedMode={viewMode} onChange={setViewMode} />
          
          {viewMode === 'year' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Layout</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setYearViewLayout('months')}
                    className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${yearViewLayout === 'months' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800'}`}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setYearViewLayout('days')}
                    className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${yearViewLayout === 'days' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800'}`}
                  >
                    Days
                  </button>
                </div>
              </div>

              {yearViewLayout === 'days' && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">Days Mode</label>
                  <div className="flex gap-2">
                    <button onClick={() => setDaysLayoutMode('continuous')} className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${daysLayoutMode === 'continuous' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800'}`}>Continuous</button>
                    <button onClick={() => setDaysLayoutMode('calendar')} className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${daysLayoutMode === 'calendar' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800'}`}>Calendar</button>
                  </div>
                </div>
              )}

              {(yearViewLayout === 'months' || (yearViewLayout === 'days' && daysLayoutMode === 'calendar')) && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="mondayFirst"
                    checked={isMondayFirst}
                    onChange={(e) => setIsMondayFirst(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-black/50 checked:bg-white appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-black checked:after:font-bold"
                  />
                  <label htmlFor="mondayFirst" className="text-xs uppercase tracking-widest text-neutral-500 cursor-pointer">Start week on Monday</label>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {viewMode === 'life' && <BirthDateInput value={birthDate} onChange={setBirthDate} />}
            <DeviceSelector selectedModel={selectedDevice?.model || ''} onSelect={setSelectedDevice} />
          </div>

          <button
            onClick={generateWallpaperUrl}
            disabled={!isFormComplete}
            className={`w-full py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${isFormComplete ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'}`}
          >
            Generate
          </button>
        </section>

        {/* Result Area */}
        {wallpaperUrl && (
          <section className="w-full space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 p-4 border border-white/10 bg-white/5 rounded backdrop-blur-sm">
              <code className="text-xs text-neutral-400 truncate flex-1 font-mono">{wallpaperUrl}</code>
              <button onClick={copyToClipboard} className="text-xs text-white uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <div className="text-center">
              <a href={wallpaperUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 hover:text-white border-b border-transparent hover:border-white pb-0.5">Preview Wallpaper</a>
            </div>
            <SetupInstructions wallpaperUrl={wallpaperUrl} selectedBrand={selectedDevice?.brand || ''} />
          </section>
        )}
      </div>

      {/* Footer - Wrapped in a Single Container */}
      <footer className="w-full flex flex-col items-center gap-2 py-8 mt-8 border-t border-white/5">
        <a
          href="https://github.com/ch1tmdgus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors"
        >
          Forked by Ch1tmdgus
        </a>
        <a
          href="https://github.com/Ti-03"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors"
        >
          Created by Qutibah Ananzeh
        </a>
      </footer>
    </main>
  );
}
