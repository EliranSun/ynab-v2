import classNames from "classnames";
import { formatCurrency } from "../../utils/currency";
import { msg } from "@lingui/macro";
import { SubcategoryBudget } from "../atoms/SubcategoryBudget";
import { useLingui } from "@lingui/react";
import SubcategoryExpensesList from "../pages/BalanceView/SubcategoryExpensesList";

export const ExpensesPopover = ({
    averageAmount = { amount: 0 },
    totalInPreviousMonth = 0,
    budget = 0,
    thisMonthExpenses = [],
    currentTimestamp,
    id,
    name,
    icon,
    isPositiveDiff = false,
    isInline = false
}) => {
    const { _ } = useLingui();

    return (
        <div className={classNames({
            "w-full md:w-auto md:absolute md:left-full": !isInline,
            "z-30 bg-white p-4 border rounded-xl": true,
            "md:shadow-lg": !isInline,
            "md:shadow": isInline
        })}>
            <div className={classNames({
                "flex justify-evenly gap-4 w-full": true,
                "mb-3 pb-2 border-b": thisMonthExpenses.length > 0
            })}>
                <div className="flex flex-col text-sm items-center font-mono">
                    <span className="leading-3">{formatCurrency(averageAmount.amount, false, false)}</span>
                    <span className="text-[10px] leading-3">{_(msg`Average`)}</span>

                </div>
                <div className="flex flex-col text-sm items-center font-mono">
                    <span className="leading-3">{totalInPreviousMonth}</span>
                    <span className="text-[10px] leading-3">{_(msg`Last`)}</span>
                </div>
                <SubcategoryBudget
                    isMeetingBudget={!isPositiveDiff}
                    budgetAmount={budget} />
            </div>
            <SubcategoryExpensesList
                isLean
                timestamp={currentTimestamp}
                selectedSubcategoryId={id}
                subcategory={{ name, icon }} />
        </div>
    );
};
