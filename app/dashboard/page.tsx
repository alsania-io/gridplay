/**
 * Dashboard Server Component
 *
 * Lists available boards for users to join or create new ones.
 * Uses server-side Supabase queries for board data.
 */

import React from 'react';
import { supabase } from '../../lib/supabase/client';
import GameCard from '../../components/GameCard';
import Button from '../../components/Button';
import { GameMode } from '../../types';
import { GAME_MODES } from '../../lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BoardSummary {
  id: string;
  name: string;
  mode: string;
  status: string;
  price_per_cell: string;
  total_cells: number;
  available_cells: number;
  home_team_name: string;
  away_team_name: string;
  created_at: string;
}

const toGameMode = (mode: string): GameMode => {
  const validModes = Object.keys(GAME_MODES) as GameMode[];
  return validModes.includes(mode as GameMode) ? (mode as GameMode) : 'TEN_BY_TEN';
};

export default async function Dashboard() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: boards, error } = await supabase
    .from('board_summary')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching boards:', error);
    return <div className="p-8 text-center text-red-500">Error loading boards.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">
        My Boards
      </h1>

      {!boards || boards.length === 0 ? (
        <p className="text-[#9CA3AF] mb-4">
          Log in to view boards.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board: BoardSummary) => (
            <GameCard
              key={board.id}
              board={{
                id: board.id,
                name: board.name,
                mode: toGameMode(board.mode),
                status: board.status as any,
                pricePerCell: Number(board.price_per_cell) || 0,
                totalCells: board.total_cells,
                availableCells: board.available_cells,
                homeTeam: {
                  id: 'home',
                  name: board.home_team_name,
                  abbreviation: (board.home_team_name?.split(' ')[0] || 'H').toUpperCase(),
                  logo: undefined,
                },
                awayTeam: {
                  id: 'away',
                  name: board.away_team_name,
                  abbreviation: (board.away_team_name?.split(' ')[1] || 'A').toUpperCase(),
                  logo: undefined,
                },
                createdBy: '',
              }}
              onClick={(boardId: string) => {
                window.location.href = `/board/${boardId}`;
              }}
              showJoinButton={board.status === 'open' && board.available_cells > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}