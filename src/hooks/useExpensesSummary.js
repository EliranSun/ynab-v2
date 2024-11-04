import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {ExpensesContext} from "../context";

export const useExpensesSummary = (timestamp) => {
    const {expenses = []} = useContext(ExpensesContext);
    const categories = useCategories(timestamp);
    
    const totalExpensesThisMonth = useMemo(() => {
        return expenses.reduce((acc, curr) => {
            const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
            if (curr.isIncome || !isExpenseThisMonth) return acc;

            return acc + curr.amount;
        }, 0);
    }, [timestamp, expenses]);

    const totalIncomeThisMonth = useMemo(() => {
        return expenses.reduce((acc, curr) => {
            const isExpenseThisMonth = isSameMonth(new Date(curr.timestamp), new Date(timestamp));
            if (!curr.isIncome || !isExpenseThisMonth) return acc;

            return acc + curr.amount;
        }, 0);
    }, [timestamp, expenses]);
    
    const totalByCategory = useMemo(() => {
        return Math.round(categories.summary.reduce((acc, category) => {
            if (category.isIncome) {
                return acc + category.amount;
            }
            return acc - category.amount;
        }, 0));
    }, [categories]);
    
    const expensesTotalByCategory = useMemo(() => {
        return Math.round(categories.summary.reduce((acc, category) => {
            if (category.isIncome) {
                return acc;
            }
             
            return acc - category.amount;
        }, 0));
    }, [categories]);

    return {
        totalExpensesThisMonth,
        totalIncomeThisMonth,
        totalByCategory,
        expensesTotalByCategory,
    }
}