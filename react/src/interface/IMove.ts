import { Counter } from "../type/Counter";

export interface IMove {
    opposingPlayerId: string;
    counter: Counter;
    column: number;
}