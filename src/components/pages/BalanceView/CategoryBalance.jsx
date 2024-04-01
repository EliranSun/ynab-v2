import {useContext, useMemo, useState} from "react";
import {orderBy} from "lodash";
import {isSameMonth} from "date-fns";
import {Coin, Coins, Equalizer, Exclude, Faders, PiggyBank, Smiley, SmileySad} from "@phosphor-icons/react";
import {Categories} from "../../../constants";
import {formatCurrency} from "../../../utils";
import Subcategory from "./Subcategory";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {useCategoryExpensesSummary} from "../../../hooks/useCategoryExpensesSummary";
import classNames from "classnames";
import {Title} from "../../atoms";

const INCOME_CATEGORY_ID = 8;
export const CategoryBalance = ({
                                    categoryId,
                                    categoryName,
                                    currentTimestamp,
                                    isSameDate,
                                    isPreviousMonth,
                                    categoryBudget,
                                    subcategoryBudgets,
                                    isOpen,
                                }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const {expensesArray} = useContext(ExpensesContext);
    const {budget} = useContext(BudgetContext);
    const budgetKey = getDateKey(currentTimestamp);
    const {totalExpensesSum, averages} = useCategoryExpensesSummary(categoryId, currentTimestamp);
    const subcategories = useMemo(() => {
        const sub = Categories.find((c) => c.id === categoryId)?.subCategories.map((subcategory) => {
            const subcategoryBudget = budget[budgetKey]?.[categoryId]?.[subcategory.id];
            const expensesInCategory = expensesArray.filter((expense) => {
                return expense.categoryId === subcategory.id;
            });
            const thisMonthExpenses = expensesInCategory.filter((expense) => {
                    const date = new Date(currentTimestamp);
                    const expenseDate = new Date(expense.timestamp);

                    if (expense.isRecurring) {
                        return (
                            expenseDate.getFullYear() === date.getFullYear()
                        );
                    }

                    return isSameMonth(expenseDate, date);
                }
            );

            const amount = thisMonthExpenses.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0);

            return {
                ...subcategory,
                amount,
                budget: subcategoryBudget,
                difference: subcategoryBudget - amount,
                thisMonthExpenses
            };
        });


        return orderBy(sub, ["amount"], ["desc"]);
    }, [budget, budgetKey, categoryId, currentTimestamp, expensesArray]);

    if (totalExpensesSum === 0) {
        return null;
    }

    const diff = categoryBudget - totalExpensesSum;

    return (
        <div className="bg-gray-200 p-2 md:p-4 w-full box-border relative">
            <div
                className="flex items-center justify-between gap-2 md:gap-4 text-sm md:text-xl cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-1/3 flex items-center justify-between gap-4">
                    <Title type={Title.Types.H4}>
                        {categoryName}
                    </Title>
                    <div className="font-black text-3xl font-mono">
                        {formatCurrency(totalExpensesSum, false, false)}
                    </div>
                </div>
                <div className="flex w-2/5 justify-between">
                    <div className="flex flex-col items-center w-32">
                        <div className="flex gap-1 items-center text-xs">
                            <Exclude/> {diff > 0 ? "left" : "over"}
                        </div>
                        <span className={classNames({
                            "font-bold font-mono text-lg": true,
                            "text-green-500": diff > 0,
                            "text-red-500": diff < 0
                        })}>
                            {formatCurrency(diff)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center w-32">
                        <div className="flex gap-1 items-center text-xs">
                            <PiggyBank/> budget
                        </div>
                        <span className="font-mono text-lg">
                            {formatCurrency(categoryBudget, false, false)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center w-32">
                        <div className="flex gap-1 items-center text-xs">
                            <Faders/> Average
                        </div>
                        <span className="font-mono text-lg">
                            {formatCurrency(averages[categoryId], false, false)}
                        </span>
                    </div>
                </div>
            </div>

            {
                isExpanded ?
                    <div className="flex flex-wrap gap-2 my-4">
                        {subcategories.map((subcategory) => {
                            if (subcategory.amount === 0)
                                return null;

                            return (
                                <Subcategory
                                    {...subcategory}
                                    key={subcategory.id}
                                    subcategoryBudget={subcategoryBudgets ? subcategoryBudgets[subcategory.id] : 0}
                                    categoryId={categoryId}
                                    isSelected={selectedId === subcategory.id}
                                    onSubcategoryClick={setSelectedId}
                                    currentTimestamp={currentTimestamp}
                                    isPreviousMonth={isPreviousMonth}
                                    isSameDate={isSameDate}
                                />
                            );
                        })}
                    </div> : null
            }
        </div>
    )
};
