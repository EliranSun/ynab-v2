import {Title} from "../../atoms";
import {useContext, useMemo, useRef, useState} from "react";
import {noop} from "lodash";
import {ExpensesContext} from "../../../context";
import {formatCurrency} from "../../../utils";
import classNames from "classnames";
import {ArrowBendDownLeft, Faders} from "@phosphor-icons/react";
import {SubcategoryBudget} from "../../atoms/SubcategoryBudget";
import {getAverageSubcategoryAmount} from "../../../utils/expenses";

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
    const {expenses, expensesPerMonthPerCategory} = useContext(ExpensesContext);
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
            if (id === expense.categoryId && isPreviousMonth(expense.timestamp)) {
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
                "cursor-pointer flex flex-col justify-between items-start": true,
                "bg-gray-200": isSelected,
            })}
            onClick={() => onSubcategoryClick(isSelected ? null : id)}>
            <div className="flex flex-col items-start">
                <div className={classNames({
                    "text-2xl font-mono": true,
                    "text-red-500": isPositiveDiff,
                    "text-green-600": !isPositiveDiff
                })}>
                    {thisMonthAmount}
                </div>
                <Title type={Title.Types.H4} className="truncate flex">
                    {icon.slice(0, 2)} {name}
                </Title>
            </div>
            {isSelected ?
                <div className="absolute z-30 bg-white left-full p-4 shadow-lg border rounded-xl">
                    <div className="flex gap-4 w-full justify-end">
                        <div className="flex md:flex-col gap-1 text-sm items-center font-mono">
                            <Faders/>
                            {averageAmount.amount}
                        </div>
                        <div className="flex md:flex-col gap-1 text-sm items-center font-mono">
                            <ArrowBendDownLeft/>
                            {totalInPreviousMonth}
                        </div>
                        <SubcategoryBudget
                            isMeetingBudget={!isPositiveDiff}
                            budgetAmount={budget}/>
                    </div>
                </div> : null}
        </div>
    );
};

export default Subcategory;