import { formatCurrency } from "../../../utils";
import classNames from "classnames";

export const NetSummary = ({ label, income = 0, outcome = 0 }) => {
  const bottomLine = income - outcome;
  return (
    <div className="flex flex-col md:flex-row w-full md:gap-4 md:items-center font-mono text-4xl font-bold mb-2">
      <span>{label}:</span>
      <div className="flex">
        <div className="flex gap-1">
          <span className="text-green-400">
            {formatCurrency(income, true, true)}
          </span>
          <span className="text-red-400">
            {formatCurrency(-outcome, true, true)}
          </span>
        </div>
        <span>
          =
        </span>
        <span className={classNames("text-white", {
          'bg-green-500': bottomLine > 0,
          'bg-red-500': bottomLine < 0,
        })}>
          {formatCurrency(bottomLine, true, true)}
        </span>
      </div>
    </div>
  )
};