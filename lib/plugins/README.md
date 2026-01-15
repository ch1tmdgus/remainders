<div align="center">
  <img src="../../public/logo.png" alt="Remainders" width="100" height="100" />
  <h1>Remainders Plugin Development Guide</h1>
</div>

Welcome to the Remainders plugin system! This guide will help you create custom plugins to add text, emojis, and dynamic content to your wallpaper.

## Quick Start: Your First Plugin

Let's create a simple plugin that displays "Hello World" on your wallpaper. Here's **exactly** what you'll submit in each form field:

### The Submission Form Has 5 Fields:

#### 1. **Plugin Name** (text field)
```
Hello World
```
*This is what users see in the plugin marketplace*

#### 2. **Description** (text field)
```
Displays a simple hello world message on your wallpaper
```
*Tells users what your plugin does*

#### 3. **Plugin Code** (JavaScript code)
```javascript
const plugin = {
  id: 'hello-world',
  version: '1.0.0',
  configSchema: {},
  execute: (ctx) => {
    return [{
      type: 'text',
      content: 'Hello World!',
      x: ctx.width * 0.5,
      y: ctx.height * 0.5,
      fontSize: (ctx.typography?.fontSize || 0.035) * ctx.height * 0.5,
      color: '#FFFFFF',
      align: 'center',
    }];
  },
};
```
*Your plugin's JavaScript code*

**⚠️ IMPORTANT:** Must use `const plugin = {...}` as the variable name, not `const myPlugin` or any other name!

#### 4. **Config Schema** (JSON)
```json
{}
```
*Leave empty `{}` if your plugin has no settings*

#### 5. **Default Settings** (JSON)
```json
{}
```
*Leave empty `{}` if your plugin has no settings*

---

## How to Submit Your Plugin

**Step-by-step:**

1. **Login** → Click "Login with Google" on the homepage
2. **Go to Dashboard** → Click "Dashboard" in the navigation
3. **Go to Plugins** → Click "Plugins" in the left sidebar
4. **Click "Submit Plugin"** → Click the "Submit Plugin" button
5. **Fill the form** → Copy-paste the 5 fields from above
6. **Click "Submit Plugin"** → Your plugin is live instantly!

That's it! Your plugin is now available in the marketplace.

---

## Table of Contents

