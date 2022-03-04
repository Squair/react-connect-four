import useGameSetupUtilities from "../hooks/gameSetupUtilities";
import { act, renderHook } from "@testing-library/react-hooks";
import SocketMock from 'socket.io-mock';
import { IGame } from "../interface/IGame";
import { IPlayer } from "../interface/IPlayer";
import { waitFor } from "@testing-library/dom";
import * as getSocketHost from '../utils/getSocketHost';
import * as createSocket from '../utils/createSocket';


describe("useGameSetupUtilities hook", () => {
    beforeEach(() => {

    })

    it("should create a socket and set the game state to 'Finding game' when beginFindingGame is called.", async () => {
        const viteSocketHostMock = 'Test Host';
        const getSocketHostMock = jest.fn().mockReturnValue(viteSocketHostMock);
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);

        const socketMock = new SocketMock();
        const socketClientMock = socketMock.socketClient;

        const createSocketMock = jest.fn().mockReturnValue(socketClientMock);
        jest.spyOn(createSocket, 'createSocket').mockImplementation(createSocketMock);

        const username = "Test username";
        const { result } = renderHook(() => useGameSetupUtilities(username));

        act(() => result.current.beginFindingGame());

        expect(result.current.gameState).toBe('Finding game')
        expect(result.current.socket).toBe(socketClientMock)
    });

    it("should disconnect the socket, set foundGame to undefined and set the game state to 'Idle' when endGame is called.", async () => {
        const viteSocketHostMock = 'Test Host';
        const getSocketHostMock = jest.fn().mockReturnValue(viteSocketHostMock);
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);

        const socketMock = new SocketMock();
        const socketClientMock = socketMock.socketClient;

        const createSocketMock = jest.fn().mockReturnValue(socketClientMock);
        jest.spyOn(createSocket, 'createSocket').mockImplementation(createSocketMock);

        const username = "Test username";
        const { result } = renderHook(() => useGameSetupUtilities(username));

        // Begin finding game
        act(() => result.current.beginFindingGame());

        expect(result.current.gameState).toBe('Finding game')
        expect(result.current.socket).toBe(socketClientMock)

        const mockPlayer: IPlayer = { id: '1', counter: '🔴', username: 'Test' }
        const mockGame: IGame = { id: '1', firstPlayerToMove: mockPlayer, players: []}
        
        // Mock a found game
        act(() => socketMock.emit('found game', mockGame));
        expect(result.current.gameState).toBe('Found game');

        
        act(() => result.current.endGame());

        expect(result.current.gameState).toBe('Idle');
        expect(socketClientMock.disconnected).toBe(true);
        expect(result.current.foundGame).toBe(undefined);
    });
})