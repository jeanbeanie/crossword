
export interface TileProps {
  isBlocked: boolean;
  id: number;
  color: string;
  letterToDisplay: string;
  letterIsDisplayed: boolean;
  width: number;
  startsVerticalWord?: boolean;
  startsHorizontalWord?: boolean;
}

