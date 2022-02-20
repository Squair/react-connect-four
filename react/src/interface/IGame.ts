import { IPlayer } from "./IPlayer";

export interface IGame {
    id: string;
    players: IPlayer[];
}