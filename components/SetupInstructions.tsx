/**
 * SetupInstructions Component
 * Minimalist Redesign
 */

'use client';

import { useState } from 'react';

interface SetupInstructionsProps {
  wallpaperUrl: string;
  selectedBrand: string;
}

export default function SetupInstructions({ wallpaperUrl, selectedBrand }: SetupInstructionsProps) {
  const [openSection, setOpenSection] = useState<'ios' | 'android' | null>(null);
  
  const isIOS = selectedBrand === 'Apple';
  const isAndroid = selectedBrand !== 'Apple' && selectedBrand !== '';

  const toggleSection = (section: 'ios' | 'android') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 border-t border-white/10 space-y-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 text-center">
        Automation Setup
      </h2>

      <div className="space-y-2">
        {/* iOS Instructions */}
        {isIOS && (
        <div className="border border-white/5 rounded bg-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('ios')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-medium text-white">iOS Automation</span>
            <span className="text-neutral-500 text-xs">{openSection === 'ios' ? '−' : '+'}</span>
          </button>

          {openSection === 'ios' && (
            <div className="px-4 py-4 border-t border-white/5 text-sm text-neutral-400 space-y-2">
              <p>1. Open <strong className="text-white">Shortcuts</strong> app.</p>
              <p>2. Create new Shortcut with these actions:</p>
              <ul className="pl-4 list-disc space-y-1 text-neutral-500">
                <li>Action: <strong className="text-neutral-300">Get Contents of URL</strong> (Paste your generated URL).</li>
                <li>Action: <strong className="text-neutral-300">Set Wallpaper</strong> (Turn off "Show Preview").</li>
              </ul>
              <p>3. Create an Automation to run this shortcut daily at midnight.</p>
            </div>
          )}
        </div>
        )}

        {/* Android Instructions */}
        {isAndroid && (
        <div className="border border-white/5 rounded bg-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('android')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-medium text-white">Android Automation</span>
            <span className="text-neutral-500 text-xs">{openSection === 'android' ? '−' : '+'}</span>
          </button>

          {openSection === 'android' && (
            <div className="px-4 py-4 border-t border-white/5 text-sm text-neutral-400 space-y-2">
              <p>1. Use <a href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid&hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">MacroDroid</a> (or Tasker).</p>
              <p>2. Create a macro with:</p>
              <ul className="pl-4 list-disc space-y-1 text-neutral-500">
                <li>Trigger: <strong className="text-neutral-300">Time of Day</strong> (00:00).</li>
                <li>Action: <strong className="text-neutral-300">HTTP Request (GET)</strong> to file.</li>
                <li>Action: <strong className="text-neutral-300">Set Wallpaper</strong> from file.</li>
              </ul>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
