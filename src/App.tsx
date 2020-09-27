import React from 'react';
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

const wordBank = ["ba", "bar",]

function Grid(props:{width:number}) {
	const trueTileWidth = tileWidth+2; // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;
	
	const createGrid = function():JSX.Element[][]{
		const grid = [];
		for(let i=0;i<numTilesAcross;i++){
			const row  = [];
			for(let j=0;j<numTilesAcross;j++){
				const id = parseInt(`${i}${j}`);
        const blocked = i+2===j || i+6===j || j+2===i || j+6===i // todo figure out patterns
        const color = blocked ? "black" : "white";
				row.push(<Tile id={id} color={color} tileLetter={""}/>); //todo tileLetter func
			}
			grid.push(row);
		}
		return addWordsToGrid(grid);
	}

  const addWordsToGrid = (grid:JSX.Element[][]) => {
    //
    return grid;
  };

	return (
		<StyledGrid>
			{createGrid()}
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
