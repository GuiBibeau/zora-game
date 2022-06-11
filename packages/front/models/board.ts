import { Coordinate } from "../types";

export class Board {
  squares: Record<Coordinate, Set<Coordinate>>;
  positions: Map<Coordinate, null | string>;
  constructor(positions?: Record<Coordinate, string>) {
    // agency list using a set
    this.squares = {
      "1A": new Set(["1B", "2B", "2A"]),
      "1B": new Set(["1A", "2A", "2B", "2C", "1C"]),
      "1C": new Set(["1B", "2B", "2C", "2D", "1D"]),
      "1D": new Set(["1C", "2C", "2D", "2E", "1E"]),
      "1E": new Set(["1D", "2D", "2E", "2F", "1F"]),
      "1F": new Set(["1E", "2E", "2F", "2G", "1G"]),
      "1G": new Set(["1F", "2F", "2G"]),
      "2A": new Set(["1A", "1B", "2B", "3B", "3A"]),
      "2B": new Set(["1A", "1B", "1C", "2A", "2C", "3A", "3B", "3C"]),
      "2C": new Set(["1B", "1C", "1D", "2B", "2D", "3B", "3C", "3D"]),
      "2D": new Set(["1C", "1D", "1E", "2C", "2E", "3C", "3D", "3E"]),
      "2E": new Set(["1D", "1E", "1F", "2D", "2F", "3D", "3E", "3F"]),
      "2F": new Set(["1E", "1F", "1G", "2E", "2G", "3E", "3F", "3G"]),
      "2G": new Set(["1F", "1G", "2F", "3F", "3G"]),
      "3A": new Set(["2A", "2B", "3B", "4A", "4B"]),
      "3B": new Set(["2A", "2B", "2C", "3A", "3C", "4A", "4B", "4C"]),
      "3C": new Set(["2B", "2C", "2D", "3B", "3D", "4B", "4C", "4D"]),
      "3D": new Set(["2C", "2D", "2E", "3C", "3E", "4C", "4D", "5E"]),
      "3E": new Set(["2D", "2E", "2F", "3D", "3F", "4D", "5E", "5F"]),
      "3F": new Set(["2E", "2F", "2G", "3E", "3G", "5E", "5F", "5G"]),
      "3G": new Set(["2F", "2G", "3F", "5F", "5G"]),
      "4A": new Set(["3A", "3B", "4B", "5A", "5B"]),
      "4B": new Set(["3A", "3B", "3C", "4A", "4C", "5A", "5B", "5C"]),
      "4C": new Set(["3B", "3C", "3D", "4B", "4D", "5B", "5C", "5D"]),
      "4D": new Set(["3C", "3D", "3E", "4C", "4E", "5C", "5D", "5E"]),
      "4E": new Set(["3D", "3E", "3F", "4D", "4F", "5D", "5E", "5F"]),
      "4F": new Set(["3E", "3F", "3G", "4E", "4G", "5E", "5F", "5G"]),
      "4G": new Set(["3F", "3G", "4F", "5F", "5G"]),
      "5A": new Set(["4A", "4B", "5B", "6A", "6B"]),
      "5B": new Set(["4A", "4B", "4C", "5A", "5C", "6A", "6B", "6C"]),
      "5C": new Set(["4B", "4C", "4D", "5B", "5D", "6B", "6C", "6D"]),
      "5D": new Set(["4C", "4D", "4E", "5C", "5E", "6C", "6D", "6E"]),
      "5E": new Set(["4D", "4E", "4F", "5D", "5F", "6D", "6E", "6F"]),
      "5F": new Set(["4E", "4F", "4G", "5E", "5G", "6E", "6F", "6G"]),
      "5G": new Set(["4F", "4G", "5F", "6F", "6G"]),
      "6A": new Set(["5A", "5B", "6B", "7A", "7B"]),
      "6B": new Set(["5A", "5B", "5C", "6A", "6C", "7A", "7B", "7C"]),
      "6C": new Set(["5B", "5C", "5D", "6B", "6D", "7B", "7C", "7D"]),
      "6D": new Set(["5C", "5D", "5E", "6C", "6E", "7C", "7D", "7E"]),
      "6E": new Set(["5D", "5E", "5F", "6D", "6F", "7D", "7E", "7F"]),
      "6F": new Set(["5E", "5F", "5G", "6E", "6G", "7E", "7F", "7G"]),
      "6G": new Set(["5F", "5G", "6F", "7F", "7G"]),
      "7A": new Set(["6A", "6B", "7B"]),
      "7B": new Set(["6A", "6B", "6C", "7A", "7C"]),
      "7C": new Set(["6B", "6C", "6D", "7B", "7D"]),
      "7D": new Set(["6C", "6D", "6E", "7C", "7E"]),
      "7E": new Set(["6D", "6E", "6F", "7D", "7F"]),
      "7F": new Set(["6E", "6F", "6G", "7E", "7G"]),
      "7G": new Set(["6F", "6G", "7F"]),
    } as Record<Coordinate, Set<Coordinate>>;

    // keeping track of which coordinates are busy with which pieces
    this.positions = new Map([
      ["1A", null],
      ["1B", null],
      ["1C", null],
      ["1D", null],
      ["1E", null],
      ["1F", null],
      ["1G", null],
      ["2A", null],
      ["2B", null],
      ["2C", null],
      ["2D", null],
      ["2E", null],
      ["2F", null],
      ["2G", null],
      ["3A", null],
      ["3B", null],
      ["3C", null],
      ["3D", null],
      ["3E", null],
      ["3F", null],
      ["3G", null],
      ["4A", null],
      ["4B", null],
      ["4C", null],
      ["4D", null],
      ["4E", null],
      ["4F", null],
      ["4G", null],
      ["5A", null],
      ["5B", null],
      ["5C", null],
      ["5D", null],
      ["5E", null],
      ["5F", null],
      ["5G", null],
      ["6A", null],
      ["6B", null],
      ["6C", null],
      ["6D", null],
      ["6E", null],
      ["6F", null],
      ["6G", null],
      ["7A", null],
      ["7B", null],
      ["7C", null],
      ["7D", null],
      ["7E", null],
      ["7F", null],
      ["7G", null],
    ]);

    // hydrate the board with the pieces
    if (positions) {
      for (const [coordinate, piece] of Object.entries(positions)) {
        this.positions.set(coordinate as Coordinate, piece);
      }
    }
  }

  /**
   * It returns the content of the position at the given coordinate
   * @param {Coordinate} coord - Coordinate - The coordinate of the position you want to get.
   * @returns The value of the key in the positions Map.
   */
  positionContent(coord: Coordinate) {
    return this.positions.get(coord);
  }

  /**
   * "Move the piece at the given coordinate to the given coordinate."
   *
   * The first line of the function is a comment. Comments are ignored by the compiler
   * @param {Coordinate} from - The coordinate of the piece to move.
   * @param {Coordinate} to - The coordinate to move to.
   */
  move(from: Coordinate, to: Coordinate) {
    const piece = this.positions.get(from);
    if (piece === undefined) {
      throw new Error(`No piece at ${from}`);
    }
    if (this.positions.get(to) !== null) {
      throw new Error(`There is already a piece at ${to}`);
    }
    this.positions.set(to, piece);
    this.positions.set(from, null);
  }

  get randomFreeCoordinate() {
    const freeCoordinates = Array.from(this.positions.keys()).filter(
      (coord) => this.positions.get(coord) === null
    );
    return freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];
  }
}
