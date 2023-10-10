import { formatCurrency } from "../../../utils";
import classNames from "classnames";

export const NetSummary = ({ label, income = 0, outcome = 0 }) => {
  const bottomLine = income - outcome;
  return (
    <div
      className="flex flex-col md:flex-row w-full md:gap-4 md:items-start font-mono text-xl font-bold justify-between">
      <span>{label}:</span>
      <div className="flex" dir="ltr">
        <div className="inline">
          <span className="text-green-400">{formatCurrency(income, true, true)}</span>
          <span className="text-red-400">{formatCurrency(-outcome, true, true)}</span>
          =
        </div>
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