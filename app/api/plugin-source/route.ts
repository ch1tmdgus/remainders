import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * API endpoint to retrieve plugin source code
 * GET /api/plugin-source?id=<plugin-id>
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pluginId = searchParams.get('id');

    if (!pluginId) {
      return NextResponse.json(
        { error: 'Plugin ID is required' },
        { status: 400 }
      );
    }

    // Map plugin IDs to file paths
    const pluginPaths: Record<string, string> = {
      'quotes-plugin': 'lib/plugins/quotes-plugin.ts',
      'timezone-plugin': 'lib/plugins/timezone-plugin.ts',
      'moon-phase-plugin': 'lib/plugins/moon-phase-plugin.ts',
      'habit-tracker-plugin': 'lib/plugins/habit-tracker-plugin.ts',
    };

    const relativePath = pluginPaths[pluginId];
    
    if (!relativePath) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Read the plugin file from the project root
    const filePath = join(process.cwd(), relativePath);
    const source = await readFile(filePath, 'utf-8');

    return NextResponse.json({ source });
  } catch (error: any) {
    console.error('Error reading plugin source:', error);
    return NextResponse.json(
      { error: 'Failed to read plugin source', details: error.message },
      { status: 500 }
    );
  }
}
