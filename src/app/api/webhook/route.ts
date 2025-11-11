import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook data
    const body = await request.json().catch(() => ({}));
    
    // Get headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Optional: Verify webhook secret if configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = request.headers.get('x-webhook-secret') || 
                            request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (providedSecret !== webhookSecret) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Create log entry
    const logEntry = {
      timestamp: new Date(),
      method: request.method,
      headers,
      body,
      query: Object.fromEntries(request.nextUrl.searchParams),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Save to MongoDB
    const db = await getDatabase();
    const result = await db.collection('logs').insertOne(logEntry);

    return NextResponse.json({
      success: true,
      message: 'Webhook received and logged',
      id: result.insertedId,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const logEntry = {
      timestamp: new Date(),
      method: request.method,
      headers,
      body: null,
      query: Object.fromEntries(request.nextUrl.searchParams),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const db = await getDatabase();
    await db.collection('logs').insertOne(logEntry);

    return NextResponse.json({
      success: true,
      message: 'GET request logged',
      note: 'This endpoint primarily accepts POST requests',
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing GET request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
