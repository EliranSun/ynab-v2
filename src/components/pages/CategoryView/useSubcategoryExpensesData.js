import { useMemo } from "react";
import { isSameMonth, subMonths } from "date-fns";

const calculateTotalExpenseAmount = (expenses, categoryId, selectedMonths) => {
  let total = 0;

  for (const expense of expenses) {
    if (categoryId !== expense.categoryId) {
      continue;
    }

    const calculateAllMonths = selectedMonths.length === 0;
    if (calculateAllMonths) {
      total += expense.amount;
      continue;
    }

    const expenseDate = new Date(expense.timestamp);
    const isExpenseInSelectedMonths = selectedMonths.some((month) => {
      const monthDate = new Date(month);
      return isSameMonth(monthDate, expenseDate);
    });

    if (isExpenseInSelectedMonths) {
      total += expense.amount;
    }
  }

  return total;
}

const useSubcategoryExpensesData = ({ expensesInMonths, allExpenses, subcategory, isAggregated, selectedMonths }) => {
  const subcategoryExpenses = useMemo(() => {
    const filtered = expensesInMonths.filter((expense) => {
      return expense.categoryId === subcategory.id;
    });

    if (isAggregated) {
      const aggregatedByName = filtered.reduce((acc, expense) => {
        const { name, amount } = expense;
        if (acc[name]) {
          acc[name].amount += amount;
          acc[name].count += 1;
        } else {
          acc[name] = {
            amount,
            count: 1,
          };
        }

        return acc;
      }, {});

      return Object.keys(aggregatedByName).map((name) => {
        return {
          name,
          amount: aggregatedByName[name].amount,
          average: aggregatedByName[name].amount / aggregatedByName[name].count,
          count: aggregatedByName[name].count,
        };
      });
    }

    return filtered;
  }, [expensesInMonths, isAggregated, subcategory.id]);

  const sumThisMonth = useMemo(() => {
    return calculateTotalExpenseAmount(expensesInMonths, subcategory.id, selectedMonths);
  }, [expensesInMonths, subcategory.id, selectedMonths]);

  const sumPreviousMonth = useMemo(() => {
    if (selectedMonths.length !== 1) {
      return 0;
    }

    const lastSelectedMonth = subMonths(new Date(selectedMonths[0]), 1);
    return calculateTotalExpenseAmount(allExpenses, subcategory.id, [lastSelectedMonth]);
  }, [allExpenses, subcategory.id, selectedMonths]);

  return {
    subcategoryExpenses,
    sumThisMonth,
    sumPreviousMonth,
  };
};

export default useSubcategoryExpensesData;