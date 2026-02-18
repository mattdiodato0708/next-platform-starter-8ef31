/**
 * Bot Execute API Route
 * POST /api/bot/execute - Manually execute an opportunity
 */

import { NextResponse } from 'next/server';
import { getBotOrchestrator } from '@/lib/bot-orchestrator';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, opportunityId } = body;
    
    if (!type || !opportunityId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type and opportunityId',
        },
        { status: 400 }
      );
    }

    if (!['crypto', 'sports', 'prediction'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type. Must be "crypto", "sports", or "prediction"',
        },
        { status: 400 }
      );
    }

    const bot = getBotOrchestrator();
    const result = await bot.executeManually(type, opportunityId);
    
    return NextResponse.json({
      success: true,
      data: result,
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
