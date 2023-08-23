import { useMemo } from "react";
import { Categories } from "../../../constants";
import { eachMonthOfInterval, format, isSameMonth, startOfMonth } from "date-fns";
import orderBy from "lodash/orderBy";
import { formatCurrency } from "../../../utils";

const useCategoryExpensesData = ({ categoryId, expenses = [], selectedMonths = [] }) => {
  const category = useMemo(() => {
    return Categories.find((category) => {
      return String(category.id) === String(categoryId);
    });
  }, [categoryId]);
  const subcategoriesIds = useMemo(() => {
    return category?.subCategories?.map((subcategory) => subcategory.id);
  }, [category]);
  const expensesInCategory = useMemo(() => {
    return expenses.filter((expense) => {
      return subcategoriesIds.includes(expense.categoryId);
    });
  }, [expenses, subcategoriesIds]);
  
  const expensesInCategoryThisMonth = useMemo(() => {
    return expenses.filter((expense) => {
      if (selectedMonths.length > 0) {
        const expenseDate = new Date(expense.timestamp);
        const inMonths = selectedMonths.some((month) => {
          const monthDate = new Date(month);
          return isSameMonth(monthDate, expenseDate);
        });
        
        if (!inMonths) {
          return false;
        }
      }
      
      return subcategoriesIds.includes(expense.categoryId);
    });
  }, [expenses, selectedMonths, subcategoriesIds]);
  const totalAmountInCategory = useMemo(
    () => {
      const amount = expensesInCategoryThisMonth.reduce((total, expense) => {
        return total + expense.amount;
      }, 0);
      
      return formatCurrency(amount);
    },
    [expensesInCategoryThisMonth]
  );
  
  const monthsAndYearsOptions = useMemo(() => {
    const monthsAndYears = [];
    const expensesByDate = orderBy(expensesInCategory, ['timestamp'], ['asc']);
    
    if (expensesByDate.length === 0) {
      return [];
    }
    
    const firstExpense = expensesByDate[0].timestamp;
    const lastExpense = expensesByDate[expensesInCategory.length - 1].timestamp;
    const firstMonthDate = startOfMonth(new Date(firstExpense));
    const lastMonthDate = startOfMonth(new Date(lastExpense));
    
    const monthsInterval = eachMonthOfInterval({
      start: firstMonthDate,
      end: lastMonthDate
    });
    
    monthsInterval.forEach((monthDate) => {
      const month = format(monthDate, 'MMM');
      const year = format(monthDate, 'yy');
      monthsAndYears.push({
        value: monthDate,
        label: `${month} ${year}`,
      });
    });
    
    return monthsAndYears;
  }, []);
  
  return {
    category,
    expensesInCategoryThisMonth,
    totalAmountInCategory,
    monthsAndYearsOptions,
  };
};

export default useCategoryExpensesData;