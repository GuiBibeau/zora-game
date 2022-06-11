import { Coordinate } from "types";

export class Player {
  id: string;
  range: number;
  lives: number;
  position: Coordinate;
  actionPoints: number;
  constructor(
    id: string,
    position: Coordinate,
    range: number = 1,
    lives: number = 3,
    actionPoints: number = 1
  ) {
    this.id = id;
    this.range = range;
    this.lives = lives;
    this.position = position;
    this.actionPoints = actionPoints;
  }
}
