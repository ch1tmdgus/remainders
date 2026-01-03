/**
 * Core TypeScript types for Chronos wallpaper generator
 * 
 * This file defines all shared interfaces and types used throughout the application.
 * Keeping types in a central location ensures consistency and makes the codebase
 * easier to maintain and understand.
 */

/**
 * Represents information about a specific phone model
 * Used to generate wallpapers with the correct dimensions for each device
 */
export interface DeviceModel {
  /** Brand name (e.g., "Apple", "Samsung", "Google") */
  brand: string;
  
  /** Full model name (e.g., "iPhone 15 Pro", "Galaxy S24 Ultra") */
  model: string;
  
  /** Screen width in pixels */
  width: number;
  
  /** Screen height in pixels */
  height: number;
}

/**
 * View mode for the wallpaper visualization
 * - 'year': Shows only the current year (52 weeks)
 * - 'life': Shows entire life span (4160 weeks for 80 years)
 */
export type ViewMode = 'year' | 'life';

/**
 * User's profile data stored in localStorage
 * Contains all information needed to generate a personalized wallpaper
 */
export interface UserProfile {
  /** Birth date in YYYY-MM-DD format (ISO 8601 date string) */
  birthDate: string;
  
  /** Theme color in hex format (e.g., "#FF6B35") */
  themeColor: string;
  
  /** Selected phone device information */
  device: {
    /** Device brand (e.g., "Apple", "Samsung") */
    brand: string;
    
    /** Full model name matching DeviceModel.model */
    modelName: string;
    
    /** Screen width in pixels */
    width: number;
    
    /** Screen height in pixels */
    height: number;
  };
  
  /** Visualization mode: year or life view */
  viewMode: ViewMode;
}

/**
 * Parameters passed to the wallpaper generation API
 * These are extracted from UserProfile and sent as URL parameters
 */
export interface WallpaperParams {
  /** Birth date in YYYY-MM-DD format */
  birthDate: string;
  
  /** Theme color in hex format (without # symbol for URL encoding) */
  themeColor: string;
  
  /** Wallpaper width in pixels */
  width: number;
  
  /** Wallpaper height in pixels */
  height: number;
  
  /** View mode: 'year' or 'life' */
  viewMode: ViewMode;
}
