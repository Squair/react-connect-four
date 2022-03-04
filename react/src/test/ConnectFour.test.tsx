import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Socket } from 'socket.io-client';
import MockedSocket from 'socket.io-mock';
import ConnectFour from '../components/game/ConnectFour';
import { IGame } from '../interface/IGame';
import { IPlayer } from '../interface/IPlayer';
import { Counter } from '../type/Counter';
import * as initializeGameboard from '../utils/initializeGameboard';
import * as connectFourUtilities from '../hooks/connectFourUtilities';
import { boardsizes, defaultGameboardSize } from '../utils/gameboardSizes';

jest.mock('socket.io-client');

describe("<ConnectFour />", () => {
    let socket: Socket = new MockedSocket();
    const finishGameMock = jest.fn();

    const redPlayer: IPlayer = { id: '1', counter: '🔴', username: 'Red player' };
    const yellowPlayer: IPlayer = { id: '2', counter: '🟡', username: 'Yellow player' }

    const players: IPlayer[] = [redPlayer, yellowPlayer];

    const game: IGame = {
        id: "1",
        players: players,
        firstPlayerToMove: players[0], // First play to go is 🔴
        boardSizeId: defaultGameboardSize.id
    }

    const columns = 7;
    const rows = 6;
    const contiguousCountersToWin = 4;

    beforeEach(() => {
        socket = new MockedSocket();
    });

    it('should display a message indicating the first user to play', () => {
        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)
        expect(screen.getByText(`${game.firstPlayerToMove.username}'s (${game.firstPlayerToMove.counter}) turn!`)).toBeInTheDocument();
    });

    it('should render an empty grid containing a number of items equal to columns multiplied by rows', async () => {
        boardsizes.map(bs => {
            const { unmount } = render(<ConnectFour socket={socket} columns={bs.columns} rows={bs.rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)
            
            const emptyGameBoardPieces = screen.getAllByText('⚪');
            expect(emptyGameBoardPieces.length).toBe(bs.rows * bs.columns)
            
            //unmount each time so next iterations render doesn't also include the previous
            unmount();
        })
    });

    it('clicking the first column should place a 🔴 when first player to go is 🔴', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const bottomLeftGridItem = screen.getByLabelText(`${rows - 1}:0`);
        expect(bottomLeftGridItem).toBeTruthy();

        fireEvent.click(bottomLeftGridItem);

        expect(bottomLeftGridItem).toHaveTextContent('🔴')
    });

    it('clicking the first column should not place a 🟡 when player to go first is 🔴', async () => {
        // Ensure socket id doesn't match the player id going first
        socket.id = players.find(p => p.id !== game.firstPlayerToMove.id)!.id;

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const bottomLeftGridItem = screen.getByLabelText(`${rows - 1}:0`);
        expect(bottomLeftGridItem).toBeTruthy();

        fireEvent.click(bottomLeftGridItem);

        expect(bottomLeftGridItem).not.toHaveTextContent('🟡');
        expect(bottomLeftGridItem).toHaveTextContent('⚪');
    });

    it('should show win when 🔴 gets correct number of contiguousCountersToWin in a horizontal line', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeHorizontalWin: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '🟡'],
            ['⚪', '🔴', '🔴', '🔴', '⚪', '🟡', '🟡'],
            /* ^ Winning move*/
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeHorizontalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const winningPosition = screen.getByLabelText(`${rows - 1}:0`);
        expect(winningPosition).toBeTruthy();

        fireEvent.click(winningPosition);

        expect(winningPosition).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });

    it('should show win when 🔴 gets correct number of contiguousCountersToWin in a vertical line', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeVerticalWin: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
  /*Win ->*/['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '🟡'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '🟡', '🟡'],
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeVerticalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const winningPosition = screen.getByLabelText(`${rows - 1}:0`);
        expect(winningPosition).toBeTruthy();

        fireEvent.click(winningPosition);

        expect(winningPosition).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });

    it('should show win when 🔴 gets correct number of contiguousCountersToWin in a vertical line (boundary check)', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeVerticalWin: Counter[][] = [
  /*Win ->*/['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🟡', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🟡', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeVerticalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const winningPosition = screen.getByLabelText(`0:0`);
        expect(winningPosition).toBeTruthy();

        fireEvent.click(winningPosition);

        expect(winningPosition).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });

    it('should show win when 🔴 gets correct number of contiguousCountersToWin in a ascending diagonal line', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeAscendingDiagonalWin: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
  /*Win ->*/['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '🔴', '🟡', '⚪', '⚪', '⚪'],
            ['⚪', '🔴', '🟡', '🟡', '⚪', '⚪', '⚪'],
            ['🔴', '🟡', '🟡', '🟡', '⚪', '⚪', '⚪'],
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeAscendingDiagonalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const winningPosition = screen.getByLabelText('2:3');
        expect(winningPosition).toBeTruthy();

        fireEvent.click(winningPosition);

        expect(winningPosition).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });

    it('should show win when 🔴 gets correct number of contiguousCountersToWin in a descending diagonal line', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeDescendingDiagonalWin: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
  /*Win ->*/['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🟡', '🔴', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🟡', '🟡', '🔴', '⚪', '⚪', '⚪', '⚪'],
            ['🟡', '🟡', '🟡', '🔴', '⚪', '⚪', '⚪'],
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeDescendingDiagonalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const winningPosition = screen.getByLabelText('2:0');
        expect(winningPosition).toBeTruthy();

        fireEvent.click(winningPosition);

        expect(winningPosition).toHaveTextContent('🔴');
        expect((await screen.findAllByText('🔴')).length).toBe(contiguousCountersToWin);
        expect(screen.getByText(`${game.firstPlayerToMove.username}(${game.firstPlayerToMove.counter}) has won!`)).toBeInTheDocument();
    });

    it('should show message indicating draw when there are no more moves available', async () => {
        // Ensure socket id matches the player id going first
        socket.id = game.firstPlayerToMove.id;

        const gameboardOneMoveBeforeDescendingDiagonalWin: Counter[][] = [
 /*Draw ->*/['⚪', '🔴', '🟡', '🔴', '🟡', '🔴', '🟡'],
            ['🔴', '🔴', '🟡', '🔴', '🔴', '🔴', '🟡'],
            ['🟡', '🟡', '🔴', '🔴', '🟡', '🟡', '🔴'],
            ['🔴', '🔴', '🟡', '🟡', '🟡', '🔴', '🟡'],
            ['🟡', '🔴', '🟡', '🔴', '🟡', '🔴', '🟡'],
            ['🟡', '🔴', '🟡', '🔴', '🔴', '🔴', '🟡'],
        ]

        jest.spyOn(initializeGameboard, 'initializeGameBoard').mockReturnValue(gameboardOneMoveBeforeDescendingDiagonalWin);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const drawingPosition = screen.getByLabelText('0:0');
        expect(drawingPosition).toBeTruthy();

        fireEvent.click(drawingPosition);

        expect(drawingPosition).toHaveTextContent('🔴');
        expect(screen.getByText('Draw!')).toBeInTheDocument();
    });

    it('should show a return to lobby button when a player has won, calls finishGame when clicked', async () => {
        socket.id = game.firstPlayerToMove.id;

        const redPlayerWinGameboard: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '🟡'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '🟡', '🟡'],
        ]

        const useConnectFourUtilsMockRedPlayerWon = {
            makeMove: jest.fn(),
            gameboard: redPlayerWinGameboard,
            currentPlayer: redPlayer,
            winningPlayer: redPlayer,
            draw: false,
            GameInformationText: jest.fn().mockImplementation(() => <div></div>)
        }

        jest.spyOn(connectFourUtilities, 'default').mockReturnValue(useConnectFourUtilsMockRedPlayerWon);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const returnToLobbyButton = screen.getByRole('button', { name: /return to lobby/i });
        expect(returnToLobbyButton).toBeInTheDocument();

        fireEvent.click(returnToLobbyButton);

        expect(finishGameMock).toHaveBeenCalled();
    });

    it('should show a return to lobby button when the game draws, calls finishGame when clicked', async () => {
        socket.id = game.firstPlayerToMove.id;

        const redPlayerWinGameboard: Counter[][] = [
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '⚪', '🟡'],
            ['🔴', '⚪', '⚪', '⚪', '⚪', '🟡', '🟡'],
        ]

        const useConnectFourUtilsMockDraw = {
            makeMove: jest.fn(),
            gameboard: redPlayerWinGameboard,
            currentPlayer: redPlayer,
            winningPlayer: undefined,
            draw: true, // <-- Set draw to true
            GameInformationText: jest.fn().mockImplementation(() => <div></div>)
        }

        jest.spyOn(connectFourUtilities, 'default').mockReturnValue(useConnectFourUtilsMockDraw);

        render(<ConnectFour socket={socket} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} finishGame={finishGameMock} game={game} />)

        const returnToLobbyButton = screen.getByRole('button', { name: /return to lobby/i });
        expect(returnToLobbyButton).toBeInTheDocument();

        fireEvent.click(returnToLobbyButton);

        expect(finishGameMock).toHaveBeenCalled();
    });
});