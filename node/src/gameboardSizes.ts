import { IGameboardSize } from "..";

export const defaultGameboardSize: IGameboardSize = { id: '0', rows: 6, columns: 7 };

export const boardsizes: IGameboardSize[] = [
    defaultGameboardSize,
    { id: '1', rows: 4, columns: 5 },
    { id: '2', rows: 5, columns: 6 },
    { id: '3', rows: 7, columns: 8 },
    { id: '4', rows: 7, columns: 8 },
    { id: '5', rows: 7, columns: 9 },
    { id: '6', rows: 7, columns: 10 },
    { id: '7', rows: 8, columns: 8 },
]
