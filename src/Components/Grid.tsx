import styled from '@emotion/styled';

import React, { useCallback, ComponentType } from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { RollBackButton } from './RollBackButton';
import { isDefeated, isVictorious } from '../Domain/Rules';

type StyledGridProps = {
    column: number;
};

const StyledGrid: ComponentType<StyledGridProps &
    React.HTMLProps<HTMLInputElement>> = styled.div`
    display: flex;
    box-sizing: content-box;
    flex-wrap: wrap;
    width: calc(40px * 10);
    position: relative;
    width: ${props => `calc(40px * ${props.column})`};
`;

const StyledWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .board {
        display: flex;
        flex-direction: column;
        height: 70%;
        h1 {
            text-align: center;
        }
    }
`;

export const Grid: React.FC = () => {
    const {
        grid,
        updateGridCellStatus,
        time,
        start,
        stop,
        rollback,
        backCount,
        retry,
        clearTime,
    } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        if (time === 0) {
            start();
        }
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const handleRetry = useCallback(() => {
        retry();
        clearTime();
    }, []);

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    if (gameOver !== false) {
        stop();
    }

    return (
        <StyledWrapper className="wrapper">
            <div className="board">
                <h1>Démineur: LE JEU!</h1>
                {time}
                <RollBackButton onClick={rollback} />
                <StyledGrid column={grid.column}>
                    {gameOver !== false && (
                        <Game
                            gameOver={gameOver}
                            grid={grid}
                            time={time}
                            backCount={backCount}
                            retry={handleRetry}
                        />
                    )}
                    {grid.cells.map((cell, index) => (
                        <Cell
                            key={index}
                            status={cell.status}
                            bombAround={cell.bombAround}
                            onclick={(ev: MouseEvent) =>
                                handleClick(index, ev.button)
                            }
                        />
                    ))}
                </StyledGrid>
            </div>
        </StyledWrapper>
    );
};
