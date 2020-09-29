import React, {useState} from 'react';
import './App.css';
import styled from 'styled-components';


const gridWidth = 520;
const tileWidth = 50;


const StyledTile = styled.div`
	border: 1px solid black;
	height: ${(props: {width:number}) => props.width}px;
	width: ${props => props.width}px;
	float: left;
	background-color: ${props => props.color};
`

const StyledGrid = styled.div`
	max-width: ${gridWidth}px;
	min-height: ${gridWidth}px;
	border: 6px solid lightblue;
`

function Tile(props:{id: number, color:string, tileLetter:string}) {
	return (
		<StyledTile width={tileWidth} color={props.color}>{props.id}{props.tileLetter}</StyledTile>
	)
}

//const wordBank = ["ba", "bar",]

interface TileProps {
  isBlocked: boolean,
  id: number,
  color: string,
  tileLetter:string,
  key: number,
}

function Grid(props:{width:number}) {
  const trueTileWidth = tileWidth+2; // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;

  const isTileStartOfWord = (id:number,i:number,j:number,prevTileIsBlocked:boolean) => {
    if(id === 0){
      return true;
    }
    else if (j === 0 && !prevTileIsBlocked) {
      return true;
    } else {
     return prevTileIsBlocked
    }
  }
	
	const createGrid = function():{tileMap:JSX.Element[][], horizontalWordMap:number[]}{
    const grid:TileProps[][] = [];
		for(let i=0;i<numTilesAcross;i++){
			const row  = [];
			for(let j=0;j<numTilesAcross;j++){
				const id = parseInt(`${i}${j}`);
        const isBlocked = i+2===j || i+6===j || j+2===i || j+6===i // todo figure out patterns
        const color = isBlocked ? "black" : "white";
				row.push({id, color, tileLetter:"", isBlocked, key:id}); //todo tileLetter func
			}
			grid.push(row);
		}
    const tileGrid = addTilesToGrid(grid)
    return tileGrid
	}

  const addTilesToGrid = (grid:TileProps[][]) => {
    const tileMap = [];
    const horizontalWordMap = [];
		
    for(let i=0;i<numTilesAcross;i++){
			const row  = [];

			for(let j=0;j<numTilesAcross;j++){
        const tileProps = grid[i] ? grid[i][j] : null;
        if(tileProps){
          const isBlocked = j === 0 ? true : grid[i][j-1].isBlocked
          const isStartOfWord = isTileStartOfWord(tileProps.id,i,j,isBlocked);
          if(isStartOfWord){
            horizontalWordMap.push(tileProps.id);
          }
          row.push(<Tile {...tileProps}/>); //todo tileLetter func 
        }
      }
      tileMap.push(row);
    }
    return {tileMap, horizontalWordMap}
  };
  
  const [state, setState] = useState<any>(createGrid());

  return (
		<StyledGrid>
			{state.tileMap}
		</StyledGrid>
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
