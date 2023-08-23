import { ErrorBoundary } from "../../ErrorBoundary";
import classNames from "classnames";
import { isUndefined } from "lodash";
import { formatCurrency } from "../../../utils";


const Amount = ({ amount = 0, label = "", isPositive = true, isVisible = true }) => {
  if (!isVisible || isNaN(amount)) {
    return null;
  }
  
  return (
    <ErrorBoundary fallback={<div>{amount}</div>}>
      <div className={classNames("", {
        "text-green-500": isUndefined(isPositive) ? false : isPositive,
        "text-red-500": isUndefined(isPositive) ? false : !isPositive,
      })}>
        <span className="font-bold">{formatCurrency(amount)}</span>
        {label && <span> - {label}</span>}
      </div>
    </ErrorBoundary>
  );
};

export default Amount;