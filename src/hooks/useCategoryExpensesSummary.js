import { useContext, useMemo } from "react";
import { isSameMonth } from "date-fns";
import { ExpensesContext } from "../context";

export const useCategoryExpensesSummary = (categoryId, timestamp) => {
  const { expensesArray } = useContext(ExpensesContext);
  
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
    
    return Math.round(expensesInCategoryThisMonth.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0));
  }, [categoryId, timestamp, expensesArray]);
}