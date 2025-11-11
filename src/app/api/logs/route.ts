import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const db = await getDatabase();
    
    // Get logs sorted by timestamp (newest first)
    const logs = await db
      .collection('logs')
      .find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection('logs').countDocuments();

    return NextResponse.json({
      logs: logs.map(log => ({
        ...log,
        _id: log._id.toString(),
      })),
      total,
      limit,
      skip,
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    const db = await getDatabase();
    
    if (id) {
      // Delete specific log
      const { ObjectId } = require('mongodb');
      await db.collection('logs').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true, message: 'Log deleted' });
    } else {
      // Delete all logs (use with caution!)
      const result = await db.collection('logs').deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deletedCount} logs` 
      });
    }

  } catch (error) {
    console.error('Error deleting logs:', error);
    return NextResponse.json(
      { error: 'Failed to delete logs' },
      { status: 500 }
    );
  }
}
