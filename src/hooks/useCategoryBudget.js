import { useContext, useMemo } from "react";
import { BudgetContext, getDateKey } from "../context";

export const useCategoryBudget = (categoryId, timestamp) => {
  const { budget } = useContext(BudgetContext);
  const budgetKey = getDateKey(timestamp);
  
  return useMemo(() => {
    if (!budget[budgetKey]?.[categoryId]) return 0;
    
    return Object.values(budget[budgetKey]?.[categoryId]).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }, [budget, budgetKey, categoryId]);
};