import React, {useState} from 'react';
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
  numTilesAcross: number;
}
interface GridState {
  tileMap: JSX.Element[][];
  horizontalWordMap: number[];
  verticalWordMap: number[];
}

const StyledGrid = styled.div<{width: number}>`
  max-width: ${(props): number => props.width}px;
  min-height: ${(props): number => props.width}px;
	border: 6px solid lightblue;
`;
    
function Grid(props: GridProps): JSX.Element {
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

  const buildStateFromGrid = (grid: TileProps[][]): GridState => {
    const tileMap: JSX.Element[][] = [];
    const horizontalWordMap: number[] = [];
    const verticalWordMap: number[] = [];

    // build Grid rows
    for(let rowIndex=0; rowIndex<props.numTilesAcross; rowIndex++){
      const row: JSX.Element[] = [];

      // build Grid columns
			for(let colIndex=0; colIndex<props.numTilesAcross; colIndex++){
        const tileProps = grid[rowIndex] ? grid[rowIndex][colIndex] : false;
        if(tileProps){
          const isLeftBlocked = colIndex === 0 ? true : grid[rowIndex][colIndex-1].isBlocked
          const isUpperBlocked = rowIndex === 0 ? true : grid[rowIndex-1][colIndex].isBlocked;
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
    return {tileMap, horizontalWordMap, verticalWordMap}
  };
  

	const returnState = function(): GridState {
    const grid: TileProps[][] = [];
    const {numTilesAcross, tileWidth} = props;

		for(let i=0; i<numTilesAcross; i++){
			const row: TileProps[] = [];
			for(let j=0; j<numTilesAcross; j++){
				const id = parseInt(`${i}${j}`);
        const isBlocked = i+2===j || i+6===j || j+2===i || j+6===i // todo figure out other patterns
        const color = isBlocked ? "black" : "white";
        const width = tileWidth;

				row.push({width, id, color, displayLetter:"", isBlocked, key:id}); //todo tileLetter func here?
			}
			grid.push(row);
		}
    return buildStateFromGrid(grid);
	}

  const [state] = useState<GridState>(returnState());

  return (
    <React.Fragment>
      <StyledGrid width={props.width}>
        {state.tileMap}
      </StyledGrid>
    </React.Fragment>
	);
}

/*** END OF GRID COMPONENTS ***/

function App(): JSX.Element {
  const trueTileWidth = TILE_WIDTH + 2; // tile width plus border edges
	const numTilesAcross = GRID_WIDTH/trueTileWidth;

  return (
    <div id="App">
      <h1>Crossword</h1>
      <Grid width={GRID_WIDTH} tileWidth={TILE_WIDTH} numTilesAcross={numTilesAcross}/>
    </div>
  );
}

export default App;
