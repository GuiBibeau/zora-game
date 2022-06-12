export type Coordinate =
  | "1A"
  | "1B"
  | "1C"
  | "1D"
  | "1E"
  | "1F"
  | "1G"
  | "2A"
  | "2B"
  | "2C"
  | "2D"
  | "2E"
  | "2F"
  | "2G"
  | "3A"
  | "3B"
  | "3C"
  | "3D"
  | "3E"
  | "3F"
  | "3G"
  | "4A"
  | "4B"
  | "4C"
  | "4D"
  | "4E"
  | "4F"
  | "4G"
  | "5A"
  | "5B"
  | "5C"
  | "5D"
  | "5E"
  | "5F"
  | "5G"
  | "6A"
  | "6B"
  | "6C"
  | "6D"
  | "6E"
  | "6F"
  | "6G"
  | "7A"
  | "7B"
  | "7C"
  | "7D"
  | "7E"
  | "7F"
  | "7G";

export type PlayerActionType = "MOVE" | "UPGRADE" | "SHOOT";

export type MoveParams = {
  from: Coordinate;
  to: Coordinate;
};

export type ShootParams = {
  from: Coordinate;
  to: Coordinate;
  target: string;
};

export type UpgradeParams = {
  target: string;
  newLevel: number;
};

export type Turn = {
  type: PlayerActionType;
  turn: number;
  playerId: string;
};

export type MoveTurn = Turn & MoveParams;
export type ShootTurn = Turn & ShootParams;
export type UpgradeTurn = Turn & UpgradeParams;

export type GameState = "WAITING" | "PLAYING" | "FINISHED";

export function isGameState(value: any): value is GameState {
  return value === "WAITING" || value === "PLAYING" || value === "FINISHED";
}

export function isCoordinate(value: any): value is Coordinate {
  return (
    value === "1A" ||
    value === "1B" ||
    value === "1C" ||
    value === "1D" ||
    value === "1E" ||
    value === "1F" ||
    value === "1G" ||
    value === "2A" ||
    value === "2B" ||
    value === "2C" ||
    value === "2D" ||
    value === "2E" ||
    value === "2F" ||
    value === "2G" ||
    value === "3A" ||
    value === "3B" ||
    value === "3C" ||
    value === "3D" ||
    value === "3E" ||
    value === "3F" ||
    value === "3G" ||
    value === "4A" ||
    value === "4B" ||
    value === "4C" ||
    value === "4D" ||
    value === "4E" ||
    value === "4F" ||
    value === "4G" ||
    value === "5A" ||
    value === "5B" ||
    value === "5C" ||
    value === "5D" ||
    value === "5E" ||
    value === "5F" ||
    value === "5G" ||
    value === "6A" ||
    value === "6B" ||
    value === "6C" ||
    value === "6D" ||
    value === "6E" ||
    value === "6F" ||
    value === "6G" ||
    value === "7A" ||
    value === "7B" ||
    value === "7C" ||
    value === "7D" ||
    value === "7E" ||
    value === "7F" ||
    value === "7G"
  );
}

export type Player = {
  id: string;
  range: number;
  lives: number;
  position: Coordinate;
  actionPoints: number;
};
