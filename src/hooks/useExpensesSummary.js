import {useContext, useMemo} from "react";
import {isSameMonth} from "date-fns";
import {ExpensesContext} from "../context";

export const useExpensesSummary = (timestamp) => {
    const {expenses = []} = useContext(ExpensesContext);

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

    return {
        totalExpensesThisMonth,
        totalIncomeThisMonth,
    }
}