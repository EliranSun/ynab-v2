import classNames from "classnames";

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
                       }) => (
    <button
        className={classNames({
            "p-2 border border-gray-200 rounded shadow-md": true,
            "bg-black text-white": isSelected,
            "text-xs md:text-sm": true,
        })}
        onClick={() => {
            setStartDate(startDate);
            setEndDate(endDate);
            setTimeframeName(timeframe);
            onClick(label);
        }}>
        {label}
    </button>
);