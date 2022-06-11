import { Board } from "../models/board";
import { Coordinate } from "../types";

export function getRandomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomPositionFromBoard(board: Board): Coordinate {
  const possibleCoordinates = Object.keys(board.squares) as Coordinate[];
  return getRandomElement(possibleCoordinates);
}

export function generateNRandomDifferentPositions(
  board: Board,
  n: number
): Coordinate[] {
  const possibleCoordinates = Object.keys(board.squares) as Coordinate[];
  return Array.from(Array(n).keys()).map(() =>
    getRandomElement(possibleCoordinates)
  );
}
