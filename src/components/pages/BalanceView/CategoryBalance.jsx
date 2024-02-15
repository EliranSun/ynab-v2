import {useContext, useMemo, useState} from "react";
import {orderBy} from "lodash";
import {isSameMonth} from "date-fns";
import {Coin, Coins, PiggyBank, Smiley, SmileySad} from "@phosphor-icons/react";
import {Categories} from "../../../constants";
import {formatCurrency} from "../../../utils";
import Subcategory from "./Subcategory";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {useCategoryExpensesSummary} from "../../../hooks/useCategoryExpensesSummary";
import classNames from "classnames";

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
    // const categoryBudget = useCategoryBudget(categoryId, currentTimestamp);
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
    const isIncome = categoryId === INCOME_CATEGORY_ID;

    return (
        <div className="bg-gray-200 p-2 md:p-4 w-full max-w-3xl box-border relative">
            <div
                className="flex items-center justify-between gap-2 md:gap-4 text-sm md:text-xl font-bold cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}>
                <span className="w-1/4">{categoryName}</span>
                <div className="flex flex-col gap-1 w-2/3 md:w-1/2 text-right items-end">
                    <div className="flex items-end">
                        {formatCurrency(totalExpensesSum, false, false)}
                    </div>
                    <div className="w-full flex text-sm gap-4 justify-end">
                        <div className="flex items-center">
                            <Coins/>
                            {formatCurrency(averages[categoryId], false, false)}
                        </div>
                        <div className="flex items-center">
                            <PiggyBank/>
                            {formatCurrency(categoryBudget, false, false)}
                        </div>
                        <div className={classNames("", {
                            "text-green-500": diff > 0,
                            "text-red-500": diff < 0
                        })}>
                            {formatCurrency(diff)}
                        </div>
                    </div>
                </div>
            </div>
            {isExpanded ?
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
                </div> : null}
        </div>
    )
};
