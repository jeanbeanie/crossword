import React from 'react';
import styled from 'styled-components';
import {TileProps} from './../interfaces/Tile';


const StyledTile = styled.div<{width: number; color: string}>`
  border: 1px solid black;
	height: ${(props: {width: number}): number => props.width}px;
	width: ${(props: {width: number}): number => props.width}px;
  float: left;
  display: block;
  text-align: center;
	background-color: ${(props: {color: string}): string => props.color};
`;

const StyledNumber = styled.div<{}>`
  float: left;
  display: block;
`;

const StyledLetter = styled.div<{}>`
  margin: .5rem 0 0px -.5rem;
  text-transform: capitalize;
  font-size: x-large;
  font-weight: bold;
  display: inline-block;
`;

function Tile(props: TileProps): JSX.Element {
  const {width, color, letterToDisplay, id, letterIsDisplayed} = props;

	return (
    <StyledTile width={width} color={color}>
      <StyledNumber>{id}</StyledNumber>
      {
        letterIsDisplayed && <StyledLetter>{letterToDisplay}</StyledLetter>
      }
    </StyledTile>
  );
}

export default Tile;
