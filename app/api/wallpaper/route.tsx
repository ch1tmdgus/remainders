/**
 * Wallpaper Generation API Route
 * Minimalist Dot-Grid Redesign
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import {
  calculateDaysLeftInYear,
  getCurrentDayOfYear,
  getTotalDaysInCurrentYear,
} from '@/lib/calcs';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const themeColor = searchParams.get('themeColor') || 'FFFFFF';
    const width = parseInt(searchParams.get('width') || '1170');
    const height = parseInt(searchParams.get('height') || '2532');
    const viewMode = searchParams.get('viewMode') || 'year'; // Default to year for now as per request

    // Colors
    const BG_COLOR = '#111111';
    const TEXT_COLOR = '#666666';
    const PAST_COLOR = '#444444'; // Visible but dark
    const TODAY_COLOR = `#${themeColor}`; // User theme or white
    const FUTURE_COLOR = '#222222'; // Faint

    // Year Logic
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentDayOfYear = getCurrentDayOfYear();
    const daysLeft = calculateDaysLeftInYear();
    const totalDays = getTotalDaysInCurrentYear();

    // Grid Layout Config
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const COLUMNS = 3; // 3 Months per row
    const ROWS = 4;    // 4 Rows of months

    // Calculate dimensions
    // We want a clear 3x4 grid centered.
    // Each "cell" contains a month name and a 7x6 dot grid.

    // Spacing
    const paddingX = width * 0.1;
    const paddingY = height * 0.15; // More space at top/bottom
    const availableWidth = width - (paddingX * 2);
    const availableHeight = height - (paddingY * 2);

    const cellWidth = availableWidth / COLUMNS;
    const cellHeight = availableHeight / ROWS;

    // Dot Config
    const dotSize = Math.min(cellWidth / 10, 12); // Dynamic dot size
    const dotGap = dotSize * 0.8;
    const monthLabelSize = dotSize * 1.5;

    // Helper to get days in month
    const getDaysInMonth = (year: number, monthIndex: number) => {
      return new Date(year, monthIndex + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, monthIndex: number) => {
      return new Date(year, monthIndex, 1).getDay(); // 0 = Sun, etc.
    };

    let globalDayCounter = 0;

    // Build the grid
    const monthCells = MONTHS.map((monthName, monthIndex) => {
      const daysInMonth = getDaysInMonth(currentYear, monthIndex);
      const startDay = getFirstDayOfMonth(currentYear, monthIndex); // 0-6

      const dots = [];

      // We render a 7x6 grid (max needed for any month)
      for (let i = 0; i < 42; i++) {
        const dayNum = i - startDay + 1;

        let color = 'transparent';

        if (dayNum > 0 && dayNum <= daysInMonth) {
          globalDayCounter++;

          if (globalDayCounter < currentDayOfYear) {
            color = PAST_COLOR;
          } else if (globalDayCounter === currentDayOfYear) {
            color = TODAY_COLOR;
          } else {
            color = FUTURE_COLOR;
          }
        }

        // Only render dot if valid day
        if (dayNum > 0 && dayNum <= daysInMonth) {
          const row = Math.floor(i / 7);
          const col = i % 7;

          dots.push(
            <div
              key={`dot-${monthIndex}-${i}`}
              style={{
                position: 'absolute',
                left: col * (dotSize + dotGap),
                top: row * (dotSize + dotGap),
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          );
        }
      }

      // Calculate position of this month cell
      const colIndex = monthIndex % COLUMNS;
      const rowIndex = Math.floor(monthIndex / COLUMNS);

      const x = paddingX + (colIndex * cellWidth);
      const y = paddingY + (rowIndex * cellHeight);

      return (
        <div
          key={monthName}
          style={{
            position: 'absolute',
            left: x + (cellWidth - (7 * (dotSize + dotGap))) / 2, // Center in cell
            top: y,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Month Label */}
          <div style={{
            color: TEXT_COLOR,
            fontSize: monthLabelSize,
            marginBottom: dotSize,
            fontFamily: 'monospace',
            display: 'flex'
          }}>
            {monthName}
          </div>

          {/* Calendar Grid */}
          <div style={{ position: 'relative', width: 7 * (dotSize + dotGap), height: 6 * (dotSize + dotGap), display: 'flex' }}>
            {dots}
          </div>
        </div>
      );
    });

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: BG_COLOR,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Grid of Months */}
          <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%' }}>
            {monthCells}
          </div>

          {/* Footer Stats */}
          <div
            style={{
              position: 'absolute',
              bottom: height * 0.08,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: TODAY_COLOR,
              fontSize: width * 0.04,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            {daysLeft}d left · {Math.round((currentDayOfYear / totalDays) * 100)}%
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    console.error('Error generating wallpaper:', error);
    return new Response('Error generating wallpaper', { status: 500 });
  }
}
