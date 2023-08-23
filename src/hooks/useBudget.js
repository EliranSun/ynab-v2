import { useContext, useMemo } from "react";
import { BudgetContext, getDateKey } from "../context";

export const useBudget = (timestamp) => {
  const { budget } = useContext(BudgetContext);
  const key = getDateKey(timestamp);
  const thisMonthBudget = budget[key];
  
  return useMemo(() => {
    if (!thisMonthBudget) return { income: 0, outcome: 0 };
    
    let incomeTotal = 0;
    let outcomeTotal = 0;
    
    Object.entries(thisMonthBudget).forEach(([categoryId, category]) => {
      const amounts = Object.values(category).reduce((sum, amount) => sum + amount, 0);
      console.log({ amounts, categoryId });
      if (categoryId === '8') {
        incomeTotal += amounts;
      } else {
        outcomeTotal += amounts;
      }
    });
    
    return { income: incomeTotal, outcome: outcomeTotal, key };
  }, [key, thisMonthBudget]);
};