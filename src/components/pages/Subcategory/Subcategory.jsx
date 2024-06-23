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
                         label,
                         id,
                         categoryId,
                         onSubcategoryClick = noop,
                         isPreviousMonth = noop,
                         isSelected = false,
                         isIncome,
                         thisMonthExpenses,
                         subcategoryBudget
                     }) => {
    const {expensesArray: expenses, expensesPerMonthPerCategory} = useContext(ExpensesContext);
    const [budgetAmount] = useState(Number(subcategoryBudget || 0));
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

    if (thisMonthAmount === formatCurrency(0)) {
        return null;
    }

    const isPositiveDiff = isIncome
        ? intThisMonthAmount.current < budgetAmount
        : intThisMonthAmount.current > budgetAmount;

    return (
        <div className="bg-white/80 p-3 md:min-w-60 flex justify-between">
            <div
                className="md:p-4 cursor-pointer flex flex-col justify-between items-start"
                onClick={() => onSubcategoryClick(isSelected ? null : id)}>
                <Title type={Title.Types.H4} className="truncate flex">
                    {icon.slice(0, 2)} {label}
                </Title>
                <div className="">
                    <div className="flex gap-4 w-full justify-end">
                        <div className="flex md:flex-col gap-1 text-sm items-center font-mono">
                            <Faders/>
                            {averageAmount}
                        </div>
                        <div className="flex md:flex-col gap-1 text-sm items-center font-mono">
                            <ArrowBendDownLeft/>
                            {totalInPreviousMonth}
                        </div>
                        <SubcategoryBudget
                            categoryId={categoryId}
                            subcategoryId={id}
                            isMeetingBudget={!isPositiveDiff}
                            budgetAmount={budgetAmount}/>
                    </div>
                </div>
            </div>

            <div className={classNames({
                "font-black text-3xl font-mono mb-2": true,
                "text-red-500": isPositiveDiff,
                "text-green-400": !isPositiveDiff
            })}>
                {thisMonthAmount}
            </div>
        </div>
    );
};

export default Subcategory;