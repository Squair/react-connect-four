import { IGameboardSize } from "..";

export const defaultGameboardSize: IGameboardSize = { id: '0', rows: 6, columns: 7 };

export const boardsizes: IGameboardSize[] = [
    defaultGameboardSize,
    { id: '1', rows: 5, columns: 4 },
    { id: '2', rows: 6, columns: 5 },
    { id: '3', rows: 7, columns: 8 },
    { id: '4', rows: 9, columns: 7 },
    { id: '5', rows: 8, columns: 8 },
    { id: '6', rows: 10, columns: 7 },
]
