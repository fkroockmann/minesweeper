export type CellStatus = 'untouched' | 'flagged' | 'dug' | 'detonated';
export type CellAction = 'dig' | 'flag';

export class Cell {
    private _bomb: boolean;
    private _flagged: boolean;
    private _dug: boolean;
    private _bombAround: Number | null;

    static withBomb(): Cell {
        return new Cell(true, false, false, null);
    }

    static withoutBomb(): Cell {
        return new Cell(false, false, false, null);
    }

    constructor(
        withBomb: boolean,
        flagged: boolean,
        dug: boolean,
        bombAround: Number | null
    ) {
        this._bomb = withBomb;
        this._flagged = flagged;
        this._dug = dug;
        this._bombAround = bombAround;
    }

    flag(): Cell {
        if (this._dug === true) {
            throw new Error('This cell has already been dug');
        }
        return new Cell(
            this._bomb,
            !this._flagged,
            this._dug,
            this._bombAround
        );
    }

    dig(): Cell {
        return new Cell(this._bomb, false, true, this._bombAround);
    }

    get detonated(): boolean {
        return this._bomb && this.dug;
    }

    get flagged(): boolean {
        return this._flagged;
    }

    get dug(): boolean {
        return this._dug;
    }

    get bomb(): boolean {
        return this._bomb;
    }

    get bombAround(): Number | null {
        return this._bombAround;
    }

    get status(): CellStatus {
        if (this.detonated) {
            return 'detonated';
        }
        if (this.dug) {
            return 'dug';
        }
        if (this.flagged) {
            return 'flagged';
        }
        return 'untouched';
    }

    set bombAround(bombAround: Number | null) {
        this._bombAround = bombAround;
    }
}
