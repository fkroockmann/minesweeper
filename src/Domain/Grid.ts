import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;
export type Coords = { x: number; y: number };

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    indexByCoordinate(x: number, y: number): number {
        return this._column * y + x;
    }

    cellByCoordinates(x: number, y: number): Cell | undefined {
        return this._cells[this.indexByCoordinate(x, y)];
    }

    coordinatesByIndex(index: number): Coords {
        return { x: index % this._column, y: Math.floor(index / this._column) };
    }

    countBomb(cellIndex: number, cells: Cells): number {
        return this.coordsAround(cellIndex).reduce((count, { x, y }) => {
            const cellIndex = this.indexByCoordinate(x, y);
            const cell = cells[cellIndex];
            return count + (cell && cell.bomb ? 1 : 0);
        }, 0);
    }

    sendActionToCell(
        cellIndex: number,
        action: CellAction,
        cells = [...this._cells]
    ): Grid {
        const cell = cells[cellIndex];

        if (cell && !cell.dug) {
            cells[cellIndex] = cell[action]();
            if (!cells[cellIndex].detonated && action !== 'flag') {
                const bombAround = this.countBomb(cellIndex, cells);
                cells[cellIndex].bombAround = bombAround;
                if (!bombAround) {
                    const coordsArounds = this.coordsAround(cellIndex);
                    coordsArounds.map(({ x, y }) => {
                        const cellIndex = this.indexByCoordinate(x, y);
                        this.sendActionToCell(cellIndex, 'dig', cells);
                    });
                }
            }
        }

        return new Grid(this._column, cells);
    }

    coordsAround(cellIndex: number): Array<Coords> {
        const { x: coordsX, y: coordsY } = this.coordinatesByIndex(cellIndex);
        const max = this._column - 1;
        const range = [-1, 0, 1];

        return range.reduce((acc, i) => {
            const x: number = i + coordsX;
            range.map(i => {
                const y: number = coordsY + i;
                if (
                    `${x}${y}` !== `${coordsX}${coordsY}` &&
                    x >= 0 &&
                    x <= max &&
                    y >= 0 &&
                    y <= max
                ) {
                    acc.push({ x, y });
                }
            }, acc);
            return acc;
        }, <Coords[]>[]);
    }

    get column() {
        return this._column;
    }

    get cells() {
        return this._cells;
    }
}
