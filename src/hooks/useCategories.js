import { getExpenses } from "../utils";
import { BudgetContext, getDateKey } from "../context";
import { isSameMonth } from "date-fns";
import { Categories } from "../constants";
import { useContext, useEffect, useState } from "react";

const fetch = async (budget, timestamp) => {
  if (!budget || !timestamp) return [];

  const expenses = await getExpenses();

  const newCategories = {};
  const date = new Date(timestamp);
  const budgetKey = getDateKey(timestamp);
  const expensesThisMonth = Object.values(expenses).filter(expense => {
    const expenseDate = new Date(expense.timestamp);

    if (expense.isRecurring) return expenseDate.getFullYear() === date.getFullYear();

    return isSameMonth(expenseDate, date);
  });

  Object.values(expensesThisMonth).forEach(expense => {
    if (!newCategories[expense.mainCategoryId]) {
      const category = Categories.find(category => category.id === expense.mainCategoryId);
      const subcategory = category?.subCategories.find(subcategory => subcategory.id === expense.subcategoryId);
      const categoryBudget = budget[budgetKey]?.[category.id];
      const categoryBudgetValue = categoryBudget && Object.values(categoryBudget).reduce((acc, subcategory) => {
        return acc + subcategory;
      }, 0);

      newCategories[expense.mainCategoryId] = {
        ...category,
        budget: categoryBudgetValue,
        amount: expense.amount,
        subcategories: {
          [expense.subcategoryId]: {
            ...subcategory,
            amount: expense.amount,
          }
        }
      };

      delete newCategories[expense.mainCategoryId].subCategories;
    } else if (!newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId]) {
      const subcategory = Categories
        .find(category => category.id === expense.mainCategoryId)?.subCategories
        .find(subcategory => subcategory.id === expense.subcategoryId);

      newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId] = {
        name: subcategory?.name,
        amount: expense.amount,
      }
    } else {
      newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId].amount += expense.amount;
      newCategories[expense.mainCategoryId].amount += expense.amount;
    }
  });

  return Object.values(newCategories).sort((a) => {
    return a.budget - a.amount;
  });
};

export const useCategories = (timestamp) => {
  const { budget } = useContext(BudgetContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(budget, timestamp)
      .then((results) => {
        setCategories(results);
      })
      .catch(error => {
        console.error(error);
      });
  }, [budget, timestamp]);

  return categories;
};