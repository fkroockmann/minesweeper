import React, { useState, useEffect } from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    time: number;
    start: () => void;
    stop: () => void;
    rollback: () => void;
    retry: () => void;
    clearTime: () => void;
    backCount: number;
};

type GridCustomHook = [
    Grid,
    (index: number, action: CellAction) => void,
    () => void,
    number,
    () => void
];

type StartTimeCustomHook = [number, () => void, () => void, () => void];

const generateGrid = () => Grid.generate(10, 10, 10);

const initialContext: GameContextProps = {
    grid: generateGrid(),
    updateGridCellStatus: () => {},
    time: 0,
    start: () => {},
    stop: () => {},
    rollback: () => {},
    retry: () => {},
    clearTime: () => {},
    backCount: 0,
};

const useStateGridCells = (initialValue: Grid): GridCustomHook => {
    const [grid, setGrid] = useState(initialValue);
    const [history, setHistory] = useState([grid]);
    const [backCount, setBackCount] = useState(0);

    const rollback = () => {
        const newHistory = history.slice(0, history.length - 1);
        if (newHistory.length) {
            setHistory(newHistory);
            setGrid(newHistory[newHistory.length - 1]);
            setBackCount(backCount + 1);
        }
    };

    const retry = () => {
        const grid = generateGrid();
        setHistory([grid]);
        setGrid(grid);
    };

    return [
        grid,
        (index: number, action: CellAction) => {
            const newGrid = grid.sendActionToCell(index, action);
            setGrid(newGrid);
            setHistory([...history, newGrid]);
        },
        rollback,
        backCount,
        retry,
    ];
};

const useStartTime = (): StartTimeCustomHook => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const start = () => {
        setTime(0);
        setIsActive(true);
    };

    const stop = () => {
        setIsActive(false);
    };

    const clear = () => {
        setTime(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
        } else if (!isActive && time !== 0 && null !== interval) {
            clearInterval(interval);
        }
        return () => {
            if (null !== interval) clearInterval(interval);
        };
    }, [isActive, time]);

    return [time, start, stop, clear];
};

export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FC<React.ReactNode> = props => {
    const [
        grid,
        updateGridCellStatus,
        rollback,
        backCount,
        retry,
    ] = useStateGridCells(initialContext.grid);
    const [time, start, stop, clearTime] = useStartTime();

    return (
        <GameContext.Provider
            value={{
                grid,
                updateGridCellStatus,
                time,
                start,
                stop,
                rollback,
                backCount,
                retry,
                clearTime,
            }}
        >
            {props.children}
        </GameContext.Provider>
    );
};
