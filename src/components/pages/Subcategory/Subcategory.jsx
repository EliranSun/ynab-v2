import { Title } from "../../atoms";
import { useContext, useMemo, useRef } from "react";
import { noop } from "lodash";
import { ExpensesContext } from "../../../context";
import { formatCurrency } from "../../../utils";
import classNames from "classnames";
import { SubcategoryBudget } from "../../atoms/SubcategoryBudget";
import { getAverageSubcategoryAmount } from "../../../utils/expenses";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

const Subcategory = ({
    icon,
    name,
    id,
    budget,
    onSubcategoryClick = noop,
    isPreviousMonth = noop,
    isSelected = false,
    isIncome,
    thisMonthExpenses,
}) => {
    const { _ } = useLingui();
    const { expenses, expensesPerMonthPerCategory } = useContext(ExpensesContext);
    const intThisMonthAmount = useRef(0);
    const thisMonthAmount = useMemo(() => {
        const amount = thisMonthExpenses.reduce((acc, expense) => {
            return acc + expense.amount;
        }, 0);

        intThisMonthAmount.current = amount;
        return formatCurrency(amount, false, false);
    }, [thisMonthExpenses]);

    const totalInPreviousMonth = useMemo(() => {
        const amount = expenses.reduce((total, expense) => {
            debugger;
            if (id === expense.subcategoryId && isPreviousMonth(expense.timestamp)) {
                return total + expense.amount;
            }
            return total;
        }, 0);
        return formatCurrency(amount, false, false);
    }, [expenses, id, isPreviousMonth]);

    const averageAmount = getAverageSubcategoryAmount(String(id), expensesPerMonthPerCategory);

    // if (thisMonthAmount === formatCurrency(0, false, false)) {
    //     return null;
    // }

    const isPositiveDiff = isIncome
        ? intThisMonthAmount.current < budget
        : intThisMonthAmount.current > budget;

    return (
        <div
            className={classNames({
                "relative": false,
                "cursor-pointer flex flex-col md:justify-between items-start": true,
                // "border border-gray-100": isSelected,
            })}
            onClick={() => onSubcategoryClick(isSelected ? null : id)}>
            <div className="flex flex-row-reverse md:flex-col items-start justify-between w-full">
                <div className={classNames({
                    "text-lg font-mono": true,
                    "text-red-500": isPositiveDiff,
                    "text-green-600": !isPositiveDiff
                })}>
                    {thisMonthAmount}
                </div>
                <Title type={Title.Types.H5} className={classNames({
                    "truncate flex": true,
                    "font-bold": isSelected,
                    "text-gray-900": isSelected,
                    "font-normal": !isSelected,
                    "text-gray-700": !isSelected
                })}>
                    {icon.slice(0, 2)} {name}
                </Title>
            </div>
            {isSelected ?
                <div className="w-full md:w-auto md:absolute z-30 bg-white md:left-full p-4 md:shadow-lg border rounded-xl">
                    <div className="flex justify-evenly gap-4 w-full">
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
                </div> : null}
        </div>
    );
};

export default Subcategory;