import {Title} from "../../atoms";
import {useContext, useMemo, useRef, useState} from "react";
import {noop} from "lodash";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {formatCurrency} from "../../../utils";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import classNames from "classnames";
import {ArrowBendDownLeft, Coin, Coins, Faders} from "@phosphor-icons/react";
import {SubcategoryBudget} from "../../atoms/SubcategoryBudget";

const Subcategory = ({
                         icon,
                         name,
                         id,
                         categoryId,
                         onSubcategoryClick = noop,
                         // isSameDate = noop,
                         isPreviousMonth = noop,
                         isSelected = false,
                         currentTimestamp,
                         isIncome,
                         thisMonthExpenses,
                         subcategoryBudget
                     }) => {
    const {expensesArray: expenses, expensesPerMonthPerCategory} = useContext(ExpensesContext);
    // const {budget} = useContext(BudgetContext);
    // const [isBudgeting, setIsBudgeting] = useState(false);
    const budgetDateKey = getDateKey(currentTimestamp);
    // const categoryBudget = budget[budgetDateKey]?.[categoryId]?.[id];
    const [budgetAmount, setBudgetAmount] = useState(Number(subcategoryBudget || 0));
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

    const getAverageAmount = (id) => {
        if (!expensesPerMonthPerCategory[id]) {
            return 0;
        }

        let total = 0;
        const months = Object.values(expensesPerMonthPerCategory[id]);


        for (const month of months) {
            total += month.amount;
        }

        if (id === "12") {
            console.log({months, total});
        }

        return formatCurrency(total / months.length, false, false) || 0;
    };

    const averageAmount = getAverageAmount(String(id));

    if (thisMonthAmount === formatCurrency(0)) {
        return null;
    }

    const isPositiveDiff = isIncome
        ? intThisMonthAmount.current < budgetAmount
        : intThisMonthAmount.current > budgetAmount;

    return (
        <div className="relative w-full md:w-[calc(50%-8px)]">
            <div className="bg-white/80 p-3 w-full h-full md:p-4 cursor-pointer flex justify-between items-center"
                 onClick={() => {
                     onSubcategoryClick(isSelected ? null : id);
                 }}>
                <div className="">
                    <Title type={Title.Types.H4} className="truncate flex">
                        {icon.slice(0, 2)} {name.slice(0, 15)}
                    </Title>
                </div>
                <div className="">
                    <div className={classNames("", {
                        "font-black md:text-3xl font-mono text-right mb-2": true,
                        "text-red-500": isPositiveDiff,
                        "text-green-400": !isPositiveDiff
                    })}>
                        {thisMonthAmount}
                    </div>
                    <div className="flex gap-4 w-full justify-end">
                        <div className="flex flex-col text-sm items-center font-mono">
                            <Faders/>
                            {averageAmount}
                        </div>
                        <div className="flex flex-col text-sm items-center font-mono">
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
            {/*{isSelected &&*/}
            {/*    <SubcategoryExpensesList*/}
            {/*        id={id}*/}
            {/*        title={`${icon} ${name}`}*/}
            {/*        timestamp={currentTimestamp}*/}
            {/*        expensesPerMonthPerCategory={expensesPerMonthPerCategory[id]}*/}
            {/*        onSubcategoryClick={onSubcategoryClick}/>}*/}
        </div>
    );
};

export default Subcategory;