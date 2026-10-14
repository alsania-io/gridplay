/**
 * Board Creation Page
 * 
 * Form for creating new game boards with team names, price per cell,
 * and board mode selection.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { GAME_MODES, BOARD_STATUS, ENTRY_FEES, SCORE_VALUES, SPORTS_LEAGUES } from '@/lib/constants';
import { type BoardConfig, type BoardTeam } from '@/types';

// Default teams for NFL games
const DEFAULT_TEAMS = [
  { name: 'Kansas City Chiefs', abbreviation: 'KC', logo: '/teams/nfl/chiefs.svg' },
  { name: 'San Francisco 49ers', abbreviation: 'SF', logo: '/teams/nfl/49ers.svg' },
  { name: 'Dallas Cowboys', abbreviation: 'DAL', logo: '/teams/nfl/cowboys.svg' },
  { name: 'Philadelphia Eagles', abbreviation: 'PHI', logo: '/teams/nfl/eagles.svg' },
  { name: 'Buffalo Bills', abbreviation: 'BUF', logo: '/teams/nfl/bills.svg' },
  { name: 'Miami Dolphins', abbreviation: 'MIA', logo: '/teams/nfl/dolphins.svg' },
  { name: 'Baltimore Ravens', abbreviation: 'BAL', logo: '/teams/nfl/ravens.svg' },
  { name: 'Jacksonville Jaguars', abbreviation: 'JAX', logo: '/teams/nfl/jaguars.svg' },
  { name: 'Detroit Lions', abbreviation: 'DET', logo: '/teams/nfl/lions.svg' },
  { name: 'Los Angeles Rams', abbreviation: 'LAR', logo: '/teams/nfl/rams.svg' },
  { name: 'Minnesota Vikings', abbreviation: 'MIN', logo: '/teams/nfl/vikings.svg' },
  { name: 'Green Bay Packers', abbreviation: 'GB', logo: '/teams/nfl/packers.svg' },
  { name: 'Cincinnati Bengals', abbreviation: 'CIN', logo: '/teams/nfl/bengals.svg' },
  { name: 'Tampa Bay Buccaneers', abbreviation: 'TB', logo: '/teams/nfl/buccaneers.svg' },
  { name: 'Seattle Seahawks', abbreviation: 'SEA', logo: '/teams/nfl/seahawks.svg' },
  { name: 'Las Vegas Raiders', abbreviation: 'LV', logo: '/teams/nfl/raiders.svg' },
  { name: 'Los Angeles Chargers', abbreviation: 'LAC', logo: '/teams/nfl/chargers.svg' },
  { name: 'Pittsburgh Steelers', abbreviation: 'PIT', logo: '/teams/nfl/steelers.svg' },
  { name: 'New York Jets', abbreviation: 'NYJ', logo: '/teams/nfl/jets.svg' },
  { name: 'Indianapolis Colts', abbreviation: 'IND', logo: '/teams/nfl/colts.svg' },
  { name: 'New England Patriots', abbreviation: 'NE', logo: '/teams/nfl/patriots.svg' },
  { name: 'Tennessee Titans', abbreviation: 'TEN', logo: '/teams/nfl/titans.svg' },
  { name: 'New Orleans Saints', abbreviation: 'NO', logo: '/teams/nfl/saints.svg' },
  { name: 'Atlanta Falcons', abbreviation: 'ATL', logo: '/teams/nfl/falcons.svg' },
  { name: 'Carolina Panthers', abbreviation: 'CAR', logo: '/teams/nfl/panthers.svg' },
  { name: 'Chicago Bears', abbreviation: 'CHI', logo: '/teams/nfl/bears.svg' },
  { name: 'Cleveland Browns', abbreviation: 'CLE', logo: '/teams/nfl/browns.svg' },
  { name: 'Houston Texans', abbreviation: 'HOU', logo: '/teams/nfl/texans.svg' },
  { name: 'Jacksonville Jaguars', abbreviation: 'JAX', logo: '/teams/nfl/jaguars.svg' },
  { name: 'Denver Broncos', abbreviation: 'DEN', logo: '/teams/nfl/broncos.svg' },
  { name: 'Arizona Cardinals', abbreviation: 'ARI', logo: '/teams/nfl/cardinals.svg' },
  { name: 'New York Giants', abbreviation: 'NYG', logo: '/teams/nfl/giants.svg' },
  { name: 'Dallas Cowboys', abbreviation: 'DAL', logo: '/teams/nfl/cowboys.svg' },
];

// Fallback logo
const FALLBACK_LOGO = '/default-team-logo.png';

export default function CreateBoard() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [mode, setMode] = useState<keyof typeof GAME_MODES>('TEN_BY_TEN');
  const [pricePerCell, setPricePerCell] = useState<number>(ENTRY_FEES.STANDARD); // in dollars
  const [homeTeam, setHomeTeam] = useState('Kansas City Chiefs');
  const [awayTeam, setAwayTeam] = useState('San Francisco 49ers');
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeamName, setAwayTeamName] = useState('');
  const [customHomeLogo, setCustomHomeLogo] = useState('');
  const [customAwayLogo, setCustomAwayLogo] = useState('');
  const [selectedSport, setSelectedSport] = useState<keyof typeof SPORTS_LEAGUES>('NFL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selected team
  useEffect(() => {
    if (homeTeam) {
      setHomeTeamName(homeTeam);
    }
  }, [homeTeam]);

  useEffect(() => {
    if (awayTeam) {
      setAwayTeamName(awayTeam);
    }
  }, [awayTeam]);

  // Get available teams based on selected sport
  const availableTeams =
    selectedSport === 'NFL'
      ? DEFAULT_TEAMS.filter(t => t.abbreviation !== homeTeam && t.abbreviation !== awayTeam)
      : DEFAULT_TEAMS.filter(t => t.abbreviation !== homeTeam && t.abbreviation !== awayTeam);

  // Format price per cell
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(pricePerCell);

  // Handle team selection
  const handleTeamSelect = (teamName: string) => {
    setAwayTeam(teamName);
    setAwayTeamName(teamName);
  };

  // Validate form
  const isValid = name.length >= 3 && homeTeam && awayTeam;

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      toast({
        title: 'Please log in to create a board',
        description: 'You need to be logged in to create a board.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValid) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine mode key
      const modeKey =
        mode === 'TEN_BY_TEN' ? '10x10' : mode === 'FIVE_BY_FIVE' ? '5x5' : 'SHOTGUN';

      // Create board (normalized schema: config is JSONB)
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({
          name,
          mode: modeKey,
          status: BOARD_STATUS.DRAFT,
          config: {
            pricePerCell: Math.round(pricePerCell * 100), // cents
            homeTeam: homeTeam || homeTeamName,
            awayTeam: awayTeam || awayTeamName,
            sport: selectedSport,
          },
          created_by: user.id,
        })
        .select()
        .single();

      if (boardError) throw boardError;

      toast({
        title: 'Board created!',
        description: `Your board "${name}" has been created.`,
      });

      // Redirect to board page
      router.push(`/board/${board.id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Failed to create board',
        description: err instanceof Error ? err.message : 'An error occurred while creating the board.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">Create New Board</h1>
          <p className="text-muted-text">Set up your game board and invite friends to play.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

            <div className="space-y-4">
              {/* Board Name */}
              <div>
                <label htmlFor="board-name" className="block text-sm font-medium text-foreground mb-2">
                  Board Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="board-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Super Bowl LIX Squares"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mode Selection */}
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-foreground mb-2">
                  Game Mode <span className="text-error">*</span>
                </label>
                <select
                  id="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as keyof typeof GAME_MODES)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="TEN_BY_TEN">Standard (10×10)</option>
                  <option value="FIVE_BY_FIVE">Quick (5×5)</option>
                  <option value="SHOTGUN">Shotgun (2×9)</option>
                </select>
                <p className="mt-1 text-xs text-muted-text">
                  {GAME_MODES[mode].gridSize.rows}×{GAME_MODES[mode].gridSize.cols} grid —{' '}
                  {GAME_MODES[mode].totalCells} cells
                </p>
              </div>

              {/* Sport Selection */}
              <div>
                <label htmlFor="sport" className="block text-sm font-medium text-foreground mb-2">
                  Sport <span className="text-error">*</span>
                </label>
                <select
                  id="sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value as keyof typeof SPORTS_LEAGUES)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NFL">NFL</option>
                  <option value="NCAA_FOOTBALL">College Football</option>
                </select>
              </div>
            </div>
          </section>

          {/* Teams */}
          <section className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Teams</h2>

            <div className="space-y-4">
              {/* Away Team */}
              <div>
                <label htmlFor="away-team" className="block text-sm font-medium text-foreground mb-2">
                  Away Team <span className="text-error">*</span>
                </label>
                <select
                  id="away-team"
                  value={awayTeam}
                  onChange={(e) => handleTeamSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEFAULT_TEAMS.map((team) => (
                    <option key={team.name} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Home Team */}
              <div>
                <label htmlFor="home-team" className="block text-sm font-medium text-foreground mb-2">
                  Home Team <span className="text-error">*</span>
                </label>
                <select
                  id="home-team"
                  value={homeTeam}
                  onChange={(e) => {
                    setHomeTeam(e.target.value);
                    setHomeTeamName(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEFAULT_TEAMS.map((team) => (
                    <option key={team.name} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Team Names */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="custom-home-name" className="block text-sm font-medium text-foreground mb-2">
                    Custom Home Team Name (optional)
                  </label>
                  <input
                    type="text"
                    id="custom-home-name"
                    value={homeTeamName}
                    onChange={(e) => setHomeTeamName(e.target.value)}
                    placeholder="Custom home team name"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="custom-away-name" className="block text-sm font-medium text-foreground mb-2">
                    Custom Away Team Name (optional)
                  </label>
                  <input
                    type="text"
                    id="custom-away-name"
                    value={awayTeamName}
                    onChange={(e) => setAwayTeamName(e.target.value)}
                    placeholder="Custom away team name"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Price Per Cell */}
          <section className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Price Per Cell</h2>
            <p className="text-muted-text mb-4">
              Set the entry fee for each cell on the board. This determines the total prize pool.
            </p>

            <div className="space-y-4">
              {/* Preset Options */}
              <div className="grid grid-cols-4 gap-3">
                {[ENTRY_FEES.BUDGET, ENTRY_FEES.STANDARD, ENTRY_FEES.PREMIUM, ENTRY_FEES.VIP].map((price) => (
                  <button
                    type="button"
                    key={price}
                    onClick={() => setPricePerCell(price)}
                    className={`px-4 py-3 rounded-lg border ${
                      pricePerCell === price
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {formattedPrice}
                  </button>
                ))}
              </div>

              {/* Custom Price */}
              <div>
                <label htmlFor="custom-price" className="block text-sm font-medium text-foreground mb-2">
                  Custom Price (optional)
                </label>
                <input
                  type="number"
                  id="custom-price"
                  min="0"
                  step="0.01"
                  value={pricePerCell}
                  onChange={(e) => setPricePerCell(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Prize Pool Preview */}
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <span className="text-muted-text">Total Prize Pool</span>
                <span className="text-2xl font-bold text-primary">
                  {formattedPrice} × {GAME_MODES[mode].totalCells} ={' '}
                  <span className="text-accent">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(pricePerCell * GAME_MODES[mode].totalCells)}
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}