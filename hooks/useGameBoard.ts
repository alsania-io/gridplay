/**
 * GridPlay useGameBoard Hook
 * 
 * Manages game board state, cell selection/claiming, and winner calculation.
 * Implements Fisher-Yates shuffle for random number assignment.
 */

"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  BoardCell, 
  BoardState, 
  GameMode, 
  CellOwner,
  BoardTeam,
  BoardConfig,
} from '../types';
import { 
  GAME_MODES, 
  GRID_SIZES, 
  BOARD_STATUS,
  SCORE_RANGE,
} from '../lib/constants';

export interface UseGameBoardOptions {
  /** Board ID to load from the backend */
  boardId?: string;
  /** Game mode (shotgun, 5x5, 10x10) */
  mode?: GameMode;
  /** Initial board state (if loading from DB) */
  initialState?: BoardState;
  /** Current user ID */
  userId?: string;
  /** Current user display name */
  displayName?: string;
  /** Callback when a cell is claimed */
  onCellClaim?: (row: number, col: number) => void | Promise<void>;
  /** Callback when game starts */
  onGameStart?: () => void | Promise<void>;
}

export interface UseGameBoardReturn {
  /** Board state */
  boardState: BoardState;
  /** All cells in the grid */
  cells: BoardCell[];
  /** Row score headers (0-9 shuffled) */
  rowScores: number[];
  /** Column score headers (0-9 shuffled) */
  colScores: number[];
  /** Currently selected cells */
  selectedCells: Array<{ row: number; col: number }>;
  /** Whether the board is locked */
  isLocked: boolean;
  /** Whether the game has started */
  hasStarted: boolean;
  /** Whether the game is completed */
  isCompleted: boolean;
  /** Available cells count */
  availableCells: number;
  /** Claimed cells count */
  claimedCells: number;
  /** Select a cell */
  selectCell: (row: number, col: number) => void;
  /** Deselect a cell */
  deselectCell: (row: number, col: number) => void;
  /** Toggle cell selection */
  toggleCell: (row: number, col: number) => void;
  /** Claim selected cells for current user */
  claimSelectedCells: () => Promise<void>;
  /** Claim a specific cell */
  claimCell: (row: number, col: number) => Promise<void>;
  /** Generate random scores using Fisher-Yates shuffle */
  generateScores: () => void;
  /** Calculate winners based on final scores */
  calculateWinners: (homeScore: number, awayScore: number) => Array<{ row: number; col: number }>;
  /** Lock the board */
  lockBoard: () => void;
  /** Start the game */
  startGame: () => void;
  /** Complete the game */
  completeGame: () => void;
  /** Reset the board */
  resetBoard: () => void;
  /** Get cell at position */
  getCell: (row: number, col: number) => BoardCell | undefined;
  /** Check if cell is selected */
  isCellSelected: (row: number, col: number) => boolean;
  /** Check if cell is claimed */
  isCellClaimed: (row: number, col: number) => boolean;
  /** Get winning cells */
  winningCells: BoardCell[];
  /** Whether the board is loading from the backend */
  isLoading: boolean;
  /** Error encountered while loading the board */
  error: Error | null;
  /** Clear the current cell selection */
  clearSelection: () => void;
}

/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array (does not mutate original)
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate initial cells for a game board
 */
function generateInitialCells(mode: GameMode): BoardCell[] {
  const { rows, cols } = GRID_SIZES[mode];
  const cells: BoardCell[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        row,
        col,
        owner: null,
        homeScore: null,
        awayScore: null,
        isWinner: false,
      });
    }
  }

  return cells;
}

/**
 * Generate default board config
 */
function generateDefaultConfig(mode: GameMode): BoardConfig {
  const defaultTeam: BoardTeam = {
    id: 'default',
    name: 'Team',
    abbreviation: 'TM',
  };

  return {
    mode,
    pricePerCell: 100, // $1.00 in cents
    entryFee: 100, // $1.00 in cents
    prizePool: 0, // Will be calculated based on entries
    startTime: new Date().toISOString(),
    homeTeam: { ...defaultTeam, id: 'home', name: 'Home Team', abbreviation: 'HOME' },
    awayTeam: { ...defaultTeam, id: 'away', name: 'Away Team', abbreviation: 'AWAY' },
    sport: 'nfl',
  };
}

