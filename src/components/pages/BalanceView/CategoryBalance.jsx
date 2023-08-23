import { useContext, useMemo, useState } from "react";
import { orderBy } from "lodash";
import { isSameMonth } from "date-fns";
import { Categories } from "../../../constants";
import { formatCurrency } from "../../../utils";
import Subcategory from "./Subcategory";
import { BudgetContext, ExpensesContext, getDateKey } from "../../../context";
import { useCategoryBudget } from "../../../hooks/useCategoryBudget";
import { useCategoryExpensesSummary } from "../../../hooks/useCategoryExpensesSummary";

export const CategoryBalance = ({ categoryId, categoryName, currentTimestamp, isSameDate, isPreviousMonth }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { expensesArray } = useContext(ExpensesContext);
  const { budget } = useContext(BudgetContext);
  const budgetKey = getDateKey(currentTimestamp);
  const categoryBudget = useCategoryBudget(categoryId, currentTimestamp);
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
    
    
    return orderBy(sub, ["difference"], ["asc"]);
  }, [budget, budgetKey, categoryId, currentTimestamp, expensesArray]);
  
  if (totalExpensesSum === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-200 px-4 pb-4 w-fit">
      <div className="flex justify-between my-2">
        <div className="flex items-center gap-2 my-2">
          <span className="text-2xl font-bold">{categoryName}</span>
          <span className="text-3xl font-bold">{formatCurrency(totalExpensesSum)}</span>/
          <span className="text-3xl font-bold">{formatCurrency(categoryBudget)}</span>
        </div>
      </div>
      <div className="flex gap-2 min-w-fit flex-wrap">
        {subcategories.map((subcategory) => {
          if (subcategory.amount === 0) return null;
          
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
      </div>
    </div>
  )
};
