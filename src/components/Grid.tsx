import React from 'react';
import styled from 'styled-components';
import {GridProps} from './../interfaces/Grid';

const StyledGrid = styled.div<{width: number}>`
  max-width: ${(props): number => props.width}px;
  min-height: ${(props): number => props.width}px;
	border: 6px solid lightblue;
`;
    
function Grid(props: GridProps): JSX.Element { 
  return (
    <React.Fragment>
      <StyledGrid width={props.width}>
        {props.tileMap}
      </StyledGrid>
    </React.Fragment>
	);
}

export default Grid;

