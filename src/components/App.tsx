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
  
  const returnHorizontalAndVerticalMaps = (grid: GridT): {horizontalWordMap: number[]; verticalWordMap: number[]} => {
    const horizontalWordMap: number[] = [];
    const verticalWordMap: number[] = [];

    for(let i=0; i<numTilesAcross; i++){
      for(let j=0; j<numTilesAcross; j++){
        const tile = grid[i][j];
        const isLeftBlocked = j === 0 ? true : grid[i][j-1].isBlocked
        const isUpperBlocked = i === 0 ? true : grid[i-1][j].isBlocked;

        const startsHorizontalWord = tileStartsHorizontalWord(tile, j, isLeftBlocked);
        const startsVerticalWord = tileStartsVerticalWord(tile, i, isUpperBlocked)
        
        if(startsHorizontalWord){
          horizontalWordMap.push(tile.id);
        } if (startsVerticalWord) {
          verticalWordMap.push(tile.id)
        }
      }
    }
  
    return { horizontalWordMap, verticalWordMap };
  }
    

  const addWordsToGrid = (grid: GridT): GridT => {
    const updatedGrid = grid;
    const { horizontalWordMap, verticalWordMap} = returnHorizontalAndVerticalMaps(grid);
    const wordBank = ['zi', 'h', 'woe'];

    type WordT = {
      id: number;
      wordLength: number;
      letters: string[];
    }
    const defaultCurrentWord: WordT = {id:0, wordLength:0, letters:[]};
    let currentWord: WordT = defaultCurrentWord;

    const chooseNextWord = (tile: TileProps): void => {
      
      // TODO clean this mess of a function
      currentWord = defaultCurrentWord;
      const { id } = tile;
      const currentWordIndex = id; // TODO change this
      // HWM index 
      const index = horizontalWordMap.findIndex((el) => el === id);
      const nextWordIndex = horizontalWordMap[index + 1];

      // TODO pull this out of this func asap!!!
      const returnWordLength = (): number => {
        const nextWordIsOnSameRow = nextWordIndex < (tile.rowIndex+1)*numTilesAcross;
        if(nextWordIsOnSameRow){
          return (nextWordIndex-1) - currentWordIndex;
        } else {
          const lastTileInRow = (numTilesAcross*(tile.rowIndex+1)) - 1;
          const colIndex = lastTileInRow - (numTilesAcross*tile.rowIndex)
          let lastUnblockedTileColIndex = colIndex;
          let lastUnblockedTileFound = false;

          // TODO has chance of infinitely looping fix this!!!
          // Find first unblocked tile from end of row (last tile of word will be this)
          for(let c=lastUnblockedTileColIndex; lastUnblockedTileFound===false; c=c-1){
            if(!updatedGrid[tile.rowIndex][c].isBlocked){
              lastUnblockedTileColIndex = c;
              lastUnblockedTileFound = true;
            }
          }
          // index of word's last tile
          const lastLetterInWord = ((numTilesAcross*tile.rowIndex)+lastUnblockedTileColIndex);
          // return wordLength
          return (lastLetterInWord - currentWordIndex)+1;
        }
      }
      const wordLength = returnWordLength();
      
      // choose word and set letters var as array of word's letters;
      const letters = wordBank[wordBank.findIndex((el) => {
        // TODO fix criteria for checking word bank heh
        if(el.length === wordLength){
          return true;
        } else {
          return false
        }
      })].split('');

      currentWord = {id, wordLength, letters};
      // console.log("currentWord", currentWord)
    }

    const setLetterToDisplay = (tile: TileProps): void => {
        tile.letterToDisplay = currentWord.letters[0];
        currentWord.letters.shift(); // remove grabbed letter from currentWord array
    }

    // horizontal word placement
    // todo add tile conflict checks and words from a real word bank
    for(let i=0; i<updatedGrid.length; i++){
      for(let j=0; j<updatedGrid.length; j++){
        const tile = updatedGrid[i][j];
        // when tile is not blocked
        if(!tile.isBlocked){
          // if there are letters left in currentWord
          if(currentWord.letters.length > 0){
            // select next letter and apply it to tile
            setLetterToDisplay(tile);
          } else { 
            // there are no letters left in currentWord, choose a new one
            // apply new currentWord letter to tile
            chooseNextWord(tile);
            setLetterToDisplay(tile);
          }
        } else { 
          // when tile is blocked clear letters for next new word
          currentWord.letters = [];
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
          columnIndex: j,
          rowIndex: i,
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
    // grid of empty white and black tiles
    const tilePropsMap = returnTilePropsGrid();

    const tileMap: JSX.Element[][] = [];

    // build Grid rows
    for(let rowIndex=0; rowIndex<numTilesAcross; rowIndex++){
      const row: JSX.Element[] = [];

      // build Grid columns
      for(let colIndex=0; colIndex<numTilesAcross; colIndex++){
        // check if tileProps obj exists and assign it to new var
        const tileProps = tilePropsMap[rowIndex] ? tilePropsMap[rowIndex][colIndex] : false;

        if(tileProps){
          row.push(<Tile key={tileProps.id} {...tileProps} />); //todo tileLetter func 
        }
      }
      tileMap.push(row);
    }
    return tileMap ;
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
