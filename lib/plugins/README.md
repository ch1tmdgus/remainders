<div align="center">
  <img src="../../public/logo.png" alt="Remainders" width="100" height="100" />
  <h1>Remainders Plugin Development Guide</h1>
</div>

Welcome to the Remainders plugin system! This guide will help you create custom plugins to extend your wallpaper with additional features and visual elements.

## Table of Contents

- [Overview](#overview)
- [Plugin Structure](#plugin-structure)
- [Plugin Context API](#plugin-context-api)
- [Configuration Schema](#configuration-schema)
- [Rendering Elements](#rendering-elements)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Submission Guidelines](#submission-guidelines)

## Overview

Plugins in Remainders allow you to add custom visual elements, dynamic content, and interactive features to your wallpaper. Plugins are executed server-side during wallpaper generation and can:

- Display custom text and emojis
- Show dynamic data (dates, calculations, external APIs)
- Add visual indicators and graphics
- Utilize user-configurable settings

## Plugin Structure

A basic plugin follows this structure:

```typescript
import type { Plugin, PluginExecutionContext, PluginRenderElement } from '../types';

export const myPlugin: Plugin = {
  id: 'my-plugin',
  name: 'My Custom Plugin',
  author: 'Your Name',
  version: '1.0.0',
  description: 'A brief description of what your plugin does',
  
  configSchema: {
    // User-configurable settings (optional)
    position: {
      type: 'string',
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      default: 'top-left',
      label: 'Position',
    },
    opacity: {
      type: 'number',
      default: 0.7,
      min: 0.1,
      max: 1.0,
      step: 0.1,
      label: 'Opacity',
    },
  },
  
  execute: (ctx: PluginExecutionContext): PluginRenderElement[] => {
    // Your plugin logic here
    const { config, width, height, typography, colors } = ctx;
    
    return [
      {
        type: 'text',
        content: 'Hello from my plugin!',
        x: width * 0.5,
        y: height * 0.5,
        fontSize: (typography?.fontSize || 0.035) * height * 0.5,
        color: colors?.text || '#FFFFFF',
        align: 'center',
      }
    ];
  },
};
```

## Plugin Context API

The `PluginExecutionContext` provides access to various data and settings:

### Available Properties

```typescript
interface PluginExecutionContext {
  config: Record<string, any>;      // User's plugin configuration
  width: number;                     // Wallpaper width in pixels
  height: number;                    // Wallpaper height in pixels
  colors: {                          // Theme colors
    background: string;
    past: string;
    current: string;
    future: string;
    text: string;
  };
  typography: {                      // Typography settings
    fontFamily: string;
    fontSize: number;                // Base font size (0.035 = 3.5% of height)
    statsVisible: boolean;
  };
  birthDate?: string;                // User's birth date (YYYY-MM-DD)
  viewMode: 'year' | 'life';        // Current view mode
}
```

### Responsive Font Sizing

Always scale text relative to the screen height:

```typescript
const baseFontSize = (typography?.fontSize || 0.035) * height;
const myTextSize = baseFontSize * 0.5; // 50% of base size
```

## Configuration Schema

Define user-configurable settings using the `configSchema` object:

### Supported Field Types

#### String (Dropdown)
```typescript
position: {
  type: 'string',
  enum: ['option1', 'option2', 'option3'],
  default: 'option1',
  label: 'Position',
}
```

#### Number (Slider)
```typescript
opacity: {
  type: 'number',
  default: 0.7,
  min: 0.1,
  max: 1.0,
  step: 0.1,
  label: 'Opacity',
}
```

#### Boolean (Toggle)
```typescript
showIcon: {
  type: 'boolean',
  default: true,
  label: 'Show Icon',
}
```

#### Array (List Editor)
```typescript
items: {
  type: 'array',
  default: ['Item 1', 'Item 2', 'Item 3'],
  label: 'Items to Display',
}
```

#### Color (Color Picker)
```typescript
textColor: {
  type: 'color',
  default: '#FFFFFF',
  label: 'Text Color',
}
```

### Default Settings

The system automatically extracts default values from your `configSchema`. Users start with these defaults when installing your plugin.

## Rendering Elements

Plugins return an array of `PluginRenderElement` objects. Each element represents a visual component to render.

### Text Element

```typescript
{
  type: 'text',
  content: string,           // Text to display
  x: number,                 // X position (pixels)
  y: number,                 // Y position (pixels)
  fontSize: number,          // Font size (pixels)
  color: string,             // Text color (hex or rgba)
  align: 'left' | 'center' | 'right',
  maxWidth?: number,         // Maximum width (pixels)
  fontFamily?: string,       // Font family
}
```

### Positioning Guidelines

- Use percentages of width/height for responsive positioning:
  ```typescript
  x: width * 0.1,   // 10% from left
  y: height * 0.05, // 5% from top
  ```

- Common positions:
  - **Top-left**: `{ x: padding, y: padding }`
  - **Top-right**: `{ x: width - padding, y: padding }`
  - **Bottom-left**: `{ x: padding, y: height - padding }`
  - **Bottom-right**: `{ x: width - padding, y: height - padding }`
  - **Center**: `{ x: width * 0.5, y: height * 0.5 }`

## Examples

### Example 1: Simple Date Display

```typescript
export const datePlugin: Plugin = {
  id: 'date-display',
  name: 'Date Display',
  author: 'Remainders Team',
  version: '1.0.0',
  description: 'Display the current date',
  
  configSchema: {
    format: {
      type: 'string',
      enum: ['short', 'long', 'numeric'],
      default: 'short',
      label: 'Date Format',
    },
  },
  
  execute: (ctx) => {
    const { config, width, height, typography } = ctx;
    const baseFontSize = (typography?.fontSize || 0.035) * height;
    const now = new Date();
    
    let dateString;
    if (config.format === 'long') {
      dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (config.format === 'numeric') {
      dateString = now.toLocaleDateString('en-US');
    } else {
      dateString = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    return [{
      type: 'text',
      content: dateString,
      x: width * 0.5,
      y: height * 0.1,
      fontSize: baseFontSize * 0.4,
      color: '#FFFFFF',
      align: 'center',
    }];
  },
};
```

### Example 2: Countdown Timer

```typescript
export const countdownPlugin: Plugin = {
  id: 'countdown',
  name: 'Event Countdown',
  author: 'Your Name',
  version: '1.0.0',
  description: 'Count down to an important date',
  
  configSchema: {
    eventDate: {
      type: 'string',
      default: '2026-12-31',
      label: 'Event Date (YYYY-MM-DD)',
    },
    eventName: {
      type: 'string',
      default: 'New Year',
      label: 'Event Name',
    },
  },
  
  execute: (ctx) => {
    const { config, width, height, typography } = ctx;
    const baseFontSize = (typography?.fontSize || 0.035) * height;
    
    const now = new Date();
    const eventDate = new Date(config.eventDate || '2026-12-31');
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      {
        type: 'text',
        content: `${daysUntil} days until`,
        x: width * 0.5,
        y: height * 0.85,
        fontSize: baseFontSize * 0.3,
        color: 'rgba(255, 255, 255, 0.6)',
        align: 'center',
      },
      {
        type: 'text',
        content: config.eventName || 'Event',
        x: width * 0.5,
        y: height * 0.9,
        fontSize: baseFontSize * 0.4,
        color: '#FFFFFF',
        align: 'center',
      },
    ];
  },
};
```

### Example 3: Progress Bar

```typescript
export const goalPlugin: Plugin = {
  id: 'goal-tracker',
  name: 'Goal Progress',
  author: 'Your Name',
  version: '1.0.0',
  description: 'Track progress toward a goal',
  
  configSchema: {
    goalName: {
      type: 'string',
      default: 'My Goal',
      label: 'Goal Name',
    },
    current: {
      type: 'number',
      default: 50,
      min: 0,
      max: 100,
      label: 'Current Progress',
    },
    total: {
      type: 'number',
      default: 100,
      min: 1,
      max: 1000,
      label: 'Total Target',
    },
  },
  
  execute: (ctx) => {
    const { config, width, height, typography } = ctx;
    const baseFontSize = (typography?.fontSize || 0.035) * height;
    
    const current = config.current || 0;
    const total = config.total || 100;
    const percentage = Math.min(100, Math.round((current / total) * 100));
    
    return [
      {
        type: 'text',
        content: config.goalName || 'Goal',
        x: width * 0.1,
        y: height * 0.15,
        fontSize: baseFontSize * 0.35,
        color: '#FFFFFF',
        align: 'left',
      },
      {
        type: 'text',
        content: `${percentage}%`,
        x: width * 0.1,
        y: height * 0.2,
        fontSize: baseFontSize * 0.6,
        color: '#FF6B35',
        align: 'left',
      },
      {
        type: 'text',
        content: `${current} / ${total}`,
        x: width * 0.1,
        y: height * 0.25,
        fontSize: baseFontSize * 0.25,
        color: 'rgba(255, 255, 255, 0.5)',
        align: 'left',
      },
    ];
  },
};
```

## Best Practices

### 1. Responsive Design
- Always scale text relative to screen dimensions
- Use percentages for positioning instead of fixed pixels
- Test on multiple device sizes (see Dashboard → Device Selector)

### 2. Typography Consistency
```typescript
// Good: Use global typography settings
const baseFontSize = (typography?.fontSize || 0.035) * height;
const myText = baseFontSize * 0.5;

// Bad: Hard-coded sizes
const myText = 20; // Don't do this!
```

### 3. Color Harmony
- Use colors from the `colors` context when possible
- Provide opacity control for better customization
- Support both light and dark themes

### 4. Performance
- Keep calculations simple and fast
- Avoid complex loops or recursive functions
- Limit the number of rendered elements (< 20 recommended)

### 5. User Experience
- Provide sensible defaults
- Add clear labels to configuration options
- Include helpful descriptions
- Test with various configurations

### 6. Emojis and Special Characters
```typescript
// Emojis work great for icons
content: '🌙 Moon Phase',
content: '✅ Task Complete',
content: '📅 ' + dateString,
```

### 7. Layout Spacing
```typescript
// Use consistent padding
const padding = height * 0.05;

// Space elements evenly
const lineHeight = baseFontSize * 0.5;
let y = startY;
elements.forEach((element) => {
  // render element at y
  y += lineHeight;
});
```

## Submission Guidelines

### Before Submitting

1. **Test thoroughly** on multiple devices
2. **Use clear naming**: Plugin names should be descriptive
3. **Add proper defaults**: Users should have a good experience out of the box
4. **Write clean code**: Follow TypeScript best practices
5. **Respect user settings**: Use typography and color settings from context

### How to Submit

1. Go to the **Plugin Submission** page in the dashboard
2. Paste your plugin code (including `export const plugin = { ... }`)
3. Fill in the configuration schema (JSON format)
4. Add default settings (JSON format)
5. Click **Submit Plugin**

### Plugin Code Format

Your plugin code should export the plugin object:

```typescript
import type { Plugin, PluginExecutionContext, PluginRenderElement } from '../types';

export const myPlugin: Plugin = {
  // ... plugin definition
};
```

When submitting, you can include or exclude the import statements - the system will handle them.

### Configuration Schema Format (JSON)

```json
{
  "position": {
    "type": "string",
    "enum": ["top-left", "top-right", "bottom-left", "bottom-right"],
    "default": "top-left",
    "label": "Position"
  },
  "opacity": {
    "type": "number",
    "default": 0.7,
    "min": 0.1,
    "max": 1.0,
    "step": 0.1,
    "label": "Opacity"
  }
}
```

### Default Settings Format (JSON)

```json
{
  "position": "top-left",
  "opacity": 0.7
}
```

---

## Need Help?

- Check the built-in plugins for reference (Daily Quotes, Habit Tracker, Moon Phase)
- View plugin source code in the **Plugin Code Viewer**
- Clone existing plugins and modify them
- Test your plugin locally before submitting

Happy plugin development! 🚀
