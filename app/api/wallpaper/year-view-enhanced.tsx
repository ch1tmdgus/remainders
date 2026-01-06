/**
 * Year View Component - Enhanced with Customization Support
 * 
 * Renders 365/366 dots in a 12-month calendar grid showing current year progress.
 * Now supports custom colors, typography, layout, text elements, and plugin additions.
 */

import { TextElement } from '@/lib/types';
import {
  calculateDaysLeftInYear,
  getCurrentDayOfYear,
  getTotalDaysInCurrentYear,
} from '@/lib/calcs';

interface YearViewProps {
  width: number;
  height: number;
  isMondayFirst: boolean;
  colors?: {
    background: string;
    past: string;
    current: string;
    future: string;
    text: string;
  };
  typography?: {
    fontFamily: string;
    fontSize: number;
    statsVisible: boolean;
  };
  layout?: {
    topPadding: number;
    bottomPadding: number;
    sidePadding: number;
    dotSpacing: number;
  };
  textElements?: TextElement[];
  pluginElements?: any[];
  currentDate?: Date;
}

export default function YearView({
  width,
  height,
  isMondayFirst,
  colors = {
    background: '#1a1a1a',
    past: '#FFFFFF',
    current: '#FF6B35',
    future: '#404040',
    text: '#888888',
  },
  typography = {
    fontFamily: 'monospace',
    fontSize: 0.035,
    statsVisible: true,
  },
  layout = {
    topPadding: 0.25,
    bottomPadding: 0.15,
    sidePadding: 0.18,
    dotSpacing: 0.7,
  },
  textElements = [],
  pluginElements = [],
  currentDate = new Date(),
}: YearViewProps) {
  // Year Logic
  const date = currentDate;
  const currentYear = date.getFullYear();
  const currentDayOfYear = getCurrentDayOfYear();
  const daysLeft = calculateDaysLeftInYear();
  const totalDays = getTotalDaysInCurrentYear();

  // Grid Layout Config
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const COLUMNS = 3;
  const ROWS = 4;

  // Layout Calculations
  const SAFE_AREA_TOP = height * layout.topPadding;
  const SAFE_AREA_BOTTOM = height * layout.bottomPadding;
  const SAFE_HEIGHT = height - SAFE_AREA_TOP - SAFE_AREA_BOTTOM;

  const paddingX = width * layout.sidePadding;
  const availableWidth = width - paddingX * 2;
  const cellWidth = availableWidth / COLUMNS;

  const dotSize = Math.min(cellWidth / 7, 20);
  const dotGap = dotSize * layout.dotSpacing;
  const monthLabelSize = dotSize * 1.6;

  const monthBlockHeight = monthLabelSize + dotSize + 6 * dotSize + 5 * dotGap;
  const rowGap = monthLabelSize * 1.0;

  const statsFontSize = monthLabelSize;
  const statsMargin = rowGap * 4.0;

  const gridHeight = ROWS * monthBlockHeight + (ROWS - 1) * rowGap;
  const totalContentHeight = gridHeight + statsMargin + statsFontSize;

  const startY = SAFE_AREA_TOP + (SAFE_HEIGHT - totalContentHeight) / 2;
  const statsY = startY + gridHeight + statsMargin;

  // Helper to get days in month
  const getDaysInMonth = (year: number, monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, monthIndex: number) => {
    if (isMondayFirst) {
      const day = new Date(year, monthIndex, 1).getDay();
      return day === 0 ? 6 : day - 1;
    }
    return new Date(year, monthIndex, 1).getDay();
  };

  let globalDayCounter = 0;

  // Build month grids
  const monthCells = MONTHS.map((monthName, monthIndex) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
    const startDay = getFirstDayOfMonth(currentYear, monthIndex);

    const dots = [];

    // Render 7x6 grid (42 cells)
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startDay + 1;
      let color = 'transparent';

      if (dayNum > 0 && dayNum <= daysInMonth) {
        globalDayCounter++;
        if (globalDayCounter < currentDayOfYear) {
          color = colors.past;
        } else if (globalDayCounter === currentDayOfYear) {
          color = colors.current;
        } else {
          color = colors.future;
        }
      }

      if (dayNum > 0 && dayNum <= daysInMonth) {
        const row = Math.floor(i / 7);
        const col = i % 7;

        dots.push(
          <div
            key={`dot-${monthIndex}-${i}`}
            style={{
              position: 'absolute',
              left: `${col * (dotSize + dotGap)}px`,
              top: `${row * (dotSize + dotGap)}px`,
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
        );
      }
    }

    // Position of month cell
    const colIndex = monthIndex % COLUMNS;
    const rowIndex = Math.floor(monthIndex / COLUMNS);

    const x = paddingX + colIndex * cellWidth;
    const y = startY + rowIndex * (monthBlockHeight + rowGap);

    return (
      <div
        key={monthName}
        style={{
          position: 'absolute',
          left: `${x + (cellWidth - 7 * (dotSize + dotGap)) / 2}px`,
          top: `${y}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            color: colors?.text || '#888888',
            fontSize: `${monthLabelSize}px`,
            marginBottom: `${dotSize}px`,
            fontFamily: typography?.fontFamily || 'monospace',
            display: 'flex',
          }}
        >
          {monthName}
        </div>
        <div
          style={{
            position: 'relative',
            width: `${7 * (dotSize + dotGap)}px`,
            height: `${6 * (dotSize + dotGap)}px`,
            display: 'flex',
          }}
        >
          {dots}
        </div>
      </div>
    );
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors?.background || '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%' }}>
        {monthCells}
      </div>

      {/* Stats Footer */}
      {typography.statsVisible && (
        <div
          style={{
            position: 'absolute',
            top: `${statsY}px`,
            left: '0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: `${statsFontSize}px`,
            fontFamily: typography?.fontFamily || 'monospace',
          }}
        >
          <span style={{ color: colors?.current || '#FF6B35' }}>{daysLeft}d left</span>
          <span style={{ color: colors?.text || '#888888', margin: '0px 8px' }}>·</span>
          <span style={{ color: colors?.text || '#888888' }}>{Math.round((currentDayOfYear / totalDays) * 100)}%</span>
        </div>
      )}

      {/* Custom Text Elements */}
      {textElements.map((element) => {
        if (!element.visible || element.content == null) return null;
        
        const style: any = {
          position: 'absolute',
          left: `${element.x}%`,
          top: `${element.y}%`,
          fontSize: `${element.fontSize || 16}px`,
          fontFamily: element.fontFamily || typography?.fontFamily || 'monospace',
          color: element.color || colors?.text || '#888888',
        };

        // Handle alignment for percentage-based positioning
        const align = element.align || 'left';
        if (align === 'center') {
          style.transform = 'translate(-50%, -50%)';
        } else if (align === 'right') {
          style.transform = 'translate(-100%, -50%)';
        } else {
          style.transform = 'translateY(-50%)';
        }

        return (
          <div key={element.id} style={style}>
            {String(element.content).trim()}
          </div>
        );
      })}

      {/* Plugin-added Elements */}
      {pluginElements.map((element, index) => {
        if (element.type === 'text' && element.content != null) {
          const contentStr = String(element.content || '').trim();
          
          if (!contentStr) return null;

          const style: any = {
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            fontSize: `${element.fontSize || 16}px`,
            color: element.color || colors?.text || '#888888',
            fontFamily: element.fontFamily || typography?.fontFamily || 'monospace',
          };

          // Handle alignment
          if (element.align === 'center') {
            style.transform = 'translateX(-50%)';
          } else if (element.align === 'right') {
            style.transform = 'translateX(-100%)';
          }

          if (typeof element.maxWidth === 'number') {
            style.maxWidth = `${element.maxWidth}px`;
          }
          
          return (
            <div key={`plugin-${index}`} style={style}>
              {contentStr}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
