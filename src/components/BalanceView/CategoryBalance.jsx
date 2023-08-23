import { Categories } from "../../constants";
import { formatCurrency } from "../../utils";
import Subcategory from "./Subcategory";
import { useContext, useMemo, useState } from "react";
import { BudgetContext, ExpensesContext, getDateKey } from "../../context";
import { orderBy } from "lodash";
import { isSameMonth } from "date-fns";

export const CategoryBalance = ({ categoryId, categoryName, currentTimestamp, isSameDate, isPreviousMonth }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { expensesArray } = useContext(ExpensesContext);
  const { budget } = useContext(BudgetContext);
  const budgetKey = getDateKey(currentTimestamp);
  const subcategories = Categories.find((c) => c.id === categoryId)?.subCategories;
  
  const categoryBudget = useMemo(() => {
    if (!budget[budgetKey]?.[categoryId]) return 0;
    
    return Object.values(budget[budgetKey]?.[categoryId]).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }, [budget, budgetKey, categoryId]);
  
  const totalExpensesSum = useMemo(() => {
    const expensesInCategoryThisMonth = expensesArray.filter((expense) => {
      const date = new Date(currentTimestamp);
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
  }, [categoryId, currentTimestamp, expensesArray]);
  
  
  if (totalExpensesSum === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-200 px-4 pb-4 w-fit">
      <div className="flex justify-between my-2">
        <div className="flex items-center gap-2 my-2">
          <span className="text-2xl font-bold">{categoryName}</span>
          <span className="text-3xl font-bold">{formatCurrency(totalExpensesSum)}</span>/
          <span className="text-3xl font-bold">
            {formatCurrency(categoryBudget, true)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 min-w-fit flex-wrap">
        {orderBy(subcategories, (item) => {
          const subcategoryBudget = budget[budgetKey]?.[categoryId]?.[item.id];
          const expensesInCategory = expensesArray.filter((expense) => {
            return expense.categoryId === item.id;
          });
          const thisMonthAmount = () => {
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
            
            return thisMonthExpenses.reduce((acc, expense) => {
              return acc + expense.amount;
            }, 0);
          };
          
          const amount = thisMonthAmount();
          return subcategoryBudget - amount;
        }).map((subcategory) => {
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
