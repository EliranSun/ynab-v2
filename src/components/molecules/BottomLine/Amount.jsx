import classNames from "classnames";
import {formatCurrency} from "../../../utils";
import {round} from "lodash";

const Amount = ({
    children,
    isExpense = false,
    withRounding = false,
    isDifference,
    size = Amount.Size.MEDIUM
}) => {
    const value = (children);
    if (isNaN(value)) {
        return value;
    }

    return (
        <h2 className={classNames({
            "font-mono": true,
            "text-xs md:text-4xl": size === Amount.Size.SMALL,
            "text-3xl md:text-5xl": size === Amount.Size.MEDIUM,
            "text-4xl md:text-9xl": size === Amount.Size.LARGE,
            "text-green-500": (isDifference && (value >= 0)) || !isExpense,
            "text-red-500": (isDifference && (value < 0)) || isExpense,
        })}>
            {formatCurrency(round(value, withRounding ? -1 : 0), false, false)}
        < /h2>
    );
};

Amount.Size = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
};

export {Amount};