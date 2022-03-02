import { fireEvent, render, screen } from "@testing-library/react";
import Lobby from "../components/Lobby";

describe("<Lobby />", () => {
    const cancelFindingGame = jest.fn();
    const lobbyProps = { username: "test", cancelFindingGame}

    it('should show the username, information, circular progress indicator and a cancel button', () => {
        render(<Lobby {...lobbyProps} />);

        const username = screen.getByText(lobbyProps.username);

        const text = 'Searching for a game';
        const informationText = screen.getByText(text);

        const circularProgressIndicator = screen.getByRole('progressbar');
        const cancelButton = screen.getByRole('button', { name: 'Cancel'});

        expect(username).toHaveTextContent(lobbyProps.username);
        expect(informationText).toHaveTextContent(text);
        expect(circularProgressIndicator).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('should call cancel finding game when cancel is clicked', () => {
        render(<Lobby {...lobbyProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel'});
        fireEvent.click(cancelButton);
        
        expect(cancelFindingGame).toHaveBeenCalled();
    });
});