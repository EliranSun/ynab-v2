import { Title } from "../../atoms";
import { useContext, useMemo, useRef } from "react";
import { noop } from "lodash";
import { ExpensesContext } from "../../../context";
import { formatCurrency } from "../../../utils";
import classNames from "classnames";
// import { SubcategoryBudget } from "../../atoms/SubcategoryBudget";
import { getAverageSubcategoryAmount } from "../../../utils/expenses";
import { GuageBar } from "../../atoms/GuageBar";
import { ExpensesPopover } from "../../organisms/ExpensesPopover";

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
                    "flex flex-col justify-between items-center": true,
                    "px-2 py-1 w-40 md:w-full rounded overflow-hidden": true,
                })}>
                    <div className="w-full flex justify-between items-end">
                        <span className={classNames({ "text-gray-900 relative z-10": true })}>
                            {thisMonthAmount}
                        </span>
                    </div>
                    <GuageBar amount={intThisMonthAmount.current} max={budget} />
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
                <ExpensesPopover
                    averageAmount={averageAmount}
                    totalInPreviousMonth={totalInPreviousMonth}
                    budget={budget}
                    thisMonthExpenses={thisMonthExpenses}
                    currentTimestamp={currentTimestamp}
                    id={id}
                    name={name}
                    icon={icon}
                    isPositiveDiff={isPositiveDiff}
                /> : null}
        </div>
    );
};

export default Subcategory;