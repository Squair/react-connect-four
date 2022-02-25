import { Counter } from "../type/Counter";

export const initializeGameBoard = (cols: number, rows: number) => {
    const emptyGrid: Counter[][] = [];

    for (let row = 0; row < rows; row++) {
        emptyGrid[row] = new Array<Counter>(cols).fill('⚪');
    }

    return emptyGrid;
}