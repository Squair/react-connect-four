import { IPlayer } from "./IPlayer";

export interface IGame {
    id: string;
    players: IPlayer[];
    firstPlayerToMove: IPlayer;
    boardSizeId: string;
}