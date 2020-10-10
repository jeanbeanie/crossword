import React, {useState} from 'react';
import './App.css';
import styled from 'styled-components';


const GRID_WIDTH = 520;
const TILE_WIDTH = 50;


const StyledTile = styled.div<{width: number; color: string}>`
  border: 1px solid black;
	height: ${(props: {width: number}): number => props.width}px;
	width: ${(props: {width: number}): number => props.width}px;
	float: left;
	background-color: ${(props: {color: string}): string => props.color};
`;

const StyledGrid = styled.div`
	max-width: ${GRID_WIDTH}px;
	min-height: ${GRID_WIDTH}px;
	border: 6px solid lightblue;
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

//const wordBank = ["ba", "bar",]


interface GridProps { width: number }
interface GridState {
  tileMap: JSX.Element[][];
    horizontalWordMap: number[];
    verticalWordMap: number[];
}

interface TileStartParams {
//  id: number`
  id: number;
  i: number;
  j: number;
  prevTileIsBlocked: boolean; 
}

function Grid(props: GridProps): JSX.Element {
  const trueTileWidth = (TILE_WIDTH + 2); // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;

  const isTileStartOfHorizontalWord = (tileStartParams: TileStartParams): boolean => {
    const {id, j, prevTileIsBlocked} = tileStartParams;
    if(id === 0){
      return true;
    }
    else if (j === 0 && !prevTileIsBlocked) {
      return true;
    } else {
     return prevTileIsBlocked
    }
  }

  const isTileStartOfVerticalWord = (tileStartParams: TileStartParams): boolean => {
    const {id, i, prevTileIsBlocked} = tileStartParams;
    if(id === 0){
      return true;
    }
    else if (i === 0 && !prevTileIsBlocked) {
      return true;
    } else {
      return prevTileIsBlocked
    }
  }

  const addTilesToGrid = (grid: TileProps[][]): GridState => {
    const tileMap = [];
    const horizontalWordMap = [];
    const verticalWordMap = [];

    for(let i=0;i<numTilesAcross;i++){
			const row  = [];

			for(let j=0;j<numTilesAcross;j++){
        const tileProps = grid[i] ? grid[i][j] : null;
        if(tileProps){
          const isLeftBlocked = j === 0 ? true : grid[i][j-1].isBlocked
          const isUpperBlocked = i === 0 ? true : grid[i-1][j].isBlocked;
          const tileStartFuncParams = {id:tileProps.id, i, j};
          
          const isStartOfHorizontalWord = isTileStartOfHorizontalWord({...tileStartFuncParams, prevTileIsBlocked:isLeftBlocked});
          const isStartOfVerticalWord = isTileStartOfVerticalWord({...tileStartFuncParams, prevTileIsBlocked:isUpperBlocked});
          
          if(isStartOfHorizontalWord){
            horizontalWordMap.push(tileProps.id);
          } if (isStartOfVerticalWord) {
            // TODO this is wrong fix it after cleaning
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

function App(): JSX.Element {
  return (
    <div id="App">
      <h1>Crossword</h1>
      <Grid width={GRID_WIDTH}/>
    </div>
  );
}

export default App;
