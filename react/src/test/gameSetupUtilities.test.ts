import { act, renderHook } from "@testing-library/react-hooks";
import SocketMock from 'socket.io-mock';
import useGameSetupUtilities from "../hooks/gameSetupUtilities";
import { IGame } from "../interface/IGame";
import { IPlayer } from "../interface/IPlayer";
import * as createSocket from '../utils/createSocket';
import * as getSocketHost from '../utils/getSocketHost';

describe("useGameSetupUtilities hook", () => {
    const username = "Test username";
    const viteSocketHostMock = 'Test Host';
    let getSocketHostMock;
    
    //No types available from socket.io-mock have to use any here
    let socketMock: any;
    let socketClientMock: any; 
    let createSocketMock;

    beforeEach(() => {
        socketMock = new SocketMock();
        socketClientMock = socketMock.socketClient;
        createSocketMock = jest.fn().mockReturnValue(socketClientMock);
        jest.spyOn(createSocket, 'createSocket').mockImplementation(createSocketMock);

        getSocketHostMock = jest.fn().mockReturnValue(viteSocketHostMock);
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);
    })

    it("should create a socket and set the game state to 'Finding game' when beginFindingGame is called.", async () => {
        const { result } = renderHook(() => useGameSetupUtilities(username));

        act(() => result.current.beginFindingGame());

        expect(result.current.gameState).toBe('Finding game')
        expect(result.current.socket).toBe(socketClientMock)
    });

    it("should set the game state to 'Found game' when the socket server emits a message.", async () => {
        const { result } = renderHook(() => useGameSetupUtilities(username));

        // Arrange
        act(() => result.current.beginFindingGame());

        const mockPlayer: IPlayer = { id: '1', counter: '🔴', username: 'Test' }
        const mockGame: IGame = { id: '1', firstPlayerToMove: mockPlayer, players: [] }

        // Act here to ensure found game is set
        act(() => socketMock.emit('found game', mockGame));
        expect(result.current.foundGame).toBe(mockGame);
        expect(result.current.gameState).toBe('Found game');
    });

    it("should disconnect the socket, set foundGame to undefined and set the game state to 'Idle' when endGame is called.", async () => {
        const { result } = renderHook(() => useGameSetupUtilities(username));

        // Arrange
        act(() => result.current.beginFindingGame());

        const mockPlayer: IPlayer = { id: '1', counter: '🔴', username: 'Test' }
        const mockGame: IGame = { id: '1', firstPlayerToMove: mockPlayer, players: [] }

        // Act here to ensure found game is set
        act(() => socketMock.emit('found game', mockGame));
        expect(result.current.foundGame).toBe(mockGame);

        // Act
        act(() => result.current.endGame());

        // Assert
        expect(result.current.gameState).toBe('Idle');
        expect(socketClientMock.disconnected).toBe(true);
        expect(result.current.foundGame).toBe(undefined);
    });
})