import {Title} from "../../atoms";
import {useContext, useMemo, useRef, useState} from "react";
import {noop} from "lodash";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {formatCurrency} from "../../../utils";
import SubcategoryExpensesList from "./SubcategoryExpensesList";
import classNames from "classnames";
import {SetBudgetButton} from "../../atoms/SetBudgetButton/SetBudgetButton";

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
                         thisMonthExpenses
                     }) => {
    const {expensesArray: expenses, expensesPerMonthPerCategory} = useContext(ExpensesContext);
    const {budget} = useContext(BudgetContext);
    const [isBudgeting, setIsBudgeting] = useState(false);
    const budgetDateKey = getDateKey(currentTimestamp);
    const categoryBudget = budget[budgetDateKey]?.[categoryId]?.[id];
    const [budgetAmount, setBudgetAmount] = useState(Number(categoryBudget || 0));
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
        return formatCurrency(amount);
    }, [expenses, id, isPreviousMonth]);

    const getAverageAmount = (id) => {
        if (!expensesPerMonthPerCategory[id]) {
            return 0;
        }

        let total = 0;
        let count = 0;
        const months = Object.values(expensesPerMonthPerCategory[id]);
        for (const month of months) {
            total += month.amount;
            count += month.expenses.length;
        }

        return formatCurrency(total / count) || 0;
    };

    const averageAmount = getAverageAmount(String(id));

    if (thisMonthAmount === formatCurrency(0)) {
        return null;
    }

    const isPositiveDiff = isIncome
        ? intThisMonthAmount.current < budgetAmount
        : intThisMonthAmount.current > budgetAmount;

    return (
        <div className="md:relative min-w-fit flex-grow">
            <div className="bg-white/80 p-3 md:p-2 cursor-pointer" onClick={() => {
                onSubcategoryClick(isSelected ? null : id);
            }}>
                <Title type={Title.Types.H6} className="truncate w-full flex">
                    {icon} {name.slice(0, 10)}
                </Title>
                <div className={classNames("flex gap-1 md:gap-2 md:mb-2", {
                    "text-red-500": isPositiveDiff,
                    "text-green-400": !isPositiveDiff
                })}>
                    <span className="font-black md:text-xl">{thisMonthAmount}</span>
                    {/*<span>/</span>*/}
                    {/*<span className="font-black md:text-xl">*/}
                    {/*  {isBudgeting*/}
                    {/*    ? <input*/}
                    {/*      type="number"*/}
                    {/*      placeholder="budget"*/}
                    {/*      className="w-20"*/}
                    {/*      value={budgetAmount}*/}
                    {/*      onClick={event => event.stopPropagation()}*/}
                    {/*      onChange={(event) => {*/}
                    {/*        setBudgetAmount(Number(event.target.value));*/}
                    {/*      }}/>*/}
                    {/*    : formatCurrency(budgetAmount)}*/}
                    {/*</span>*/}
                </div>
                {/*<div className="text-xs text-left mb-2">*/}
                {/*  <div>Previous month: {totalInPreviousMonth}</div>*/}
                {/*  <div>Average: {averageAmount}</div>*/}
                {/*</div>*/}
                {/*<div className="w-full flex justify-start">*/}
                {/*  <SetBudgetButton*/}
                {/*    isBudgeting={isBudgeting}*/}
                {/*    amount={budgetAmount}*/}
                {/*    categoryBudget={categoryBudget}*/}
                {/*    categoryId={categoryId}*/}
                {/*    subcategoryId={id}*/}
                {/*    timestamp={currentTimestamp}*/}
                {/*    onClick={setIsBudgeting}/>*/}
                {/*</div>*/}
            </div>
            {isSelected &&
                <SubcategoryExpensesList
                    id={id}
                    title={`${icon} ${name}`}
                    timestamp={currentTimestamp}
                    expensesPerMonthPerCategory={expensesPerMonthPerCategory[id]}
                    onSubcategoryClick={onSubcategoryClick}/>}
        </div>
    );
};

export default Subcategory;