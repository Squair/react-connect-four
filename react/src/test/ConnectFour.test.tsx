import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Socket } from 'socket.io-client';
import MockedSocket from 'socket.io-mock';
import ConnectFour from '../components/game/ConnectFour';
import { IGame } from '../interface/IGame';
import { IPlayer } from '../interface/IPlayer';
import { Counter } from '../type/Counter';
import * as foo from '../utils/initializeGameboard';

jest.mock('socket.io-client');

describe("<ConnectFour />", () => {
    let socket: Socket = new MockedSocket();
    const finishGame = jest.fn();

    const players: IPlayer[] = [
        { id: '1', counter: '🔴', username: 'Red player' },
        { id: '2', counter: '🟡', username: 'Yellow player' },
    ]

    const game: IGame = {
        id: "1",
        players: players,
        firstPlayerToMove: players[0] // First play to go is 🔴
    }

    const columns = 7;
    const rows = 6;
    const contiguousCountersToWin = 4;

    beforeEach(() => {
        socket = new MockedSocket();
    });

    it('should display a message indicating the first user to play', () => {
        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGame} game={game} />)
        expect(screen.getByText(`${game.firstPlayerToMove.username}'s (${game.firstPlayerToMove.counter}) turn!`)).toBeInTheDocument();
    });

    it('should render an empty grid containing a number of items equal to columns multiplied by rows', async () => {
        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGame} game={game} />)
        const emptyGameBoardPieces = await screen.findAllByText('⚪');
        expect(emptyGameBoardPieces.length).toBe(rows * columns)
    });

    it('Clicking the first column should place a 🔴 when first player to go is 🔴', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGame} game={game} />)

        const bottomLeftGridItem = screen.getByLabelText(`${rows - 1}:0`);
        expect(bottomLeftGridItem).toBeTruthy();

        fireEvent.click(bottomLeftGridItem);

        expect(bottomLeftGridItem).toHaveTextContent('🔴')
    });

    it('Clicking the first column should not place a 🟡 when player to go first is 🔴', async () => {
        // Ensure socket id doesn't match the player id going first
        socket.id = players.find(p => p.id !== game.firstPlayerToMove.id)!.id;

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGame} game={game} />)

        const bottomLeftGridItem = screen.getByLabelText(`${rows - 1}:0`);
        expect(bottomLeftGridItem).toBeTruthy();

        fireEvent.click(bottomLeftGridItem);

        expect(bottomLeftGridItem).not.toHaveTextContent('🟡');
        expect(bottomLeftGridItem).toHaveTextContent('⚪');
    });

    it('Should show win when 🔴 gets correct number of contiguousCountersToWin in a horizontal line', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gridOneMoveBeforeHorizontalWin: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '🟡'],
            ['⚪', '🔴', '🔴', '🔴', '⚪', '🟡', '🟡'],
        ]

        jest.spyOn(foo, 'initializeGameBoard').mockReturnValue(gridOneMoveBeforeHorizontalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGame} game={game} />)
        
        const bottomLeftGridItem = screen.getByLabelText(`${rows - 1}:0`);
        expect(bottomLeftGridItem).toBeTruthy();

        fireEvent.click(bottomLeftGridItem);

        expect(bottomLeftGridItem).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });
});