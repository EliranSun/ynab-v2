import {useContext, useMemo, useState} from "react";
import {orderBy} from "lodash";
import {isSameMonth} from "date-fns";
import {Smiley, SmileySad} from "@phosphor-icons/react";
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
                                    isOpen,
                                }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const {expensesArray} = useContext(ExpensesContext);
    const {budget} = useContext(BudgetContext);
    const budgetKey = getDateKey(currentTimestamp);
    // const categoryBudget = useCategoryBudget(categoryId, currentTimestamp);
    const totalExpensesSum = useCategoryExpensesSummary(categoryId, currentTimestamp);
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
        <div className="bg-gray-200 p-2 md:p-4 w-full max-w-2xl box-border relative">
            <div
                className="flex items-center justify-between gap-2 md:gap-4 my-2 text-sm md:text-xl font-bold"
                onClick={() => setIsExpanded(!isExpanded)}>
                <span className="w-1/4">{categoryName}</span>
                <div className="flex gap-4 w-2/3 md:w-1/2 text-right items-center">
                    <span className="w-1/3">{formatCurrency(totalExpensesSum, false, false)}</span>
                    <span className="w-1/3">{formatCurrency(categoryBudget, false, false)}</span>
                    <span className={classNames("w-1/3 flex items-center gap-2 justify-end", {
                        "text-green-500": diff > 0,
                        "text-red-500": diff < 0
                    })}>
                        {!isIncome ? formatCurrency(diff) : null}
                    </span>
                </div>
            </div>
            <div className={classNames("hidden md:inline absolute -right-6 top-0 bottom-0 m-auto", {
                "text-green-500": diff > 0,
                "text-red-500": diff < 0
            })}>
                {!isIncome ? diff > 0 ? <Smiley/> : <SmileySad/> : null}
            </div>
            {isExpanded ?
                <div className="flex gap-2 min-w-fit flex-wrap items-stretch">
                    {subcategories.map((subcategory) => {
                        if (subcategory.amount === 0)
                            return null;

                        return (
                            <Subcategory
                                {...subcategory}
                                key={subcategory.id}
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
