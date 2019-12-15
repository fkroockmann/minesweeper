import styled from '@emotion/styled';
import React from 'react';
import { getScoreInfo } from '../Domain/Score';
import { Grid } from '../Domain/Grid';

type GameProps = {
    gameOver: false | 'victory' | 'defeat';
    time: number;
    grid: Grid;
    backCount: number;
    retry: Function;
};

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(12, 12, 12, 0.7);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .score-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        padding: 40px;
        p {
            margin: 5px; 5px;
        }
        button {
            padding: 5px;
            width: 90px;
        }
    }
`;

export const Game: React.FC<GameProps> = props => {
    const { grid, time, backCount } = props;

    let scoreInfo = null;
    if (props.gameOver === 'victory') {
        scoreInfo = getScoreInfo(grid, time, backCount);
    }

    return (
        <StyledDiv className="game">
            <div className="score-wrapper">
                {props.gameOver === 'defeat' && <p>Vous avez perdu :(</p>}
                {props.gameOver === 'victory' && scoreInfo && (
                    <React.Fragment>
                        <p>Vous avez gagnez :)</p>
                        <p>Votre score:</p>
                        <span>Drapeau: {scoreInfo.flags}</span>
                        <span>Temps: {scoreInfo.time}</span>
                        <span>Retour: {scoreInfo.back}</span>
                        <span>Score: {scoreInfo.score}</span>
                    </React.Fragment>
                )}
                <button
                    onClick={() => {
                        props.retry();
                    }}
                >
                    Rejouer ?
                </button>
            </div>
        </StyledDiv>
    );
};
