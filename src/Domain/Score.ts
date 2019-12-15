import { Grid } from './Grid';

export const BACK_PENALTY = 5;
export const FLAG_PENALTY = 1;
export const TIME_PENALTY = 0.2;

interface Score {
    flags: number;
    time: number;
    back: number;
    score: number;
}

export const getScoreInfo = (
    grid: Grid,
    time: number = 0,
    back: number = 0
): Score => {
    const { cells } = grid;
    const flags: number =
        cells.reduce((count, value): number => {
            if (value.flagged) count++;
            return count;
        }, 0) || 0;

    const score =
        cells.length -
        back * BACK_PENALTY -
        flags * FLAG_PENALTY -
        time * TIME_PENALTY;

    return {
        flags,
        time,
        back,
        score: score < 0 ? 0 : score,
    };
};
