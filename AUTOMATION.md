# Setting as Lock Screen

## iOS Automation
**Enable daily wallpaper updates:**

### 1. Create Automation
- Open **Shortcuts** app → **Automation** tab → New Automation
- Select **Time of Day** (e.g. 09:00 AM) → Select **Run Immediately** (Important)

### 2. Add Actions

**ACTION 1: Get Contents of URL**
- Paste your unique URL

**ACTION 2: Set Wallpaper**
- **Important:** Tap the arrow ⌄ on this action and turn OFF "Show Preview"

---

## Android Automation
**Enable daily wallpaper updates:**

### 1. Install MacroDroid
- Download **[MacroDroid](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid&hl=en)** from the Play Store

### 2. Create Macro

**TRIGGER: Time of Day**
- Set to 09:00 AM (or preferred time)

**ACTION 1: HTTP Request**
- Method: GET, Paste URL
- Check "Save response to file"

**ACTION 2: Set Wallpaper**
- "Select File" (Choose the file from Action 1)
