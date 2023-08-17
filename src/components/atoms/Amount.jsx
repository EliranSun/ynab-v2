import { ErrorBoundary } from "../ErrorBoundary";
import classNames from "classnames";
import { isUndefined } from "lodash";


const Amount = ({ amount, label, isPositive, isVisible = true, isCurrency = true }) => {
    if (!isVisible || !amount) {
        return null;
    }

    const value = isCurrency ? `${amount.toFixed(2)} NIS ` : `${amount} `;

    return (
        <ErrorBoundary fallback={<div>{amount}</div>}>
            <div className={classNames("", {
                "text-green-500": isUndefined(isPositive) ? false : isPositive,
                "text-red-500": isUndefined(isPositive) ? false : !isPositive,
            })}>
                <span className="font-bold">{value}</span>
                <span>{label}</span>
            </div>
        </ErrorBoundary>
    );
};

export default Amount;