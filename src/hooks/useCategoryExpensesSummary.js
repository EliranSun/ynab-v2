import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {ExpensesContext} from "../context";
import {getAverageExpenseAmountPerCategoryPerMonth} from "../utils/expenses";

export const useCategoryExpensesSummary = (categoryId, timestamp) => {
    const {expensesArray} = useContext(ExpensesContext);

    const averages = useMemo(() => getAverageExpenseAmountPerCategoryPerMonth(expensesArray), [expensesArray]);

    return useMemo(() => {
        const expensesInCategoryThisMonth = expensesArray.filter((expense) => {
            const date = new Date(timestamp);
            const expenseDate = new Date(expense.timestamp);

            if (expense.mainCategoryId !== categoryId) {
                return false;
            }

            if (expense.isRecurring) {
                return expenseDate.getFullYear() === date.getFullYear();
            }

            return isSameMonth(expenseDate, date);
        });

        return {
            totalExpensesSum: Math.round(expensesInCategoryThisMonth.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0)),
            averages
        }
    }, [categoryId, timestamp, expensesArray]);
}