import React, {useState} from 'react';
import './App.css';
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
  tileLetter: string;
  key?: number;
}

function Tile(props: TileProps): JSX.Element {
	return (
		<StyledTile width={TILE_WIDTH} color={props.color}>{props.id}{props.tileLetter}</StyledTile>
  );
}

/*** END OF TILE COMPONENTS ***/


/*** GRID COMPONENTS ***/

interface GridProps { width: number }
interface GridState {
  tileMap: JSX.Element[][];
  horizontalWordMap: number[];
  verticalWordMap: number[];
}

const StyledGrid = styled.div`
	max-width: ${GRID_WIDTH}px;
	min-height: ${GRID_WIDTH}px;
	border: 6px solid lightblue;
`;
    
function Grid(props: GridProps): JSX.Element {
  const trueTileWidth = (TILE_WIDTH + 2); // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;

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

  const addTilesToGrid = (grid: TileProps[][]): GridState => {
    const tileMap = [];
    const horizontalWordMap = [];
    const verticalWordMap = [];

    // build Grid rows
    for(let rowIndex=0; rowIndex<numTilesAcross; rowIndex++){
      const row  = [];

      // build Grid columns
			for(let colIndex=0; colIndex<numTilesAcross; colIndex++){
        const tileProps = grid[rowIndex] ? grid[rowIndex][colIndex] : false;
        if(tileProps){
          const isLeftBlocked = colIndex === 0 ? true : grid[rowIndex][colIndex-1].isBlocked
          const isUpperBlocked = rowIndex === 0 ? true : grid[rowIndex-1][colIndex].isBlocked;
          // console.log("grid[rowIndex][colIndex]", grid[rowIndex][colIndex], "row", rowIndex, "col", colIndex) 
          // console.log("isLeftBlocked", isLeftBlocked);
          // console.log("isUpperBlocked", isUpperBlocked);
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
    console.log( {tileMap, horizontalWordMap, verticalWordMap} );
    return {tileMap, horizontalWordMap, verticalWordMap}
  };
  

	const createGridState = function(): GridState {
    const grid: TileProps[][] = [];
		for(let i=0;i<numTilesAcross;i++){
			const row  = [];
			for(let j=0;j<numTilesAcross;j++){
				const id = parseInt(`${i}${j}`);
        const isBlocked = i+2===j || i+6===j || j+2===i || j+6===i // todo figure out other patterns
        const color = isBlocked ? "black" : "white";
				row.push({id, color, tileLetter:"", isBlocked, key:id}); //todo tileLetter func here?
			}
			grid.push(row);
		}
    const tileGrid = addTilesToGrid(grid)
    return tileGrid
	}

  // TODO set setState 
  const [state] = useState<GridState>(createGridState());

  return (
    <React.Fragment>
      <StyledGrid>
        {state.tileMap}
      </StyledGrid>
    </React.Fragment>
	);
}

/*** END OF GRID COMPONENTS ***/

function App(): JSX.Element {
  return (
    <div id="App">
      <h1>Crossword</h1>
      <Grid width={GRID_WIDTH}/>
    </div>
  );
}

export default App;
