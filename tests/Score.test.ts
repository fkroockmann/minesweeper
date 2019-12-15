import {
    getScoreInfo,
    BACK_PENALTY,
    FLAG_PENALTY,
    TIME_PENALTY,
} from '../src/Domain/Score';
import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe('Score', () => {
    test(`Test flags points`, () => {
        const cellWithBomb = Cell.withBomb().flag();
        const column = 2;
        const grid = new Grid(column, [Cell.withoutBomb(), cellWithBomb]);
        const scoreInfo = getScoreInfo(grid, 0, 0);

        expect(scoreInfo.flags).toBe(1);
        expect(scoreInfo.score).toBe(column - FLAG_PENALTY);
    });

    test(`Test back points`, () => {
        const column = 100;
        const cells = Array(column)
            .fill(null)
            .map(() => Cell.withoutBomb());
        const grid = new Grid(column, cells);
        const scoreInfo = getScoreInfo(grid, 0, 1);

        expect(scoreInfo.back).toBe(1);
        expect(scoreInfo.score).toBe(column - BACK_PENALTY);
    });

    test(`Test time points`, () => {
        const column = 100;
        const cells = Array(column)
            .fill(null)
            .map(() => Cell.withoutBomb());
        const time = 10;
        const grid = new Grid(column, cells);
        const scoreInfo = getScoreInfo(grid, time, 0);

        expect(scoreInfo.time).toBe(time);
        expect(scoreInfo.score).toBe(column - TIME_PENALTY * time);
    });

    test('Test mix points', () => {
        const column = 100;
        const cells = [
            ...Array(column - 1)
                .fill(null)
                .map(() => Cell.withoutBomb()),
            Cell.withBomb().flag(),
        ];
        const time = 30;
        const back = 3;
        const grid = new Grid(column, cells);
        const scoreInfo = getScoreInfo(grid, time, back);

        expect(scoreInfo.flags).toBe(1);
        expect(scoreInfo.back).toBe(back);
        expect(scoreInfo.time).toBe(time);
        expect(scoreInfo.score).toBe(
            column - TIME_PENALTY * time - BACK_PENALTY * back - FLAG_PENALTY
        );
    });

    test('Score must be > 0', () => {
        const grid = new Grid(1, [Cell.withoutBomb()]);
        const scoreInfo = getScoreInfo(grid, 0, 5);

        expect(scoreInfo.score).toBe(0);
    });
});
