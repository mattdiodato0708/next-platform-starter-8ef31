/**
 * Bot Start API Route
 * POST /api/bot/start - Start the bot with specified mode
 */

import { NextResponse } from 'next/server';
import { getBotOrchestrator } from '@/lib/bot-orchestrator';

export async function POST(request) {
  try {
    const body = await request.json();
    const mode = body.mode || 'manual'; // 'manual' or 'autonomous'
    
    if (!['manual', 'autonomous'].includes(mode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid mode. Must be "manual" or "autonomous"',
        },
        { status: 400 }
      );
    }

    const bot = getBotOrchestrator();
    await bot.start(mode);
    
    return NextResponse.json({
      success: true,
      message: `Bot started in ${mode} mode`,
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
