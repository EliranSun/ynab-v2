import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {ExpensesContext} from "../context";
import {getAverageExpenseAmountPerCategoryPerMonth} from "../utils/expenses";

export const useCategoryExpensesSummary = (subcategories, timestamp) => {
    const {expenses} = useContext(ExpensesContext);

    const averages = useMemo(() => getAverageExpenseAmountPerCategoryPerMonth(expenses), [expenses]);

    return useMemo(() => {
        const expensesInCategoryThisMonth = expenses.filter((expense) => {
            const date = new Date(timestamp);
            const expenseDate = new Date(expense.timestamp);
            const subcategoriesIds = subcategories.map(subcategory => subcategory.id);
            
            if (!subcategoriesIds.includes(expense.subcategoryId)) {
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
    }, [subcategories, averages, timestamp, expenses]);
}