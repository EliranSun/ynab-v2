import {useContext, useMemo, useState} from "react";
import {orderBy} from "lodash";
import {isSameMonth} from "date-fns";
import {Categories} from "../../../constants";
import {formatCurrency} from "../../../utils";
import Subcategory from "./Subcategory";
import {BudgetContext, ExpensesContext, getDateKey} from "../../../context";
import {useCategoryExpensesSummary} from "../../../hooks/useCategoryExpensesSummary";

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

    return (
        <div className="bg-gray-200 px-2 pb-4 w-full max-w-xl box-border">
            <div className="flex justify-between gap-2 md:gap-4 my-2 text-sm md:text-xl font-bold"
                 onClick={() => setIsExpanded(!isExpanded)}>
                <span className="w-1/4">{categoryName}</span>
                <div className="flex gap-4">
                    <span className="">{formatCurrency(totalExpensesSum, false, false)}</span>
                    <span className="">{formatCurrency(categoryBudget, false, false)}</span>
                </div>
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
