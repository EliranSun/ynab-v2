import {formatCurrency} from "../../utils";
import classNames from "classnames";

export const RealityVsExpectation = ({categories, budgetSummary}) => {
    return (
        <div className="flex flex-col">
            <span className="text-xs">
                Reality (actual)
            </span>
            <div className="flex items-center w-full justify-start gap-4 text-3xl font-mono mb-2">
                <div className="bg-green-500 text-white">
                    {formatCurrency(categories.totalIncome)}
                </div>
                <div className="bg-red-500 text-white">
                    {formatCurrency(-categories.totalExpenses)}
                </div>
                =
                <div className={classNames({
                    "font-black": true,
                    "text-green-500": (categories.totalIncome - categories.totalExpenses) > 0,
                    "text-red-500": (categories.totalIncome - categories.totalExpenses) < 0,
                })}>
                    {formatCurrency(categories.totalIncome - categories.totalExpenses)}
                </div>
            </div>
            <span className="text-xs">
                Expectation (budget)
            </span>
            <div className="flex items-center w-full justify-start gap-4 text-3xl font-mono opacity-70">
                <div className="bg-green-500 text-white">
                    {formatCurrency(budgetSummary.totalIncome)}
                </div>
                <div className="bg-red-500 text-white">
                    {formatCurrency(-budgetSummary.totalExpenses)}
                </div>
                =
                <div className={classNames({
                    "font-black": true,
                    "text-green-500": budgetSummary.totalIncome - budgetSummary.totalExpenses > 0,
                    "text-red-500": budgetSummary.totalIncome - budgetSummary.totalExpenses < 0,
                })}>
                    {formatCurrency(budgetSummary.totalIncome - budgetSummary.totalExpenses)}
                </div>
            </div>
        </div>
    );
};