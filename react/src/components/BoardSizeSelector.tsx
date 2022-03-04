import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FunctionComponent } from "react";
import { IGameboardSize } from "../interface/IGameboardSize";
import { boardsizes } from '../utils/gameboardSizes';

interface BoardSizeSelectorProps {
    gameboardSize: IGameboardSize;
    setGameboardSize: React.Dispatch<React.SetStateAction<IGameboardSize>>;
}

const BoardSizeSelector: FunctionComponent<BoardSizeSelectorProps> = ({ gameboardSize, setGameboardSize }) => {
    const onChange = (_: any, value: any) => setGameboardSize(boardsizes.find(bs => bs.id === value)!);

    const ascendingRowNumber = (a: IGameboardSize, b: IGameboardSize): number => a.rows - b.rows

    return (
        <ToggleButtonGroup
            sx={{ justifyContent: 'center' }}
            value={gameboardSize.id}
            exclusive
            onChange={onChange}
            aria-label="text alignment"
        >
            {boardsizes.sort(ascendingRowNumber).map(boardSize => (
                <ToggleButton key={boardSize.id}
                    sx={{ textAlign: 'center', padding: '0.4em' }}
                    value={boardSize.id}
                >
                    {boardSize.rows} x {boardSize.columns}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    )
}

export default BoardSizeSelector;