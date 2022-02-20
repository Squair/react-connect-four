import { Counter } from "../type/Counter";

export interface IMove {
    gameId: string;
    counter: Counter;
    column: number;
}