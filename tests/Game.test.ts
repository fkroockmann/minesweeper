import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    test('a new game is neither lost or won', () => {
        const grid = Grid.generate(1, 1, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a bomb has been dug', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(2, [cellWithBomb, cellWithoutBomb]);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDetonated = grid.sendActionToCell(0, 'dig');

        expect(isDefeated(gridDetonated)).toBe(true);
        expect(isVictorious(gridDetonated)).toBe(false);
    });

    test('a game is won if every cell without bomb has been dug', () => {
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [cellWithoutBomb]);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDug = grid.sendActionToCell(0, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });

    test('a game is won if every cell without bomb has been dug and/or flags are used', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(2, [cellWithBomb, cellWithoutBomb]);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridFlag = grid.sendActionToCell(0, 'flag');
        const gridDug = gridFlag.sendActionToCell(1, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });

    test('dig a cell without bomb around must dig cells around recursively', () => {
        const grid = new Grid(3, [
            Cell.withoutBomb(),
            Cell.withoutBomb(),
            Cell.withoutBomb(),
        ]);

        const gridDug = grid.sendActionToCell(0, 'dig');

        expect(gridDug.cells[1].status).toBe('dug');
        expect(gridDug.cells[2].status).toBe('dug');
    });

    test('dig a cell without bomb around must dig cells around recursively without trigger bomb', () => {
        const grid = new Grid(4, [
            Cell.withoutBomb(),
            Cell.withoutBomb(),
            Cell.withoutBomb(),
            Cell.withBomb(),
        ]);

        const gridDug = grid.sendActionToCell(0, 'dig');

        expect(gridDug.cells[1].status).toBe('dug');
        expect(gridDug.cells[2].status).toBe('dug');
        expect(gridDug.cells[3].status).toBe('untouched');
    });
});
