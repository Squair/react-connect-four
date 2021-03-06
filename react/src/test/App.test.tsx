import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import * as socketio from 'socket.io-client';
import MockedSocket from 'socket.io-mock';
import * as getSocketHost from '../utils/getSocketHost'
import * as createSocket from '../utils/createSocket'
import { defaultGameboardSize } from "../utils/gameboardSizes";


describe("<App />", () => {
    const oldEnv = import.meta.env;
    const username = 'test';

    it('should render correctly', () => {
        render(<App />);
    });

    it('should begin finding a game and open a socket when a username is entered and the user clicks start', () => {
        // Mock env vars for socket io host
        const viteSocketHostMock = 'Test Host';
        const getSocketHostMock = jest.fn().mockReturnValue(viteSocketHostMock);
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);

        const createSocketMock = jest.fn().mockReturnValue(new MockedSocket());
        jest.spyOn(createSocket, 'createSocket').mockImplementation(createSocketMock);

        //Act
        render(<App />);

        const textInput = screen.getByPlaceholderText(/Enter username.../);

        fireEvent.change(textInput, { target: { value: username } });

        const findGameButton = screen.getByRole('button', { name: /Find Game/ });

        fireEvent.click(findGameButton);

        const text = 'Searching for a game';
        const informationText = screen.getByText(text);

        // Assert
        expect(getSocketHostMock).toHaveBeenCalled();
        expect(createSocketMock).toHaveBeenCalledWith(viteSocketHostMock, username, defaultGameboardSize.id);
        expect(informationText).toHaveTextContent(text);
    });

    it('should not begin finding a game or open an socket when a username is empty and the user clicks start', () => {
        const getSocketHostMock = jest.fn();
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);

        const createSocketMock = jest.fn().mockReturnValue(new MockedSocket());
        jest.spyOn(createSocket, 'createSocket').mockImplementation(createSocketMock);
        
        //Act
        render(<App />);

        const findGameButton = screen.getByRole('button', { name: /Find Game/ });

        fireEvent.click(findGameButton);

        const text = 'Searching for a game';
        const informationText = screen.queryByText(text);

        // Assert
        expect(getSocketHostMock).not.toHaveBeenCalled();
        expect(createSocketMock).not.toHaveBeenCalled();
        expect(informationText).not.toBeInTheDocument();
    });

    it('should throw if no environment configuration is found for the socket host', () => {
        // Arrange
        const consoleErrorMock = jest.fn();
        jest.spyOn(global.console, 'error').mockImplementation(consoleErrorMock);

        // Mock env vars for socket io host
        const getSocketHostMock = jest.fn().mockReturnValue(undefined);
        jest.spyOn(getSocketHost, 'getSocketHost').mockImplementation(getSocketHostMock);

        render(<App />);

        const textInput = screen.getByPlaceholderText(/Enter username.../);

        fireEvent.change(textInput, { target: { value: username } });

        const findGameButton = screen.getByRole('button', { name: /Find Game/ });

        fireEvent.click(findGameButton);

        // Assert
        expect(getSocketHostMock).toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalledWith("No configuration provided for socket.io host.");
    });
});