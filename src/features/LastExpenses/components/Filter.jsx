import classNames from "classnames";
import {useLingui} from "@lingui/react";

export const Filter = ({
    label,
    startDate,
    endDate,
    timeframe,
    setStartDate,
    setEndDate,
    setTimeframeName,
    isSelected,
    onClick
}) => {
    const {_} = useLingui();

    return (
        <button
            className={classNames({
                "p-2 border border-gray-200 rounded": true,
                "bg-black text-white": isSelected,
                "shadow bg-white": !isSelected,
                "text-xs md:text-sm": true,
            })}
            onClick={() => {
                setStartDate(startDate);
                setEndDate(endDate);
                setTimeframeName(timeframe);
                onClick(label);
            }}>
            {_(label)}
        </button>
    );
}