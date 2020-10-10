//import React, {useState} from 'react';
import React from 'react';
import styled from 'styled-components';


const GRID_WIDTH = 520;
const TILE_WIDTH = 50;

/*** TILE COMPONENTS ***/

const StyledTile = styled.div<{width: number; color: string}>`
  border: 1px solid black;
	height: ${(props: {width: number}): number => props.width}px;
	width: ${(props: {width: number}): number => props.width}px;
	float: left;
	background-color: ${(props: {color: string}): string => props.color};
`;
    
interface TileProps {
  isBlocked: boolean;
  id: number;
  color: string;
  displayLetter: string;
  key?: number;
  width: number;
}

function Tile(props: TileProps): JSX.Element {
  const {width, color, displayLetter, id} = props;
	return (
		<StyledTile width={width} color={color}> {id}{displayLetter} </StyledTile>
  );
}

/*** END OF TILE COMPONENTS ***/


/*** GRID COMPONENTS ***/

interface GridProps { 
  width: number;
  tileWidth: number;
  tileMap: JSX.Element[][];
}

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

/*** END OF GRID COMPONENTS ***/


function App(): JSX.Element {
  const tileWidthWithBorder = TILE_WIDTH + 2;
  const numTilesAcross = GRID_WIDTH/tileWidthWithBorder;
  
  // TODO these 2 funcs can be put together somehow, if it won't be too confusing
  const tileStartsHorizontalWord = (tile: TileProps, colIndex: number, leftTileIsBlocked: boolean): boolean => {
    if(colIndex === 0 && !tile.isBlocked){
      return true;
    } else {
      return leftTileIsBlocked && !tile.isBlocked;
    }
  }

  const tileStartsVerticalWord = (tile: TileProps, rowIndex: number, upperTileIsBlocked: boolean): boolean => {
    if (rowIndex === 0 && !tile.isBlocked) {
      return true;
    } else { 
      return upperTileIsBlocked && !tile.isBlocked; 
    }
  }

  const returnTilePropsGrid = (): TileProps[][] => { 
    const grid: TileProps[][] = [];
    
		for(let i=0; i<numTilesAcross; i++){
			const row: TileProps[] = [];
			for(let j=0; j<numTilesAcross; j++){
        const id = parseInt(`${i}${j}`);
        const isBlocked = i+2===j || i+6===j || j+2===i || j+6===i // todo figure out other patterns
        const color = isBlocked ? "black" : "white";
        const width = TILE_WIDTH;

				row.push({width, id, color, displayLetter:"", isBlocked, key:id}); //todo tileLetter func here?
			}
			grid.push(row);
    }
    return grid;
  }

  const buildTileMap = (): JSX.Element[][] => {
    const tilePropsMap = returnTilePropsGrid();
    const tileMap: JSX.Element[][] = [];
    const horizontalWordMap: number[] = [];
    const verticalWordMap: number[] = [];

    // build Grid rows
    for(let rowIndex=0; rowIndex<numTilesAcross; rowIndex++){
      const row: JSX.Element[] = [];

      // build Grid columns
      for(let colIndex=0; colIndex<numTilesAcross; colIndex++){
        // check if tileProps obj exists and assign it to new var
        const tileProps = tilePropsMap[rowIndex] ? tilePropsMap[rowIndex][colIndex] : false;

        if(tileProps){
          // find out if adjacent tiles are blocked/filled in
          const isLeftBlocked = colIndex === 0 ? true : tilePropsMap[rowIndex][colIndex-1].isBlocked
          const isUpperBlocked = rowIndex === 0 ? true : tilePropsMap[rowIndex-1][colIndex].isBlocked;

          const startsHorizontalWord = tileStartsHorizontalWord(tileProps, colIndex, isLeftBlocked);
          const startsVerticalWord = tileStartsVerticalWord(tileProps, rowIndex, isUpperBlocked)
          
          if(startsHorizontalWord){
            horizontalWordMap.push(tileProps.id);
          } if (startsVerticalWord) {
            verticalWordMap.push(tileProps.id)
          }
          row.push(<Tile {...tileProps}/>); //todo tileLetter func 
        }
      }
      tileMap.push(row);
    }
    console.log("horizontalWordMap", horizontalWordMap, "verticalWordMap", verticalWordMap);
    return tileMap;
  }

  const tileMap = buildTileMap();

  return (
    <div id="App">
      <h1>Crossword</h1>
      <Grid 
        tileMap={tileMap}
        width={GRID_WIDTH}
        tileWidth={TILE_WIDTH}
      />
    </div>
  );
}

export default App;
