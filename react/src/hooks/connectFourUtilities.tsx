import { Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IGame } from "../interface/IGame";
import { IMove } from "../interface/IMove";
import { IPlayer } from "../interface/IPlayer";
import { Counter } from "../type/Counter";
import { initializeGameBoard } from "../utils/initializeGameboard";

const useConnectFourUtilities = (socket: Socket, game: IGame, columns: number, rows: number, contiguousCountersToWin: number) => {
    const [gameboard, setGameBoard] = useState<Counter[][]>(initializeGameBoard(columns, rows));

    const [winningPlayer, setWinningPlayer] = useState<IPlayer>();
    const [draw, setDraw] = useState<boolean>(false);

    const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(game.firstPlayerToMove);

    // Recieve moves from opposing player, re-play them on board
    useEffect(() => {
        socket.on("recieve move", (move: IMove) => {
            const counterAdded = addCounterToColumn(move.counter, move.column);
            setGameBoard(counterAdded.newGameboard);

            if (counterAdded.rowAdded && isWinningMove(counterAdded.newGameboard, move.counter, counterAdded.rowAdded, move.column)) {
                return setWinningPlayer(getPlayerFromCounter(move.counter));
            }

            if (areNoMoreMoves(counterAdded.newGameboard)) {
                return setDraw(true);
            }

            switchToPlayer(move.opposingPlayerId);
        });

        // Disconnect players after game finished
        if (winningPlayer) socket.disconnect();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, winningPlayer]);

    const switchToPlayer = (playerId: string) => setCurrentPlayer(game.players.filter(x => x.id === playerId)[0]);
    const getPlayerFromCounter = (counter: Counter) => game.players.filter(x => x.counter === counter)[0];
    const getOpposingPlayerId = (): string => game.players.filter(x => x.id !== socket.id)[0].id;

    const canMakeMove = (): boolean => !winningPlayer && socket.id === currentPlayer.id

    const makeMove = (column: number) => {
        if (!canMakeMove()) return;

        const counter = currentPlayer.counter;
        const counterAdded = addCounterToColumn(counter, column);
        setGameBoard(counterAdded.newGameboard);

        const opposingPlayerId = getOpposingPlayerId();
        const move: IMove = { opposingPlayerId: opposingPlayerId, counter, column };
        socket.emit("send move", move);

        if (counterAdded.rowAdded && isWinningMove(counterAdded.newGameboard, counter, counterAdded.rowAdded, column)) {
            return setWinningPlayer(getPlayerFromCounter(counter));
        }

        if (areNoMoreMoves(counterAdded.newGameboard)) {
            return setDraw(true);
        }

        switchToPlayer(opposingPlayerId);
    }

    const addCounterToColumn = (counter: Counter, column: number): { rowAdded?: number, newGameboard: Counter[][] } => {
        if (isColumnFull(gameboard, column)) return { rowAdded: undefined, newGameboard: gameboard };

        const newGameboard = [...gameboard];

        let rowAdded;

        //Start at the bottom of the grid and loop backwards as connect four pieces drop down to the bottom
        for (let row = rows - 1; row >= 0; row--) {
            if (newGameboard[row][column] === '⚪') {
                newGameboard[row][column] = counter;
                rowAdded = row;
                break;
            }
        }

        return { rowAdded, newGameboard };
    }

    const areNoMoreMoves = (gameboard: Counter[][]) => {
        for (let c = 0; c < columns; c++) {
            if (!isColumnFull(gameboard, c)) {
                return false
            }
        }
        return true;
    }

    // Get if top row for column is not empty.
    const isColumnFull = (gameboard: Counter[][], column: number) => gameboard[0][column] !== '⚪';

    const isWinningMove = (gameboardToCheck: Counter[][], counter: Counter, rowLastPlayed: number, columnLastPlayed: number): boolean => {
        let contiguousCounters = 0;
        let colCounter;

        // Check horizonal lines
        for (let column = 0; column <= columns - 1; column++) {
            contiguousCounters = gameboardToCheck[rowLastPlayed][column] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;
        }

        // Check vertical lines
        contiguousCounters = 0;
        for (let row = rows - 1; row >= 0; row--) {
            contiguousCounters = gameboardToCheck[row][columnLastPlayed] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;
        }

        // Check descending lines (works)
        const { descMinRow, descMaxRow } = getDescendingRowMinMax(rowLastPlayed, columnLastPlayed, rows, columns);
        const { descMinCol, descMaxCol } = getDescendingColMinMax(rowLastPlayed, columnLastPlayed, rows, columns);

        contiguousCounters = 0;
        colCounter = descMinCol;

        for (let row = descMinRow; row <= descMaxRow; row++) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;

            if (contiguousCounters === contiguousCountersToWin) return true;

            if (colCounter === descMaxCol) break;
            colCounter++;
        }

        //Check ascending lines
        const { ascMinRow, ascMaxRow } = getAccendingRowMinMax(rowLastPlayed, columnLastPlayed, rows, columns);
        const { ascMinCol, ascMaxCol } = getAccendingColMinMax(rowLastPlayed, columnLastPlayed, rows, columns);

        contiguousCounters = 0;
        colCounter = ascMinCol;

        for (let row = ascMaxRow; row >= ascMinRow; row--) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;

            if (colCounter === ascMaxCol) break;
            colCounter++;
        }

        return false;
    }

    const getDescendingRowMinMax = (row: number, col: number, totalRows: number, totalCols: number) => {
        const descMinRow = Math.max(0, row - col);
        const descMaxRow = Math.min(totalRows - 1, (totalCols - col) + row);

        return { descMinRow, descMaxRow }
    }

    const getDescendingColMinMax = (row: number, col: number, totalRows: number, totalCols: number) => {
        const descMinCol = Math.max(0, col - row);
        const descMaxCol = Math.min(totalCols - 1, ((totalRows - 1) - row) + col);

        return { descMinCol, descMaxCol }
    }

    const getAccendingRowMinMax = (row: number, col: number, totalRows: number, totalCols: number) => {
        const ascMaxRow = Math.min(totalRows - 1, row + col);
        const ascMinRow = Math.max(0, row - ((totalCols - 1) - col));

        return { ascMinRow, ascMaxRow }
    }

    const getAccendingColMinMax = (row: number, col: number, totalRows: number, totalCols: number) => {
        const ascMinCol = Math.max(0, col - ((totalRows - 1) - row))
        const ascMaxCol = Math.min(totalCols - 1, ((totalCols - 1) - row) + col);

        return { ascMinCol, ascMaxCol }
    }

    const GameInformationText: FunctionComponent = () => {
        let message;
        if (winningPlayer) {
            message = `${winningPlayer.username}(${winningPlayer.counter}) has won!`;
        } else if (draw) {
            message = `Draw!`;
        } else {
            message = `${currentPlayer.username}'s (${currentPlayer.counter}) turn!`;
        }

        return <Typography textAlign='center' variant='h5'>{message}</Typography>
    }

    return { makeMove, gameboard, currentPlayer, winningPlayer, draw, GameInformationText }
}

export default useConnectFourUtilities;