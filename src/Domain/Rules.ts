import { Grid } from './Grid';

export const isDefeated = (grid: Grid) =>
    grid.cells.some(cell => cell.detonated);

export const isVictorious = (grid: Grid) => {
    return grid.cells.every(cell => {
        return (
            (cell.dug === true && cell.detonated === false) ||
            (cell.bomb && cell.dug === false)
        );
    });
};
