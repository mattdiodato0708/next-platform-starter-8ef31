/**
 * Bot Stop API Route
 * POST /api/bot/stop - Stop the bot
 */

import { NextResponse } from 'next/server';
import { getBotOrchestrator } from '@/lib/bot-orchestrator';

export async function POST() {
  try {
    const bot = getBotOrchestrator();
    bot.stop();
    
    return NextResponse.json({
      success: true,
      message: 'Bot stopped successfully',
      data: bot.getStatus(),
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
