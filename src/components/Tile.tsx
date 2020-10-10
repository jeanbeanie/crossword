import React from 'react';
import styled from 'styled-components';
import {TileProps} from './../interfaces/Tile';


const StyledTile = styled.div<{width: number; color: string}>`
  border: 1px solid black;
	height: ${(props: {width: number}): number => props.width}px;
	width: ${(props: {width: number}): number => props.width}px;
	float: left;
	background-color: ${(props: {color: string}): string => props.color};
`;
    
function Tile(props: TileProps): JSX.Element {
  const {width, color, letterToDisplay, id} = props;
	return (
		<StyledTile width={width} color={color}> {id}{letterToDisplay} </StyledTile>
  );
}

export default Tile;
