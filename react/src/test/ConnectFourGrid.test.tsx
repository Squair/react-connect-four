import { render, screen } from '@testing-library/react'
import React from 'react';
import ConnectFourGrid from '../components/game/ConnectFourGrid'
import { Socket } from 'socket.io-client';
import MockedSocket from 'socket.io-mock';
import { IGame } from '../interface/IGame';
import { IPlayer } from '../interface/IPlayer';

jest.mock('socket.io-client');


describe("<ConnectFourGrid />", () => {
    let socket: Socket
    const finishGame = jest.fn();

    const players: IPlayer[] = [
        {id: '1', counter: '🔴', username: 'Red player'},
        {id: '2', counter: '🟡', username: 'Yellow player'},
    ]

    const game: IGame = {
        id: "1",
        players: players,
        firstPlayerToMove: players[0]
    }

    beforeEach(() => {
      socket = new MockedSocket();
    });

    it('should render correctly', () => {
        render(<ConnectFourGrid socket={socket} game={game} finishGame={finishGame} columns={7} rows={6} contiguousCountersToWin={4}  />)
        expect(screen.getByText(`${players[0].username}'s (${players[0].counter}) turn!`)).toBeInTheDocument();
    });
});