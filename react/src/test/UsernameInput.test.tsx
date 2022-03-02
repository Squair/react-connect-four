import { fireEvent, render, screen } from "@testing-library/react";
import UsernameInput from "../components/UsernameInput";

describe("<UsernameInput />", () => {
    const setUsernameMock = jest.fn();
    const usernameInputProps = { username: "test", setUsername: setUsernameMock }

    it('should render with an empty string in the input when username is undefined', () => {
        render(<UsernameInput username={undefined} setUsername={usernameInputProps.setUsername} />);
        
        const textInput = screen.getByPlaceholderText(/Enter username.../);
        expect(textInput).toHaveTextContent('');
    });

    it('should call the setUsername when the on change event fires', () => {
        render(<UsernameInput {...usernameInputProps} />);
        
        const textInput = screen.getByPlaceholderText(/Enter username.../);

        fireEvent.change(textInput, { target: {value: 'new test value'}});
        expect(setUsernameMock).toHaveBeenCalled();
    });
});