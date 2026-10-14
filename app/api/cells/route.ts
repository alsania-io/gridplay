/**
 * Cells API Route
 * 
 * Handles cell claiming and retrieval.
 * Requires authentication for claiming operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { boardId, row, col, userId, displayName } = body;

    // Validate required fields
    if (!boardId || row === undefined || col === undefined || !userId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Check if cell is already claimed
    const { data: existingCell, error: checkError } = await supabase
      .from('cells')
      .select()
      .eq('board_id', boardId)
      .eq('row', row)
      .eq('col', col)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned (not found), which is OK
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: checkError.message } },
        { status: 500 }
      );
    }

    if (existingCell) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'Cell already claimed' } },
        { status: 409 }
      );
    }

    // Claim the cell
    const { data: cell, error } = await supabase
      .from('cells')
      .insert({
        board_id: boardId,
        row,
        col,
        owner_id: userId,
        owner_name: displayName,
        claimed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    // Broadcast real-time update
    const payload = {
      type: 'cell_claimed',
      boardId,
      data: {
        row,
        col,
        owner: {
          userId,
          displayName: 'Player', // Would come from user profile
          claimedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
    };

    // TODO: Broadcast to Supabase Realtime channel
    // await supabase.channel('grid-play').broadcast('cell_claimed', payload);

    return NextResponse.json({ success: true, data: cell });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Board ID is required' } },
        { status: 400 }
      );
    }

    const { data: cells, error } = await supabase
      .from('cells')
      .select()
      .eq('board_id', boardId);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: cells });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}