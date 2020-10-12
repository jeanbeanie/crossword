//import React, {useState} from 'react';
import React from 'react';
import {TileProps} from './../interfaces/Tile';
import Tile from './../components/Tile';
import Grid from './../components/Grid';


// CONSTANTS
//
const GRID_WIDTH = 520;
const TILE_WIDTH = 50;

type GridT = TileProps[][];


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

  const addWordsToGrid = (grid: GridT): GridT => {
    const updatedGrid = grid;
    //const wordBank = ['a', 'aba', 'ba','bar','car', 'y', 'aar', 'yar', 'ya', 'rar'];

    let offset = 0;
    let currentWord = {id:0, wordLength:2, letters:['b','a']};
    type WordT = {
      id: number,
      wordLength: number,
      letters: string[],
    }
    const chooseNextWord = (tileId:number) => {
      currentWord = {id:tileId, wordLength:2, letters:['b','a', 'r',]};
    }

    const setLetterToDisplay = (tile: TileProps) => {
        console.log('setLetterToDisplay START')
        tile.letterToDisplay = currentWord.letters[0]; // grab first letter from wordbank.letters
        currentWord.letters.shift(); // remove grabbed letter from array
        console.log('setLetterToDisplay END,', currentWord)
    }

    for(let i=0; i<updatedGrid.length; i++){
      for(let j=0; j<updatedGrid.length; j++){
        const tile = updatedGrid[i][j];
        console.log("TILE", tile, "CW", currentWord)
          // if we still have letters in the current word to place for the next tile
        if(!tile.isBlocked){
          if(currentWord.letters.length > 0){
            setLetterToDisplay(tile);
          } else {
            chooseNextWord(tile.id);
            setLetterToDisplay(tile);
          }
        } else {
          chooseNextWord(tile.id+1);
          offset+=1;
          console.log('CW', currentWord)
        }   
      } 
    }
    
    return updatedGrid;
  };

  const returnTilePropsGrid = (): GridT => { 
    const grid: GridT = [];

		for(let i=0; i<numTilesAcross; i++){
			const row: TileProps[] = [];
			for(let j=0; j<numTilesAcross; j++){
        const tileIsBlocked = i+2===j || i+6===j || j+2===i || j+6===i; // todo figure out other patterns
        const tileProps = {
          id: parseInt(`${i}${j}`),
          color: tileIsBlocked ? "black" : "white",
          width: TILE_WIDTH,
          letterToDisplay: "",
          letterIsDisplayed: true, // TODO switch this to false for default
          isBlocked: tileIsBlocked,
        }
        row.push(tileProps); //todo tileLetter func here?
			}
			grid.push(row);
    }
    addWordsToGrid(grid);

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
          row.push(<Tile key={tileProps.id} {...tileProps} startsVerticalWord startsHorizontalWord />); //todo tileLetter func 
        }
      }
      tileMap.push(row);
    }
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
