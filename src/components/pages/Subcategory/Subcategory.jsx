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
import SubcategoryExpensesList from "../BalanceView/SubcategoryExpensesList";

const Subcategory = ({
    icon,
    name,
    id,
    budget,
    currentTimestamp,
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
                    "text-sm font-mono relative": true,
                    "flex justify-between items-center": true,
                    "border-2 border-dashed px-2 py-1 w-40 md:w-full rounded overflow-hidden": true,
                })}>
                    <span className={classNames({
                        "absolute  h-full top-0 right-0": true,
                        "bg-green-400": intThisMonthAmount.current <= budget,
                        "bg-red-500": intThisMonthAmount.current > budget,
                    })} style={{ 
                        width: intThisMonthAmount.current / budget * 160 
                    }} />
                    <span className={classNames({ "text-gray-900 relative z-10": true })}>
                        {thisMonthAmount}
                    </span>
                    <span className="text-[8px] relative z-10 text-gray-800">
                        {formatCurrency(budget, false, false)}
                        </span>
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
                </div> : null}
        </div>
    );
};

export default Subcategory;