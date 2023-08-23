import { Title } from "../../atoms";
import { formatCurrency } from "../../../utils";
import { useContext, useMemo } from "react";
import { isAfter, subMonths } from "date-fns";
import { ExpensesContext } from "../../../context";
import { useBudget } from "../../../hooks/useBudget";

const IncomeSubcategoryIds = [80, 81, 82, 83];

export const PastTwelveMonthsBalance = ({ timestamp }) => {
  const { expensesArray: expenses = [] } = useContext(ExpensesContext);
  const { income: incomeBudget, outcome: expensesBudget } = useBudget(timestamp);
  
  const totalIncome = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(timestamp), 12));
      if (!IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
      return acc + curr.amount;
    }, 0);
  }, [expenses]);
  
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const isExpenseThisYear = isAfter(new Date(curr.timestamp), subMonths(new Date(timestamp), 12));
      if (IncomeSubcategoryIds.includes(curr.categoryId) || !isExpenseThisYear) return acc;
      return acc + curr.amount;
    }, 0);
  }, [expenses]);
  
  const actualBottomLine = totalIncome - totalExpenses;
  const budgetBottomLine = incomeBudget * 12 - expensesBudget * 12;
  
  return (
    <div className="text-xl font-bold bg-gray-100 p-4">
      <Title type={Title.Types.H2}>Past 12 months</Title>
      <p className="font-normal italic">
        These are the incomes and expenses over the last 12 months.
        Put in mind though - the budget is for the current month only,
        so some months (i.e. vacation) are skewing these results.
      </p>
      <div className="flex gap-4">
        <div>
          Actual: <br/>
          <span className="text-green-500">{formatCurrency(totalIncome)}</span> - <br/>
          <span className="text-red-500">{formatCurrency(totalExpenses)}</span> = <br/>
          <hr/>
          {formatCurrency(actualBottomLine)}
        </div>
        
        <div>
          Budget: <br/>
          <span className="text-green-500">{formatCurrency(incomeBudget * 12)}</span> - <br/>
          <span className="text-red-500">{formatCurrency(expensesBudget * 12)}</span> = <br/>
          <hr/>
          {formatCurrency(budgetBottomLine)}
        </div>
        
        <div>
          Diffs: <br/>
          <span className="text-green-500">
            {formatCurrency(totalIncome - (incomeBudget * 12))}
          </span> - <br/>
          <span className="text-red-500">
            {formatCurrency(totalExpenses - (expensesBudget * 12))}</span> = <br/>
          <hr/>
          {formatCurrency(actualBottomLine - budgetBottomLine)}
        </div>
      </div>
    </div>
  )
};