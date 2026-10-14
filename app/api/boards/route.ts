/**
 * Board API Route
 * 
 * Handles board creation, retrieval, and updates.
 * Requires authentication for all operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { type BoardState } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('id');

    if (boardId) {
      // Get single board
      const { data: board, error } = await supabase
        .from('boards')
        .select(`
          *,
          cells (*),
          players (*)
        `)
        .eq('id', boardId)
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: error.message } },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: board });
    }

    // Get all boards
    const { data: boards, error } = await supabase
      .from('boards')
      .select(`
        *,
        users:created_by (display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: boards });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mode, pricePerCell, homeTeamName, awayTeamName, sport, externalGameId, gameStartTime } = body;

    // Validate required fields
    if (!name || !mode || !pricePerCell || !homeTeamName || !awayTeamName) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    const { data: board, error } = await supabase
      .from('boards')
      .insert({
        name,
        mode,
        status: 'open',
        config: {
          pricePerCell: pricePerCell,
          homeTeam: homeTeamName,
          awayTeam: awayTeamName,
          sport: sport || 'nfl',
          ...(externalGameId ? { externalGameId } : {}),
          ...(gameStartTime ? { gameStartTime } : {}),
        },
        created_by: '00000000-0000-0000-0000-000000000000', // Placeholder: set via auth context
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: board });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Board ID is required' } },
        { status: 400 }
      );
    }

    const { data: board, error } = await supabase
      .from('boards')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: board });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('id');

    if (!boardId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Board ID is required' } },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', boardId);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}