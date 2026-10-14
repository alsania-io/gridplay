/**
 * Board Detail Page
 * 
 * Displays a specific game board with real-time updates.
 * Users can claim cells, view scores, and see winners.
 */

"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import { useGameBoard } from '@/hooks/useGameBoard';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { GRID_SIZES } from '@/lib/constants';
import type { GameMode } from '@/types';

export default function BoardDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const { user } = useAuth();
  const { boardState, toggleCell, selectedCells, isLoading, error, clearSelection } =
    useGameBoard(id);
  const { toast } = useToast();

  // Handle cell selection
  const handleCellClick = async (row: number, col: number) => {
    if (!user) {
      toast({
        title: 'Please log in to claim cells',
        description: 'You need to be logged in to claim cells on a board.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Claim the cell via API
      const { data, error } = await supabase
        .from('cells')
        .upsert({
          board_id: id,
          row,
          col,
          owner_id: user.id,
          owner_name: user.email ?? 'Player',
          claimed_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to claim cell:', err);
      toast({
        title: 'Failed to claim cell',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  // Reset selection when board data changes
  useEffect(() => {
    if (boardState) {
      // Optional: Reset selection when board updates
    }
  }, [boardState]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-pulse h-10 w-32 bg-surface rounded mb-4" />
        <p className="text-muted-text">Loading board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-error">
        <h2 className="text-lg font-bold mb-4">Error Loading Board</h2>
        <p className="mb-4">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

   if (!boardState) {
     return (
       <div className="p-8 text-center">
         <h2 className="text-lg font-bold mb-4">Board Not Found</h2>
         <p className="mb-4">The requested board does not exist or has been removed.</p>
         <Button variant="outline" size="sm" onClick={() => window.history.back()}>
           Go Back
         </Button>
       </div>
     );
   }

   // Computed values for template
   const mode = boardState.config.mode as GameMode;
   const gridSize = GRID_SIZES[mode];
   const totalCells = gridSize.totalCells;
   const availableCells = boardState.cells.filter(cell => cell.owner === null).length;

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">{boardState.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="badge badge-secondary">
              {(boardState.mode ?? boardState.config.mode).toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-muted-text">
              • {boardState.config.pricePerCell / 100} per cell
            </span>
<span className="text-muted-text">
               • ${(boardState.config.pricePerCell * (totalCells - availableCells)) / 100} pot
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Teams */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center">
            <img
              src={boardState.config.awayTeam.logo || '/default-team-logo.png'}
              alt={boardState.config.awayTeam.name}
              className="w-24 h-24 mb-2"
            />
            <span className="font-medium">{boardState.config.awayTeam.name}</span>
          </div>
          
          <div className="text-2xl font-bold text-primary mx-6">@</div>
          
          <div className="flex flex-col items-center">
            <img
              src={boardState.config.homeTeam.logo || '/default-team-logo.png'}
              alt={boardState.config.homeTeam.name}
              className="w-24 h-24 mb-2"
            />
            <span className="font-medium">{boardState.config.homeTeam.name}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="mb-8">
<GameBoard
             board={boardState}
             mode={mode}
             onCellClick={handleCellClick}
             selectedCells={selectedCells}
             interactive={boardState.status === 'open' && availableCells > 0}
             showScores={true}
           />
        </div>

        {/* Score Display */}
        {boardState.rowScores.length > 0 && boardState.colScores.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 text-center bg-surface p-4 rounded-lg border border-border">
            <div>
              <p className="text-xs text-muted-text mb-1">Away Score</p>
              <p className="text-2xl font-bold">{boardState.awayScore ?? '?'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-text mb-1">Period</p>
              <p className="text-2xl font-bold">{boardState.period ?? '?'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-text mb-1">Home Score</p>
              <p className="text-2xl font-bold">{boardState.homeScore ?? '?'}</p>
            </div>
          </div>
        )}

        {/* Cell Selection Panel */}
        {selectedCells.length > 0 && (
          <div className="bg-surface p-4 rounded-lg border border-border mb-8">
            <h3 className="font-semibold mb-3">Selected Cells</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCells.map(({ row, col }) => (
                <span
                  key={`${row}-${col}`}
                  className="px-3 py-1 bg-primary/20 text-primary rounded text-xs"
                >
                  R{row + 1}-C{col + 1}
                </span>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={() => {
                // Clear selection
                // This would be handled by the hook
              }}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Status Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border">
            <div className="w-3 h-3 rounded-full">
              {boardState.status === 'open' && (
                <div className="bg-success animate-pulse" />
              )}
              {boardState.status === 'locked' && (
                <div className="bg-warning" />
              )}
              {boardState.status === 'in_progress' && (
                <div className="bg-error animate-pulse" />
              )}
              {boardState.status === 'completed' && (
                <div className="bg-info" />
              )}
            </div>
            <div>
              <p className="font-medium text-primary">{boardState.status.replace('_', ' ').toUpperCase()}</p>
              <p className="text-xs text-muted-text">
                {availableCells > 0
                  ? `${availableCells} cells available`
                  : 'Board is full'}
              </p>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <div className="flex justify-center">
          <Button
            variant={boardState.status === 'open' && availableCells > 0 && selectedCells.length > 0 ? 'primary' : 'ghost'}
            size="md"
            onClick={async () => {
              if (!user) {
                toast({
                  title: 'Please log in to claim cells',
                  description: 'You need to be logged in to claim cells on a board.',
                  variant: 'destructive',
                });
                return;
              }

              if (selectedCells.length === 0) {
                toast({
                  title: 'Please select cells to claim',
                  description: 'Click on cells to select them before claiming.',
                  variant: 'destructive',
                });
                return;
              }

              try {
                // Claim all selected cells
                const promises = selectedCells.map(({ row, col }) =>
                  supabase
                    .from('cells')
                    .upsert({
                      board_id: id,
                      row,
                      col,
                      owner_id: user.id,
                      owner_name: user.email ?? 'Player',
                      claimed_at: new Date().toISOString(),
                    })
                );

                const results = await Promise.all(promises);
                const errors = results.filter(r => r.error);

                if (errors.length > 0) {
                  throw errors[0].error;
                }

                toast({
                  title: 'Cells claimed successfully!',
                  description: `You've claimed ${selectedCells.length} cell${selectedCells.length > 1 ? 's' : ''}.`,
                });

                // Clear selection (would be handled by hook refetch)
              } catch (err) {
                console.error('Failed to claim cells:', err);
                toast({
                  title: 'Failed to claim cells',
                  description: err instanceof Error ? err.message : 'An error occurred',
                  variant: 'destructive',
                });
              }
            }}
            disabled={!user || selectedCells.length === 0 || boardState.status !== 'open' || availableCells === 0}
          >
            {selectedCells.length > 0 ? `Claim ${selectedCells.length} Cell${selectedCells.length > 1 ? 's' : ''}` : 'Select Cells to Claim'}
          </Button>
        </div>
      </main>
    </div>
  );
}