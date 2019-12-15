import styled from '@emotion/styled';
import React from 'react';

type Props = {
    onClick: Function;
};

const StyledDiv = styled.div`
    display: flex;
    a {
        padding: 10px;
        color: #000;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const RollBackButton: React.FC<Props> = props => {
    return (
        <StyledDiv>
            <a
                href="#"
                onClick={ev => {
                    ev.preventDefault();
                    props.onClick(ev);
                }}
            >
                Retour
            </a>
        </StyledDiv>
    );
};
