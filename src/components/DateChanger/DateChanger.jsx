import { useMemo, useState } from "react";
import classNames from "classnames";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
const now = new Date();

const isSameDate = (date1, date2) => {
    return (
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

const Button = ({ onClick, children, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={classNames("p-4 bg-gray-200 text-white rounded-full w-16 h-16 text-xl font-bold", {
                "opacity-20": disabled,
            })}
        >
            {children}
        </button>
    );
};

export const useDate = () => {
    const [currentTimestamp, setCurrentTimestamp] = useState(now.getTime());
    const isSame = useMemo(
        () => isSameDate(new Date(currentTimestamp), new Date(now)),
        [currentTimestamp]
    );
    
    return {
        currentTimestamp,
        setCurrentTimestamp,
        formattedDate: new Date(currentTimestamp).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
        }),
        previousMonthString: new Date(currentTimestamp - ONE_MONTH_MS).toLocaleString("en-GB", {
            month: "long",
        }),
        isPreviousMonth: (timestamp) => {
            return isSameDate(
                new Date(timestamp),
                new Date(currentTimestamp - ONE_MONTH_MS)
            );
        },
        isSameDate: (timestamp) => {
            return isSameDate(new Date(currentTimestamp), new Date(timestamp));
        },
        toDate: (timestamp) => new Date(timestamp).toLocaleDateString("en-GB"),
        NextButton: ({ children }) => (
            <Button
                disabled={isSame}
                onClick={() => setCurrentTimestamp(currentTimestamp + ONE_MONTH_MS)}
            >
                {'>'}
            </Button>
        ),
        PreviousButton: ({ children }) => (
            <Button
                onClick={() => setCurrentTimestamp(currentTimestamp - ONE_MONTH_MS)}
            >
                {'<'}
            </Button>
        ),
    };
};

const DateChanger = ({ children }) => {
    const [currentTimestamp, setCurrentTimestamp] = useState(now.getTime());
    const isSame = useMemo(
        () => isSameDate(new Date(currentTimestamp), new Date(now)),
        [currentTimestamp]
    );
    
    return (
        <div>
            <Button
                onClick={() => setCurrentTimestamp(currentTimestamp - ONE_MONTH_MS)}
            >
                {'<'}
            </Button>
            <Button
                disabled={isSame}
                onClick={() => setCurrentTimestamp(currentTimestamp + ONE_MONTH_MS)}
            >
                {'>'}
            </Button>
            {children({
                formattedDate: new Date(currentTimestamp).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                }),
                currentTimestamp,
                previousMonthString: new Date(
                    currentTimestamp - ONE_MONTH_MS
                ).toLocaleString("en-GB", {
                    month: "long",
                }),
                isPreviousMonth: (timestamp) => {
                    return isSameDate(
                        new Date(timestamp),
                        new Date(currentTimestamp - ONE_MONTH_MS)
                    );
                },
                // TODO: rename to isCurrentMonth
                isSameDate: (timestamp) => {
                    return isSameDate(new Date(currentTimestamp), new Date(timestamp));
                },
                toDate: (timestamp) => new Date(timestamp).toLocaleDateString("en-GB"),
            })}
        </div>
    );
};

export default DateChanger;