- [Understanding Form Fields](#understanding-form-fields)
- [Plugin Code Structure](#plugin-code-structure)
- [Adding User Settings](#adding-user-settings)
- [Working with Context](#working-with-context)
- [More Examples](#more-examples)
- [Best Practices](#best-practices)

---

## Understanding Form Fields

Let's break down what each field means:

### Field 1 & 2: Plugin Name & Description
These are simple text fields that appear in the marketplace. Keep them clear and descriptive.

### Field 3: Plugin Code (JavaScript)
This is your actual plugin code. It must have 4 parts:

**⚠️ CRITICAL:** You **MUST** use `const plugin = {` as the variable name. Using any other name like `const myPlugin` or `const helloPlugin` will cause your plugin to not work!

```javascript
const plugin = {
  id: 'unique-plugin-id',        // Must be unique (lowercase-with-hyphens)
  version: '1.0.0',              // Version number
  configSchema: {},              // User settings definition (can be empty {})
  execute: (ctx) => {            // Function that returns text elements
    // Your code here
    return [ /* text elements */ ];
  },
};
```

### Field 4 & 5: Config Schema & Default Settings
These work together to create user-configurable settings. If you don't need settings, just put `{}` in both.

---

---

## Plugin Code Structure

Every plugin code must include these 4 properties:

### Required Properties

```javascript
const plugin = {
  // 1. UNIQUE ID (lowercase-with-hyphens)
  id: 'my-plugin-name',
  
  // 2. VERSION (use 1.0.0 for first version)
  version: '1.0.0',
  
  // 3. CONFIG SCHEMA (settings users can change)
  configSchema: {
    // Define settings here, or leave empty {}
  },
  
  // 4. EXECUTE FUNCTION (returns text elements to display)
  execute: (ctx) => {
    // ctx contains: width, height, colors, typography, config, etc.
    
    return [
      {
        type: 'text',
        content: 'Your text here',
        x: ctx.width * 0.5,           // X position (50% = center)
        y: ctx.height * 0.5,          // Y position (50% = center)
        fontSize: 48,                 // Font size in pixels
        color: '#FFFFFF',             // Text color
        align: 'center',              // 'left', 'center', or 'right'
      }
    ];
  },
};
```

### What Each Part Does

**`id`** - A unique identifier for your plugin (no spaces, use hyphens)

**`version`** - Version number (start with `1.0.0`)

**`configSchema`** - Defines what settings users can customize. Empty `{}` means no settings.

**`execute`** - Function that runs when generating the wallpaper. It receives `ctx` (context) and must return an array of text elements.

---

## Adding User Settings

Want users to customize your plugin? Use `configSchema` and `config`:

### Example: Plugin with Position Setting

**Field 3: Plugin Code**
```javascript
const plugin = {
  id: 'custom-text',
  version: '1.0.0',
  
  configSchema: {
    position: {
      type: 'string',
      enum: ['top', 'center', 'bottom'],
      default: 'center',
      label: 'Position',
    },
  },
  
  execute: (ctx) => {
    // Get user's chosen position from config
    const pos = ctx.config.position || 'center';
    
    let y;
    if (pos === 'top') y = ctx.height * 0.1;
    else if (pos === 'bottom') y = ctx.height * 0.9;
    else y = ctx.height * 0.5;
    
    return [{
      type: 'text',
      content: 'Custom Text',
      x: ctx.width * 0.5,
      y: y,
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
    }];
  },
};
```

**Field 4: Config Schema** (same as configSchema above)
```json
{
  "position": {
    "type": "string",
    "enum": ["top", "center", "bottom"],
    "default": "center",
    "label": "Position"
  }
}
```

**Field 5: Default Settings**
```json
{
  "position": "center"
}
```

### Available Setting Types

**Dropdown (String with options):**
```javascript
settingName: {
  type: 'string',
  enum: ['option1', 'option2', 'option3'],
  default: 'option1',
  label: 'Setting Label',
}
```

**Number Slider:**
```javascript
settingName: {
  type: 'number',
  default: 1.0,
  min: 0.5,
  max: 2.0,
  step: 0.1,
  label: 'Setting Label',
}
```

**Toggle (Boolean):**
```javascript
settingName: {
  type: 'boolean',
  default: true,
  label: 'Setting Label',
}
```

**Text Input:**
```javascript
settingName: {
  type: 'string',
  default: 'Default text',
  label: 'Setting Label',
}
```

---

## Working with Context

The `ctx` parameter in your `execute` function contains everything about the user's wallpaper:

### Available Context Properties

```javascript
execute: (ctx) => {
  // User's plugin settings
  ctx.config                     // { position: 'top', size: 1.5, ... }
  
  // Screen dimensions
  ctx.width                      // 1170 (pixels)
  ctx.height                     // 2532 (pixels)
  
  // User's color theme
  ctx.colors.background          // '#000000'
  ctx.colors.past                // '#404040'
  ctx.colors.current             // '#FF6B35'
  ctx.colors.future              // '#1a1a1a'
  ctx.colors.text                // '#FFFFFF'
  
  // User's typography settings
  ctx.typography.fontFamily      // 'monospace'
  ctx.typography.fontSize        // 0.035 (base font size percentage)
  ctx.typography.statsVisible    // true
  
  // User's birth date
  ctx.birthDate                  // '1990-01-15' (YYYY-MM-DD)
  
  // View mode
  ctx.viewMode                   // 'year' or 'life'
  
  // Timezone & date
  ctx.timezone                   // 'America/New_York'
  ctx.currentDate                // Date object in user's timezone
}
```

### Responsive Font Sizing

Always scale text relative to screen height:

```javascript
const baseFontSize = (ctx.typography?.fontSize || 0.035) * ctx.height;
const myTextSize = baseFontSize * 0.5;  // 50% of base size
```

---

## More Examples

### Example 1: Current Date Display

**Form Fields:**

**Plugin Name:** `Current Date`

**Description:** `Displays today's date in your preferred format`

**Plugin Code:**
```javascript
const plugin = {
  id: 'current-date',
  version: '1.0.0',
  
  configSchema: {
    format: {
      type: 'string',
      enum: ['short', 'long', 'numeric'],
      default: 'short',
      label: 'Date Format',
    },
  },
  
  execute: (ctx) => {
    const baseFontSize = (ctx.typography?.fontSize || 0.035) * ctx.height;
    const now = new Date();
    
    let dateString;
    if (ctx.config.format === 'long') {
      dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
    } else if (ctx.config.format === 'numeric') {
      dateString = now.toLocaleDateString('en-US');
    } else {
      dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    return [{
      type: 'text',
      content: dateString,
      x: ctx.width * 0.5,
      y: ctx.height * 0.1,
      fontSize: baseFontSize * 0.4,
      color: ctx.colors.text,
      align: 'center',
    }];
  },
};
```

**Config Schema:**
```json
{
  "format": {
    "type": "string",
    "enum": ["short", "long", "numeric"],
    "default": "short",
    "label": "Date Format"
  }
}
```

**Default Settings:**
```json
{
  "format": "short"
}
```

---

### Example 2: Event Countdown

**Form Fields:**

**Plugin Name:** `Event Countdown`

**Description:** `Count down days until an important event`

**Plugin Code:**
```javascript
const plugin = {
  id: 'event-countdown',
  version: '1.0.0',
  
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
    const baseFontSize = (ctx.typography?.fontSize || 0.035) * ctx.height;
    const now = new Date();
    const eventDate = new Date(ctx.config.eventDate || '2026-12-31');
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      {
        type: 'text',
        content: `${daysUntil} days until`,
        x: ctx.width * 0.5,
        y: ctx.height * 0.85,
        fontSize: baseFontSize * 0.3,
        color: 'rgba(255, 255, 255, 0.6)',
        align: 'center',
      },
      {
        type: 'text',
        content: ctx.config.eventName || 'Event',
        x: ctx.width * 0.5,
        y: ctx.height * 0.9,
        fontSize: baseFontSize * 0.4,
        color: ctx.colors.current,
        align: 'center',
      },
    ];
  },
};
```

**Config Schema:**
```json
{
  "eventDate": {
    "type": "string",
    "default": "2026-12-31",
    "label": "Event Date (YYYY-MM-DD)"
  },
  "eventName": {
    "type": "string",
    "default": "New Year",
    "label": "Event Name"
  }
}
```

**Default Settings:**
```json
{
  "eventDate": "2026-12-31",
  "eventName": "New Year"
}
```

---

### Example 3: Seasonal Emoji

**Form Fields:**

**Plugin Name:** `Seasonal Emoji`

**Description:** `Display an emoji that changes with the seasons`

**Plugin Code:**
```javascript
const plugin = {
  id: 'seasonal-emoji',
  version: '1.0.0',
  
  configSchema: {
    position: {
      type: 'string',
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      default: 'top-left',
      label: 'Position',
    },
    size: {
      type: 'number',
      default: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
      label: 'Size',
    },
  },
  
  execute: (ctx) => {
    const baseFontSize = (ctx.typography?.fontSize || 0.035) * ctx.height;
    
    // Get current season
    const month = new Date().getMonth();
    let emoji = '☀️';
    if (month >= 2 && month <= 4) emoji = '🌸';      // Spring
    else if (month >= 5 && month <= 7) emoji = '☀️'; // Summer
    else if (month >= 8 && month <= 10) emoji = '🍂'; // Fall
    else emoji = '❄️';                               // Winter
    
    // Position mapping
    const positions = {
      'top-left': { x: ctx.width * 0.1, y: ctx.height * 0.05 },
      'top-right': { x: ctx.width * 0.9, y: ctx.height * 0.05 },
      'bottom-left': { x: ctx.width * 0.1, y: ctx.height * 0.95 },
      'bottom-right': { x: ctx.width * 0.9, y: ctx.height * 0.95 },
    };
    const pos = positions[ctx.config.position] || positions['top-left'];
    
    return [{
      type: 'text',
      content: emoji,
      x: pos.x,
      y: pos.y,
      fontSize: baseFontSize * 0.8 * (ctx.config.size || 1.0),
      color: '#FFFFFF',
      align: 'center',
    }];
  },
};
```

**Config Schema:**
```json
{
  "position": {
    "type": "string",
    "enum": ["top-left", "top-right", "bottom-left", "bottom-right"],
    "default": "top-left",
    "label": "Position"
  },
  "size": {
    "type": "number",
    "default": 1.0,
    "min": 0.5,
    "max": 2.0,
    "step": 0.1,
    "label": "Size"
  }
}
```

**Default Settings:**
```json
{
  "position": "top-left",
  "size": 1.0
}
```

---

```javascript
const myPlugin = {
  id: 'my-plugin',
  version: '1.0.0',
  
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
  
  execute: (ctx) => {
    // Your plugin logic here

## Best Practices

### 1. Always Use Responsive Positioning
Use percentages instead of fixed pixel values:

```javascript
// ✅ Good - works on all screen sizes
x: ctx.width * 0.5,      // 50% from left (center)
y: ctx.height * 0.1,     // 10% from top

// ❌ Bad - only works on one screen size
x: 585,
y: 253,
```

### 2. Use Responsive Font Sizes
Scale text relative to screen height:

```javascript
// ✅ Good - scales with screen size
const baseFontSize = (ctx.typography?.fontSize || 0.035) * ctx.height;
fontSize: baseFontSize * 0.5,

// ❌ Bad - fixed size doesn't scale
fontSize: 20,
```

### 3. Use User's Color Theme
Respect the user's color choices:

```javascript
// ✅ Good - uses user's theme color
color: ctx.colors.current,
color: ctx.colors.text,

// ❌ Acceptable but less flexible
color: '#FFFFFF',
```

### 4. Common Positioning Patterns

```javascript
// Top-left corner
{ x: ctx.width * 0.05, y: ctx.height * 0.05 }

// Top-right corner
{ x: ctx.width * 0.95, y: ctx.height * 0.05 }

// Bottom-left corner
{ x: ctx.width * 0.05, y: ctx.height * 0.95 }

// Bottom-right corner
{ x: ctx.width * 0.95, y: ctx.height * 0.95 }

// Center
{ x: ctx.width * 0.5, y: ctx.height * 0.5 }
```

### 5. Emojis Work Great
Use emojis for visual appeal:

```javascript
content: '��� Moon Phase',
content: '✅ Task Complete',
content: '��� ' + dateString,
content: '⭐ Star Rating: 5/5',
```

### 6. Keep It Simple
- Limit to 5-10 text elements per plugin
- Avoid complex calculations
- Test with different settings

### 7. Provide Good Defaults
Users should get a good experience without changing settings:

```javascript
configSchema: {
  message: {
    type: 'string',
    default: 'Hello!',  // ✅ Provide a default
    label: 'Message',
  },
}
```

---

## Troubleshooting

### Plugin Not Showing Up?
- ⚠️ **Most Common Issue:** Check that you used `const plugin = {` not `const myPlugin = {` or any other variable name
- Check that `id` is unique (lowercase-with-hyphens)
- Make sure `execute` returns an array: `return [{...}];`
- Verify Config Schema and Default Settings are valid JSON
- Make sure the plugin is **enabled** after installation

### Text Not Visible?
- Check `x` and `y` are within screen bounds
- Try using `ctx.colors.text` for color
- Increase `fontSize`

### Settings Not Working?
- Config Schema and Default Settings must match
- Access settings with `ctx.config.settingName`
- Make sure Default Settings JSON is valid

---

## Security Note

For safety, these APIs are **blocked** in plugin code:
- `eval()`, `Function()`
- `fetch()`, `XMLHttpRequest`
- `import`, `require()`  
- `process`, `global`

Keep your plugins simple and safe! ���

---

## Need Help?

1. **View Built-in Plugins** → Go to Dashboard → Plugins → Plugin Code Viewer
2. **Clone & Modify** → Click "Clone & Edit" on any built-in plugin
3. **Test Changes** → Install your plugin and generate a new wallpaper
4. **Check Examples** → All examples in this guide work as-is!

---

**Happy plugin development! ���**

Start with the simple "Hello World" example at the top, then explore the more advanced examples. You'll be creating amazing plugins in no time!
