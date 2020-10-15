
export interface TileProps {
  isBlocked: boolean;
  id: number;
  color: string;
  letterToDisplay: string;
  letterIsDisplayed: boolean;
  width: number;
  rowIndex: number;
  columnIndex: number;
  startsVerticalWord?: boolean;
  startsHorizontalWord?: boolean;
}

