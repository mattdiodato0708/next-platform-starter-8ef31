/**
 * Bot Opportunities API Route
 * GET /api/bot/opportunities - Get all detected opportunities
 */

import { NextResponse } from 'next/server';
import { getBotOrchestrator } from '@/lib/bot-orchestrator';

export async function GET() {
  try {
    const bot = getBotOrchestrator();
    const opportunities = bot.getAllOpportunities();
    
    return NextResponse.json({
      success: true,
      data: opportunities,
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
