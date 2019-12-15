import styled from '@emotion/styled';
import React, { ComponentType } from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    bombAround: Number | null;
    onclick: Function;
};

type StyledDiv = {
    status: string;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const setStatusBackgroundColor = (
    status: string,
    color: string
): string | undefined =>
    status === 'untouched' || status === 'flagged' ? color : undefined;

const StyledDiv: ComponentType<StyledDiv &
    React.HTMLProps<HTMLDivElement>> = styled.div`
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid black;
    box-sizing: border-box;
    cursor: pointer;
    background-color: ${props =>
        setStatusBackgroundColor(props.status, '#ccc')};
    &:hover {
        background-color: ${props =>
            setStatusBackgroundColor(props.status, '#9e9e9e')};
    }
`;

export const Cell: React.FC<CellProps> = props => {
    return (
        <StyledDiv
            status={props.status}
            onClick={(ev: React.MouseEvent<HTMLInputElement>) => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={(ev: React.MouseEvent<HTMLInputElement>) => {
                ev.preventDefault();
                props.onclick(ev);
            }}
        >
            {props.status === 'dug' &&
                props.bombAround !== null &&
                props.bombAround > 0 &&
                props.bombAround}
            {props.status !== 'dug' && emojis[props.status]}
        </StyledDiv>
    );
};
