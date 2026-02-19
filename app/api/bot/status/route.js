/**
 * Bot Status API Route
 * GET /api/bot/status - Get bot status and statistics
 */

import { NextResponse } from 'next/server';
import { getBotOrchestrator } from '@/lib/bot-orchestrator';

export async function GET() {
  try {
    const bot = getBotOrchestrator();
    const status = bot.getStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
