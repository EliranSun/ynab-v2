import { noop } from "lodash";

const TransactionsLayoutButtons = ({ onToggleClick = noop, onExpandClick = noop, isToggled = false }) => {
    return (
        <div>
            <button
                onClick={onToggleClick}
                className="text-3xl border border-black rounded fixed right-10 bottom-10">
                {isToggled ? '➖' : '➕'}
            </button>
            <button
                onClick={onExpandClick}
                className="text-3xl border border-black rounded fixed right-10 bottom-20">
                ↕️
            </button>
        </div>
    );
};

export default TransactionsLayoutButtons;