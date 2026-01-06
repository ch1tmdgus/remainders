/**
 * ThemeColorPicker Component
 * 
 * Allows users to select a theme color for their wallpaper.
 * Provides preset colors for quick selection and a custom color picker.
 */

'use client';

interface ThemeColorPickerProps {
  /** Currently selected color in hex format (e.g., "#FF6B35") */
  selectedColor: string;
  
  /** Callback function when color changes */
  onChange: (color: string) => void;
}

/**
 * Preset color options
 * These are carefully chosen colors that work well on dark backgrounds
 */
const PRESET_COLORS = [
  { name: 'Coral', value: '#FF6B35' },
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Purple', value: '#9B59B6' },
  { name: 'Green', value: '#2ECC71' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Pink', value: '#FF3B82' },
  { name: 'Cyan', value: '#00D9FF' },
  { name: 'Yellow', value: '#FFD700' },
];

export default function ThemeColorPicker({ selectedColor, onChange }: ThemeColorPickerProps) {
  // Ensure we have a valid color value
  const color = selectedColor || '#FF6B35';
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Theme Color
      </label>
      
      {/* Preset color swatches */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {PRESET_COLORS.map((presetColor) => (
          <button
            key={presetColor.value}
            type="button"
            onClick={() => onChange(presetColor.value)}
            className={`
              relative h-12 rounded-lg transition-all
              hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${color === presetColor.value ? 'ring-2 ring-offset-2 ring-gray-900' : ''}
            `}
            style={{ backgroundColor: presetColor.value }}
            title={presetColor.name}
          >
            {/* Checkmark for selected color */}
            {selectedColor === presetColor.value && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Custom color picker */}
      <div className="flex items-center gap-3">
        <label htmlFor="customColor" className="text-sm text-gray-600">
          Or choose custom color:
        </label>
        
        <input
          id="customColor"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
        />
        
        {/* Display current color hex value */}
        <span className="text-sm font-mono text-gray-500">
          {color.toUpperCase()}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
        This color will be used for text in your wallpaper
      </p>
    </div>
  );
}
