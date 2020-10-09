import React, {useState} from 'react';
import './App.css';
import styled from 'styled-components';


const gridWidth = 520;
const tileWidth = 50;


const StyledTile = styled.div`
  border: 1px solid black;
	height: ${(props: {width: number}) => props.width}px;
	width: ${props => props.width}px;
	float: left;
	background-color: ${props => props.color};
`;

const StyledGrid = styled.div`
	max-width: ${gridWidth}px;
	min-height: ${gridWidth}px;
	border: 6px solid lightblue;
`;
    
interface TileProps {
  isBlocked: boolean;
  id: number;
  color: string;
  tileLetter: string;
  key?: number;
}

function Tile(props: TileProps) {
	return (
		<StyledTile width={tileWidth} color={props.color}>{props.id}{props.tileLetter}</StyledTile>
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
id: number;i: number;j: number;prevTileIsBlocked: boolean; 
}

function Grid(props: GridProps) {
  const trueTileWidth = tileWidth+2; // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;

  const isTileStartOfHorizontalWord = (tileStartParams: TileStartParams) => {
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

  const isTileStartOfVerticalWord = (tileStartParams: TileStartParams) => {
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

  const addTilesToGrid = (grid: TileProps[][]) => {
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
  
  const [state, setState] = useState<GridState>(createGridState());

  return (
    <React.Fragment>
      <StyledGrid>
        {state.tileMap}
      </StyledGrid>
    </React.Fragment>
	);
}

function App() {
  return (
    <div id="App">
	    <h1>Crossword</h1>
	    <Grid width={gridWidth}/>
	  </div>
  );
}

export default App;