/**
 * Custom hook for managing game board state
 * 
 * @example
 * ```tsx
 * const gameBoard = useGameBoard({
 *   mode: '10x10',
 *   userId: 'user-123',
 *   displayName: 'John Doe',
 * });
 * 
 * // Select cells
 * gameBoard.toggleCell(0, 0);
 * gameBoard.toggleCell(1, 1);
 * 
 * // Claim selected cells
 * await gameBoard.claimSelectedCells();
 * 
 * // Generate random scores
 * gameBoard.generateScores();
 * 
 * // Calculate winners
 * const winners = gameBoard.calculateWinners(21, 14);
 * ```
 */
export function useGameBoard(
  optionsOrId: UseGameBoardOptions | string
): UseGameBoardReturn {
  const options: UseGameBoardOptions =
    typeof optionsOrId === 'string' ? { boardId: optionsOrId } : optionsOrId;

  const {
    mode: modeOption,
    boardId,
    initialState,
    userId,
    displayName,
    onCellClaim,
    onGameStart,
  } = options;

  const mode: GameMode = modeOption ?? 'TEN_BY_TEN';
  const gridSize = GRID_SIZES[mode];

  const [isLoading, setIsLoading] = useState<boolean>(!!boardId);
  const [error, setError] = useState<Error | null>(null);

  // Initialize state
  const [boardState, setBoardState] = useState<BoardState>(() => {
    if (initialState) {
      return initialState;
    }

    return {
      id: '',
      name: `New ${mode.toUpperCase()} Board`,
      config: generateDefaultConfig(mode),
      status: BOARD_STATUS.OPEN,
      cells: generateInitialCells(mode),
      rowScores: [],
      colScores: [],
      createdBy: userId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);

  // Load board from the backend when a boardId is provided
  useEffect(() => {
    if (!boardId || initialState) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadBoard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { supabase } = await import('../lib/supabase/client');
        const { data, error: fetchError } = await supabase
          .from('boards')
          .select('*')
          .eq('id', boardId)
          .single();

        if (fetchError) throw fetchError;
        if (cancelled) return;

        if (data) {
          const loadedMode = (data.mode as GameMode) in GRID_SIZES ? (data.mode as GameMode) : mode;
          const size = GRID_SIZES[loadedMode];
          const cfg = (data.config ?? {}) as Record<string, unknown>;
          const pricePerCell = Number(cfg.pricePerCell ?? 0);
          const homeName = typeof cfg.homeTeam === 'string' ? cfg.homeTeam : 'Home Team';
          const awayName = typeof cfg.awayTeam === 'string' ? cfg.awayTeam : 'Away Team';
          const defaultTeam = { id: 'team', name: 'Team', abbreviation: 'TM' };

          setBoardState({
            id: data.id,
            name: data.name,
            config: {
              mode: loadedMode,
              pricePerCell,
              entryFee: pricePerCell,
              prizePool: pricePerCell * size.totalCells,
              startTime: data.created_at ?? new Date().toISOString(),
              homeTeam: { ...defaultTeam, id: 'home', name: homeName },
              awayTeam: { ...defaultTeam, id: 'away', name: awayName },
              sport: 'nfl',
            },
            status: (data.status as BoardState['status']) ?? BOARD_STATUS.OPEN,
            cells: generateInitialCells(loadedMode),
            rowScores: (data.row_scores as number[]) ?? [],
            colScores: (data.col_scores as number[]) ?? [],
            createdBy: data.created_by ?? '',
            createdAt: data.created_at ?? new Date().toISOString(),
            updatedAt: data.updated_at ?? new Date().toISOString(),
            availableCells: size.totalCells,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load board'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadBoard();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Clear current selection
  const clearSelection = useCallback(() => {
    setSelectedCells([]);
  }, []);

  // Derived state
  const cells = useMemo(() => boardState.cells, [boardState.cells]);
  const rowScores = useMemo(() => boardState.rowScores, [boardState.rowScores]);
  const colScores = useMemo(() => boardState.colScores, [boardState.colScores]);

  const isLocked = useMemo(() => 
    boardState.status === BOARD_STATUS.LOCKED || 
    boardState.status === BOARD_STATUS.IN_PROGRESS ||
    boardState.status === BOARD_STATUS.COMPLETED,
    [boardState.status]
  );

  const hasStarted = useMemo(() => 
    boardState.status === BOARD_STATUS.IN_PROGRESS ||
    boardState.status === BOARD_STATUS.COMPLETED,
    [boardState.status]
  );

  const isCompleted = useMemo(() => 
    boardState.status === BOARD_STATUS.COMPLETED,
    [boardState.status]
  );

  const availableCells = useMemo(() => 
    cells.filter(cell => cell.owner === null).length,
    [cells]
  );

  const claimedCells = useMemo(() => 
    cells.filter(cell => cell.owner !== null).length,
    [cells]
  );

  const winningCells = useMemo(() => 
    cells.filter(cell => cell.isWinner),
    [cells]
  );

  // Get cell at position
  const getCell = useCallback((row: number, col: number): BoardCell | undefined => {
    return cells.find(cell => cell.row === row && cell.col === col);
  }, [cells]);

  // Check if cell is selected
  const isCellSelected = useCallback((row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  }, [selectedCells]);

  // Check if cell is claimed
  const isCellClaimed = useCallback((row: number, col: number): boolean => {
    const cell = getCell(row, col);
    return cell?.owner !== null;
  }, [getCell]);

  // Select a cell
  const selectCell = useCallback((row: number, col: number) => {
    if (isLocked || isCellClaimed(row, col)) return;
    
    setSelectedCells(prev => {
      if (prev.some(cell => cell.row === row && cell.col === col)) {
        return prev;
      }
      return [...prev, { row, col }];
    });
  }, [isLocked, isCellClaimed]);

  // Deselect a cell
  const deselectCell = useCallback((row: number, col: number) => {
    setSelectedCells(prev => 
      prev.filter(cell => !(cell.row === row && cell.col === col))
    );
  }, []);

  // Toggle cell selection
  const toggleCell = useCallback((row: number, col: number) => {
    if (isLocked || isCellClaimed(row, col)) return;

    // Use functional updater to avoid stale closure issues with rapid toggles
    setSelectedCells(prev => {
      const isSelected = prev.some(cell => cell.row === row && cell.col === col);
      if (isSelected) {
        return prev.filter(cell => !(cell.row === row && cell.col === col));
      } else {
        return [...prev, { row, col }];
      }
    });
  }, [isLocked, isCellClaimed]);

  // Claim a specific cell
  const claimCell = useCallback(async (row: number, col: number) => {
    if (isLocked || isCellClaimed(row, col) || !userId || !displayName) return;

    const cellOwner: CellOwner = {
      userId,
      displayName,
      claimedAt: new Date().toISOString(),
    };

    setBoardState(prev => ({
      ...prev,
      cells: prev.cells.map(cell => 
        cell.row === row && cell.col === col
          ? { ...cell, owner: cellOwner }
          : cell
      ),
      updatedAt: new Date().toISOString(),
    }));

    // Remove from selected if present
    setSelectedCells(prev => 
      prev.filter(cell => !(cell.row === row && cell.col === col))
    );

    // Call callback
    if (onCellClaim) {
      await onCellClaim(row, col);
    }
  }, [isLocked, isCellClaimed, userId, displayName, onCellClaim]);

  // Claim all selected cells
  const claimSelectedCells = useCallback(async () => {
    if (isLocked || selectedCells.length === 0 || !userId || !displayName) return;

    const cellOwner: CellOwner = {
      userId,
      displayName,
      claimedAt: new Date().toISOString(),
    };

    setBoardState(prev => ({
      ...prev,
      cells: prev.cells.map(cell => {
        const isSelected = selectedCells.some(
          selected => selected.row === cell.row && selected.col === cell.col
        );
        if (isSelected && cell.owner === null) {
          return { ...cell, owner: cellOwner };
        }
        return cell;
      }),
      updatedAt: new Date().toISOString(),
    }));

    // Clear selection
    setSelectedCells([]);

    // Call callbacks for each claimed cell
    if (onCellClaim) {
      for (const { row, col } of selectedCells) {
        await onCellClaim(row, col);
      }
    }
  }, [isLocked, selectedCells, userId, displayName, onCellClaim]);

  // Generate random scores using Fisher-Yates shuffle
  const generateScores = useCallback(() => {
    // Generate scores 0-9
    const baseScores = Array.from(
      { length: SCORE_RANGE.MAX - SCORE_RANGE.MIN + 1 },
      (_, i) => i
    );

    // Shuffle for rows and columns separately
    const newRowScores = fisherYatesShuffle(baseScores);
    const newColScores = fisherYatesShuffle(baseScores);

    // Determine row and column score counts based on mode
    const isShotgun = mode === "SHOTGUN" || mode === "shotgun";
    const is5x5 = mode === "5x5" || mode === "FIVE_BY_FIVE";
    const is10x10 = mode === "10x10" || mode === "TEN_BY_TEN";

    let rowScoreCount = gridSize.rows;
    let colScoreCount = gridSize.cols;
    let finalRowScores: number[] = [];
    let finalColScores: number[] = [];

    if (isShotgun) {
      // Shotgun: 2 rows of 9 cells. First half gets 9 random numbers, second half gets the remaining 9.
      // Row 0: first 9 numbers from shuffled 0-9, Row 1: last 1 number? No, we need 9 numbers per row.
      // Actually, we need 9 numbers for each half, so we take 9 from the shuffled array for row 0,
      // and the remaining 1 number? Wait, that's only 10 total.
      // Shotgun has 18 cells: 9 per half. We need 9 numbers for each half, all from 0-9.
      // So we shuffle 0-9, take first 9 for row 0, and for row 1 we shuffle again and take 9.
      // Or we could use the same set for both halves. Let me re-read the spec.
      // Actually: "the shotgun has 0-9 for first half then 0-9 for the second"
      // So each half gets numbers 0-9, meaning each row gets all 10 numbers? But there are only 9 cells per row.
      // So each row gets 9 of the 10 numbers, no duplicates within the row.
      // And the numbers can repeat across halves? Or should the halves share the same 0-9 set?
      // I think each half gets its own random 9 numbers from 0-9, no duplicates within each half.
      // Let me implement it as: shuffle 0-9, take first 9 for row 0, shuffle again, take first 9 for row 1.
      const row0Scores = fisherYatesShuffle(baseScores).slice(0, 9);
      const row1Scores = fisherYatesShuffle(baseScores).slice(0, 9);
      finalRowScores = [...row0Scores, ...row1Scores]; // Length 18, 9 per row
      finalColScores = []; // Shotgun doesn't use column scores in the same way
      colScoreCount = 9; // Shotgun has 9 columns (cols=9)
    } else if (is5x5) {
      // 5x5: 5 rows, each row has two numbers: one from 0-4 and one from 5-9
      // Split 0-9 into low (0-4) and high (5-9)
      const lowScores = [0, 1, 2, 3, 4];
      const highScores = [5, 6, 7, 8, 9];
      
      // Shuffle both sets separately
      const shuffledLow = fisherYatesShuffle(lowScores);
      const shuffledHigh = fisherYatesShuffle(highScores);
      
      // Pair them up: row 0 gets (shuffledLow[0], shuffledHigh[0]), row 1 gets (shuffledLow[1], shuffledHigh[1]), etc.
      // Each row has two numbers, so we need 5 rows with 2 numbers each = 10 total row numbers (5 low, 5 high)
      // Actually, for the board display, we need each row to show two numbers, so rowScores should be an array of pairs.
      // But currently rowScores is a flat array. I'll store them as pairs: [low, high, low, high, ...]
      finalRowScores = [];
      for (let i = 0; i < 5; i++) {
        finalRowScores.push(shuffledLow[i], shuffledHigh[i]);
      }
      // finalRowScores length: 10 (5 pairs)
      
      // Same for columns
      const shuffledColLow = fisherYatesShuffle(lowScores);
      const shuffledColHigh = fisherYatesShuffle(highScores);
      finalColScores = [];
      for (let i = 0; i < 5; i++) {
        finalColScores.push(shuffledColLow[i], shuffledColHigh[i]);
      }
      // finalColScores length: 10 (5 pairs)
      
      rowScoreCount = 10; // 5 pairs = 10 numbers
      colScoreCount = 10;
    } else if (is10x10) {
      // 10x10: 10 rows with numbers 0-9 (no duplicates)
      finalRowScores = newRowScores; // Already shuffled 0-9
      finalColScores = newColScores; // Already shuffled 0-9
      rowScoreCount = 10;
      colScoreCount = 10;
    } else {
      // Fallback for any other mode
      finalRowScores = newRowScores.slice(0, rowScoreCount);
      finalColScores = newColScores.slice(0, colScoreCount);
    }

    setBoardState(prev => ({
      ...prev,
      rowScores: finalRowScores,
      colScores: finalColScores,
      updatedAt: new Date().toISOString(),
    }));
  }, [mode, gridSize]);

  // Calculate winners based on final scores
  const calculateWinners = useCallback((homeScore: number, awayScore: number): Array<{ row: number; col: number }> => {
    if (rowScores.length === 0 || colScores.length === 0) {
      return [];
    }

    // Get the last digit of each score
    const homeDigit = homeScore % 10;
    const awayDigit = awayScore % 10;

    // Determine if we're in 5x5 mode (paired numbers) or regular mode
    const is5x5 = mode === "5x5" || mode === "FIVE_BY_FIVE";
    
    let rowIndex = -1;
    let colIndex = -1;

    if (is5x5) {
      // For 5x5: rowScores is [low0, high0, low1, high1, low2, high2, low3, high3, low4, high4]
      // We need to find which row contains the homeDigit in either the low or high position
      for (let i = 0; i < rowScores.length; i += 2) {
        if (rowScores[i] === homeDigit || rowScores[i + 1] === homeDigit) {
          rowIndex = i / 2; // Convert pair index to row index (0-4)
          break;
        }
      }
      // Same for columns
      for (let i = 0; i < colScores.length; i += 2) {
        if (colScores[i] === awayDigit || colScores[i + 1] === awayDigit) {
          colIndex = i / 2;
          break;
        }
      }
    } else {
      // For 10x10 and shotgun: rowScores and colScores are flat arrays
      rowIndex = rowScores.indexOf(homeDigit);
      colIndex = colScores.indexOf(awayDigit);
    }

    if (rowIndex === -1 || colIndex === -1) {
      return [];
    }

    // Mark winning cells
    const winningCell = { row: rowIndex, col: colIndex };
    const winningPositions: Array<{ row: number; col: number }> = [winningCell];

    setBoardState(prev => ({
      ...prev,
      cells: prev.cells.map(cell => {
        if (cell.row === rowIndex && cell.col === colIndex) {
          return { ...cell, isWinner: true };
        }
        return cell;
      }),
      updatedAt: new Date().toISOString(),
    }));

    return winningPositions;
  }, [rowScores, colScores, mode]);

  // Lock the board
  const lockBoard = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      status: BOARD_STATUS.LOCKED,
      lockedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      status: BOARD_STATUS.IN_PROGRESS,
      updatedAt: new Date().toISOString(),
    }));

    if (onGameStart) {
      onGameStart();
    }
  }, [onGameStart]);

  // Complete the game
  const completeGame = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      status: BOARD_STATUS.COMPLETED,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Reset the board
  const resetBoard = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      status: BOARD_STATUS.OPEN,
      cells: generateInitialCells(mode),
      rowScores: [],
      colScores: [],
      lockedAt: undefined,
      completedAt: undefined,
      updatedAt: new Date().toISOString(),
    }));
    setSelectedCells([]);
  }, [mode]);

  return {
    boardState,
    cells,
    rowScores,
    colScores,
    selectedCells,
    isLocked,
    hasStarted,
    isCompleted,
    availableCells,
    claimedCells,
    selectCell,
    deselectCell,
    toggleCell,
    claimSelectedCells,
    claimCell,
    generateScores,
    calculateWinners,
    lockBoard,
    startGame,
    completeGame,
    resetBoard,
    getCell,
    isCellSelected,
    isCellClaimed,
    winningCells,
    isLoading,
    error,
    clearSelection,
  };
}

export default useGameBoard;