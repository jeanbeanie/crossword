import React from 'react';
import './App.css';
import styled from 'styled-components';

const StyledTile = styled.div`
	border: 1px solid black;
	height: ${(props: {width:number}) => props.width}px;
	width: ${props => props.width}px;
	float: left;
	background-color: white;
`

const StyledGrid = styled.div`
	max-width: 420px;
	min-height: 420px;
	border: 6px solid lightblue;
`

function Tile(props:{id: number}) {
	return (
		<StyledTile width={tileWidth}>{props.id}</StyledTile>
	)
}

const gridWidth = 420;
const tileWidth = 40;

function Grid(props:{width:number}) {
	const trueTileWidth = 40+2; // tile width plus border edges
	const numTilesAcross = props.width/trueTileWidth;
	
	const createGrid = function():JSX.Element[][]{
		const grid = [];
		for(let i=0;i<numTilesAcross;i++){
			const row  = [];
			for(let j=0;j<numTilesAcross;j++){
				const id = parseInt(`${i}${j}`)
				row.push(<Tile id={id} />);
			}
			grid.push(row);
		}
		return grid;
	}
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
