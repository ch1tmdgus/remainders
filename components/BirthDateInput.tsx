/**
 * BirthDateInput Component
 * Minimalist Redesign
 */

'use client';

interface BirthDateInputProps {
  value: string;
  onChange: (date: string) => void;
}

export default function BirthDateInput({ value, onChange }: BirthDateInputProps) {
  const today = new Date().toISOString().split('T')[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="w-full group">
      <label htmlFor="birthDate" className="text-xs uppercase tracking-widest text-neutral-500 mb-1 block group-focus-within:text-white transition-colors">
        Birth Date
      </label>

      <input
        id="birthDate"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDateStr}
        max={today}
        required
        className="input-minimal text-white placeholder:text-neutral-700 bg-transparent [color-scheme:dark]"
      />
    </div>
  );
}
