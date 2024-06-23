import {useMemo, useState} from "react";
import classNames from "classnames";
import {SkipBack, SkipForward} from "@phosphor-icons/react";
import {isMobile} from "../../utils/device";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
const now = new Date();

const isSameDate = (date1, date2) => {
    return (
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

const Button = ({onClick, children, disabled}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={classNames({
                "flex items-center p-2 bg-gray-200": true,
                "rounded-full w-10 h-10 font-bold border border-gray-500": true,
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
        NextButton: ({children}) => (
            <Button
                // disabled={isSame}
                onClick={() => setCurrentTimestamp(currentTimestamp + ONE_MONTH_MS)}
            >
                {isMobile() ?
                    <SkipBack color="black" size={32}/> :
                    <SkipForward color="black" size={32}/>}
            </Button>
        ),
        PreviousButton: ({children}) => (
            <Button onClick={() => setCurrentTimestamp(currentTimestamp - ONE_MONTH_MS)}>
                {isMobile() ?
                    <SkipForward color="black" size={32}/> :
                    <SkipBack color="black" size={32}/>}
            </Button>
        ),
    };
};

const DateChanger = ({children}) => {
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