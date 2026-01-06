/**
 * Plugin Submission Page
 * 
 * Allows users to submit their own plugins to the marketplace.
 * Plugins are auto-approved and published immediately.
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function PluginSubmissionForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [configSchema, setConfigSchema] = useState('{}');
  const [defaultSettings, setDefaultSettings] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load cloned plugin data from URL params
  useEffect(() => {
    const cloneParam = searchParams.get('clone');
    if (cloneParam) {
      try {
        const cloneData = JSON.parse(cloneParam);
        if (cloneData.name) setName(cloneData.name);
        if (cloneData.description) setDescription(cloneData.description);
        if (cloneData.code) setCode(cloneData.code);
        if (cloneData.configSchema) setConfigSchema(JSON.stringify(cloneData.configSchema, null, 2));
        if (cloneData.defaultSettings) setDefaultSettings(JSON.stringify(cloneData.defaultSettings, null, 2));
      } catch (e) {
        console.error('Failed to parse clone data:', e);
      }
    }
  }, [searchParams]);

  const validateCode = (code: string): { valid: boolean; error?: string } => {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /\beval\b/,
      /\bFunction\b\s*\(/,
      /\bfetch\b/,
      /XMLHttpRequest/,
      /\bprocess\b/,
      /\bglobal\b/,
      /__dirname/,
      /__filename/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return { valid: false, error: `Security violation: Code contains blocked API (${pattern})` };
      }
    }

    // Try to parse as valid JavaScript
    // Skip syntax check for ES6 modules (with imports/exports) since they're handled by the execution environment
    if (!/\bimport\b|\bexport\b/.test(code)) {
      try {
        new Function(code);
      } catch (e: any) {
        return { valid: false, error: `Syntax error: ${e.message}` };
      }
    }

    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit plugins');
      return;
    }

    setError('');
    setSubmitting(true);

    // Validate inputs
    if (!name.trim() || !description.trim() || !code.trim()) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    // Validate code
    const codeValidation = validateCode(code);
    if (!codeValidation.valid) {
      setError(codeValidation.error || 'Invalid code');
      setSubmitting(false);
      return;
    }

    // Validate JSON schemas
    try {
      JSON.parse(configSchema);
      JSON.parse(defaultSettings);
    } catch (e) {
      setError('Invalid JSON in config schema or default settings');
      setSubmitting(false);
      return;
    }

    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Submit plugin to Firestore
      await addDoc(collection(db, 'plugins'), {
        name: name.trim(),
        description: description.trim(),
        author: user.displayName || user.email || 'Anonymous',
        authorId: user.uid,
        code: code,
        configSchema: JSON.parse(configSchema),
        defaultSettings: JSON.parse(defaultSettings),
        version: '1.0.0',
        approved: true, // Auto-approve
        installs: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setName('');
      setDescription('');
      setCode('');
      setConfigSchema('{}');
      setDefaultSettings('{}');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError('Failed to submit plugin: ' + err.message);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-sm tracking-widest uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <p className="text-sm tracking-widest uppercase">Please log in to submit plugins</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-widest"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm tracking-widest uppercase">Submit Plugin</h1>
          <p className="text-xs text-neutral-500">Create a new plugin for the marketplace</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs text-neutral-500 hover:text-white uppercase tracking-wider transition-colors"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Form */}
      <div className="p-4 max-w-3xl mx-auto">
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg text-green-100">
            ✓ Plugin submitted successfully! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plugin Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Plugin Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Plugin"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 focus:border-white outline-none text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your plugin do?"
              rows={3}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 focus:border-white outline-none text-white resize-none"
              required
            />
          </div>

          {/* Plugin Code */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Plugin Code (JavaScript) *
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Example plugin structure
return {
  calculate: (context) => {
    // Modify date calculations or add custom data
    return { customDate: new Date() };
  },
  render: (context, data) => {
    // Return SVG/HTML elements to add to wallpaper
    return '<div style="position:absolute;top:10px;left:10px;color:white;">Hello!</div>';
  }
};`}
              rows={15}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 focus:border-white outline-none text-white font-mono text-sm resize-none"
              required
            />
            <p className="text-xs text-neutral-500">
              Your code will run in a sandboxed environment. Blocked APIs: eval, fetch, process, global, etc.
            </p>
          </div>

          {/* Config Schema */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Config Schema (JSON Schema)
            </label>
            <textarea
              value={configSchema}
              onChange={(e) => setConfigSchema(e.target.value)}
              placeholder='{"timezone": {"type": "string", "default": "UTC"}}'
              rows={5}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 focus:border-white outline-none text-white font-mono text-sm resize-none"
            />
          </div>

          {/* Default Settings */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Default Settings (JSON)
            </label>
            <textarea
              value={defaultSettings}
              onChange={(e) => setDefaultSettings(e.target.value)}
              placeholder='{"timezone": "UTC"}'
              rows={3}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 focus:border-white outline-none text-white font-mono text-sm resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-white text-black disabled:bg-neutral-800 disabled:text-neutral-600 hover:bg-neutral-200 transition-colors uppercase tracking-widest text-sm font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Plugin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PluginSubmissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <PluginSubmissionForm />
    </Suspense>
  );
}
